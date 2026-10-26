import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {createHostedHandler,hostedPhoto,hostedConfig} from '../hosted-upload.js';
import {createQuotaStore,LEDGER_KEY,RESERVE_SCRIPT} from '../hosted-quota.js';
import {makeIdentity} from '../src/approval.js';
import {renderRecipe} from '../src/previews.js';
import {coreRecipes as recipes,colours} from '../src/catalogue.js';
import {personalPreviewSet} from '../src/upload-ui.js';

const cfg={enabled:true,key:'test-key',secret:'test-secret-'.repeat(4),origin:'https://shadeset.example',url:'https://test.upstash.io',token:'test-token'};
const image=()=>sharp({create:{width:128,height:128,channels:3,background:'white'}}).png().toBuffer();
// Model the Redis atomic EVAL transport; production script is also exercised separately.
function database(){
 const hash=new Map([['used',0]]);let calls=0;
 const fetcher=async(url,options)=>{
  assert.equal(url,'https://test.upstash.io/');assert.equal(options.headers.Authorization,'Bearer test-token');
  const command=JSON.parse(options.body);
  assert.deepEqual(command.slice(0,4),['EVAL',RESERVE_SCRIPT,'1',LEDGER_KEY]);calls++;
  const field=command[4],reserve=command[5]==='reserve';
  let used=hash.get('used'),visitor=hash.get(field)||0;
  if(used===undefined||used<0||used>3)return Response.json({result:[-2,0,0]});
  if(reserve){
   if(used+3>3||visitor+3>3)return Response.json({result:[0,3-used,3-visitor]});
   used+=3;visitor+=3;hash.set('used',used);hash.set(field,visitor);
  }
  return Response.json({result:[1,3-used,3-visitor]});
 };
 return {hash,fetcher,calls:()=>calls};
}
function fixture(overrides={}){
 const db=database();let renders=0;
 const options={config:()=>cfg,storeFactory:c=>createQuotaStore({...c,fetcher:db.fetcher}),render:async()=>{renders++;return [];},...overrides};
 const handler=()=>createHostedHandler(options);
 async function session(handle=handler()){
  const response=await handle(new Request(cfg.origin+'/api/upload/status'));
  return {cookie:response.headers.get('set-cookie')?.split(';')[0],data:await response.json()};
 }
 const upload=(s,bytes,headers={})=>new Request(cfg.origin+'/api/upload',{method:'POST',headers:{Origin:cfg.origin,Cookie:s.cookie||'','X-Upload-Token':s.data.token||'','X-Photo-Consent':'yes','Content-Type':'image/png',...headers},body:bytes});
 return {db,handler,session,upload,renders:()=>renders};
}

test('hosted uploads fail closed for kill switch, missing key, missing storage and missing session secret',async()=>{
 for(const patch of [{enabled:false},{key:''},{url:''},{token:''},{secret:''}]){
  const f=fixture({config:()=>({...cfg,...patch})}),s=await f.session();
  assert.equal(s.data.enabled,false);assert.equal(s.data.remaining,0);assert.match(s.data.message,/sample still works/);
  assert.equal((await f.handler()(f.upload(s,await image()))).status,503);assert.equal(f.renders(),0);assert.equal(f.db.calls(),0);
 }
 assert.equal(hostedConfig({YOUCAM_UPLOADS_ENABLED:'0',YOUCAM_API_KEY:'test'}).enabled,false);
});
test('missing ledger or broken storage disables uploads without any provider calls',async()=>{
 const f=fixture();f.db.hash.delete('used');assert.equal((await f.session()).data.enabled,false);assert.equal(f.renders(),0);
 const g=fixture({storeFactory:()=>async()=>{throw Error('secret storage error');}}),s=await g.session();
 assert.equal(s.data.enabled,false);assert.equal(JSON.stringify(s.data).includes('secret storage error'),false);
});
test('concurrent separate serverless instances reserve at most three global units and three per visitor',async()=>{
 const f=fixture(),sessions=await Promise.all(Array.from({length:8},()=>f.session())),photo=await image();
 const responses=await Promise.all(sessions.map(s=>f.handler()(f.upload(s,photo))));
 assert.equal(responses.filter(r=>r.status===200).length,1);assert.equal(f.renders(),1);assert.equal(f.db.hash.get('used'),3);
 const later=await f.session();assert.equal(later.data.enabled,false);assert.equal(later.data.remaining,0);
 const g=fixture(),s=await g.session();
 const same=await Promise.all([g.handler()(g.upload(s,photo)),g.handler()(g.upload(s,photo))]);
 assert.deepEqual(same.map(r=>r.status).sort(),[200,429]);assert.equal(g.db.hash.get('used'),3);assert.equal(g.renders(),1);
});
test('invalid image, origin, token, cookie or consent consumes no quota',async()=>{
 const f=fixture(),s=await f.session(),photo=await image();
 for(const headers of [{Origin:'https://evil.example'},{'X-Upload-Token':'bad'},{Cookie:s.cookie+'bad'},{'X-Photo-Consent':'no'}])assert.ok((await f.handler()(f.upload(s,photo,headers))).status>=400);
 assert.equal((await f.handler()(f.upload(s,Buffer.from('not an image')))).status,415);
 assert.equal((await f.handler()(f.upload(s,photo,{'Content-Length':String(4*1024*1024+1)}))).status,413);
 assert.equal(f.renders(),0);assert.equal(f.db.hash.get('used'),0);
});
test('failed provider work retains durable reservation across handler recreation without retries',async()=>{
 let calls=0;const f=fixture({render:async()=>{calls++;throw Error('private provider detail');}}),s=await f.session();
 const response=await f.handler()(f.upload(s,await image()));assert.equal(response.status,502);
 assert.equal((await response.text()).includes('private provider detail'),false);assert.equal(f.db.hash.get('used'),3);
 assert.equal((await f.handler()(f.upload(s,await image()))).status,429);assert.equal(calls,1);
});
test('uncertain storage reservation fails closed and is never retried',async()=>{
 let writes=0,renders=0;
 const f=fixture({storeFactory:()=>async(visitor,reserve)=>{if(reserve){writes++;throw Error('timeout after commit');}return {remaining:3};},render:async()=>{renders++;}}),s=await f.session();
 assert.equal((await f.handler()(f.upload(s,await image()))).status,503);assert.equal(writes,1);assert.equal(renders,0);
});
test('hosted image roundtrip preserves byte-bound approvals, strips metadata and stays below payload limit',async()=>{
 const input=await sharp({create:{width:1024,height:1024,channels:4,background:'#897064'}}).png().withMetadata().toBuffer();
 const photo=await hostedPhoto(input,'image/png'),meta=await sharp(photo).metadata();
 assert.equal(meta.width,480);assert.equal(meta.hasAlpha,false);assert.equal(meta.exif,undefined);assert.equal(meta.icc,undefined);
 const f=fixture({render:async bytes=>Promise.all(recipes.map(async recipe=>({recipeId:recipe.id,output:photo.toString('base64'),identity:await makeIdentity({photo:new Uint8Array(bytes),recipe:renderRecipe(recipe,colours),output:new Uint8Array(photo)})})))}),s=await f.session();
 const response=await f.handler()(f.upload(s,input)),body=await response.json();assert.equal(response.status,200);
 assert.equal((await personalPreviewSet(body,recipes,colours)).length,3);assert.ok(JSON.stringify(body).length<4*1024*1024);
});

test('existing ledger usage is never reset when the global allowance is reduced',async()=>{
 for(const used of [3,6]){
  const f=fixture();f.db.hash.set('used',used);
  const s=await f.session();assert.equal(s.data.enabled,false);
  assert.ok((await f.handler()(f.upload(s,await image()))).status>=400);
  assert.equal(f.renders(),0);assert.equal(f.db.hash.get('used'),used);
 }
});
