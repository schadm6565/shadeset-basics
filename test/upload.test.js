import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer,request as httpRequest} from 'node:http';
import sharp from 'sharp';
import {createUploadHandler,normalisePhoto,providerAssetURL,renderYouCam} from '../upload-service.js';
import {coreRecipes as recipes,colours} from '../src/catalogue.js';
import {makeIdentity} from '../src/approval.js';
import {renderRecipe} from '../src/previews.js';
import {personalPreviewSet,verifyPersonalPreviews} from '../src/upload-ui.js';
const origin='http://127.0.0.1:5173';
const picture=()=>sharp({create:{width:128,height:128,channels:3,background:'#897064'}}).png().toBuffer();
async function fixture(t,options={}){
 let calls=0;
 const handler=createUploadHandler({enabled:true,key:'test-not-a-real-key',render:async photo=>{calls++;return [{test:true}];},...options});
 const server=createServer(async(req,res)=>{if(!await handler(req,res)){res.writeHead(404);res.end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>{server.closeAllConnections();server.close(resolve);}));
 const url=`http://127.0.0.1:${server.address().port}`;
 const call=(path,options={})=>new Promise((resolve,reject)=>{
  const req=httpRequest(url+path,{method:options.method??'GET',headers:{Host:'127.0.0.1:5173',...options.headers}},res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve(new Response(Buffer.concat(chunks),{status:res.statusCode,headers:res.headers})));});
  req.on('error',reject);req.end(options.body);
 });
 async function session(){const r=await call('/api/upload/status');const data=await r.json();return {cookie:r.headers.get('set-cookie').split(';')[0],token:data.token,data};}
 const post=(session,body,headers={})=>call('/api/upload',{method:'POST',headers:{Origin:origin,Cookie:session.cookie,'X-Upload-Token':session.token,'X-Photo-Consent':'yes','Content-Type':'image/png',...headers},body});
 return {call,session,post,calls:()=>calls};
}
test('uploads require same origin, session token and explicit consent; invalid files spend nothing',async t=>{
 const f=await fixture(t),s=await f.session(),photo=await picture();
 for(const [headers,status] of [[{Origin:'https://untrusted.example'},403],[{'X-Upload-Token':'bad'},403],[{'X-Photo-Consent':'no'},400],[{'Content-Type':'text/plain'},415]])assert.equal((await f.post(s,photo,headers)).status,status);
 assert.equal((await f.post(s,Buffer.from('not png'))).status,415);
 assert.equal((await f.call('/api/upload/status',{headers:{Host:'untrusted.example'}})).status,403);
 assert.equal(f.calls(),0);assert.equal((await (await f.call('/api/upload/status',{headers:{Cookie:s.cookie}})).json()).remaining,6);
});
test('image decoder rejects disguised, corrupt, tiny and oversized inputs and strips metadata',async()=>{
 const p=await picture();assert.ok((await normalisePhoto(p,'image/png')).length);
 await assert.rejects(normalisePhoto(p,'image/jpeg'),/valid JPEG/);
 await assert.rejects(normalisePhoto(p.subarray(0,100),'image/png'),/decoded/);
 await assert.rejects(normalisePhoto(Buffer.alloc(5*1024*1024+1),'image/png'),/5 MB/);
 const tiny=await sharp({create:{width:20,height:20,channels:3,background:'white'}}).png().toBuffer();
 await assert.rejects(normalisePhoto(tiny,'image/png'),/100/);
 const large=await sharp({create:{width:2000,height:1500,channels:3,background:'white'}}).jpeg().withMetadata().toBuffer();
 const normal=await normalisePhoto(large,'image/jpeg'),meta=await sharp(normal).metadata();
 assert.equal(meta.width,1024);assert.equal(meta.height,768);assert.equal(meta.exif,undefined);assert.equal(meta.icc,undefined);
});
test('six renders per session and nine per server run cannot be exceeded by replacing cookies',async t=>{
 const f=await fixture(t),s=await f.session(),p=await picture();
 assert.equal((await f.post(s,p)).status,200);assert.equal((await f.post(s,p)).status,200);
 assert.equal((await f.post(s,p)).status,429);
 const other=await f.session();assert.equal((await f.post(other,p)).status,200);
 const third=await f.session();assert.equal((await f.post(third,p)).status,429);assert.equal(f.calls(),3);
});
test('a concurrent upload is rejected and uncertain provider failures retain reservation without retry',async t=>{
 let release,calls=0;const wait=new Promise(resolve=>release=resolve);
 const f=await fixture(t,{render:async()=>{calls++;await wait;throw Error('provider error must not leak');}}),s=await f.session(),p=await picture();
 const pending=f.post(s,p);while(calls===0)await new Promise(r=>setTimeout(r,5));
 assert.equal((await f.post(s,p)).status,409);release();const result=await pending;assert.equal(result.status,502);
 const body=await result.json();assert.equal(body.remaining,3);assert.equal(body.error.includes('provider error'),false);assert.equal(calls,1);
});
test('sample server operation remains independent of missing credentials or disabled uploads',async t=>{
 const f=await fixture(t,{key:'',enabled:false}),s=await f.session();assert.equal(s.data.enabled,false);
 assert.equal((await f.post(s,await picture())).status,503);assert.equal(f.calls(),0);
});
test('provider asset URLs reject local, credentials, redirects-to-local origins and non-HTTPS',()=>{
 for(const u of ['http://makeupar.com/image','https://makeupar.com.evil.test/image','https://127.0.0.1/image','https://user:pass@makeupar.com/image','https://makeupar.com:8080/image'])assert.throws(()=>providerAssetURL(u));
 assert.equal(providerAssetURL('https://example.s3.amazonaws.com/image.png'),'https://example.s3.amazonaws.com/image.png');
});
test('provider adapter uses exact three recipes, zero smoothing and does not send API key to upload/download URLs',async()=>{
 const photo=await picture(),requests=[];let tasks=0;
 const fetcher=async(url,options={})=>{
  requests.push({url,options});
  if(url.endsWith('/file'))return Response.json({data:{files:[{file_id:'test-file',requests:[{url:'https://test.s3.amazonaws.com/upload',method:'PUT',headers:{'Content-Type':'image/png'}}]}]}});
  if(url.endsWith('/upload'))return new Response('',{status:200});
  if(url.endsWith('/makeup-vto')&&options.method==='POST'){tasks++;return Response.json({data:{task_id:'test-task-'+tasks}});}
  if(url.includes('/makeup-vto/test-task'))return Response.json({data:{task_status:'success',results:{url:'https://test.s3.amazonaws.com/result'}}});
  if(url.endsWith('/result'))return new Response(photo);
  throw Error('Unexpected request');
 };
 const results=await renderYouCam(photo,{key:'only-test-key',signal:AbortSignal.timeout(5000),fetcher});
 assert.equal(results.length,3);assert.equal(tasks,3);
 for(const r of requests.filter(r=>r.url.includes('s3.amazonaws.com')))assert.equal(r.options.headers?.Authorization,undefined);
 const posts=requests.filter(r=>r.url.endsWith('/makeup-vto'));
 posts.forEach((p,i)=>{const body=JSON.parse(p.options.body);assert.deepEqual(body.effects,renderRecipe(recipes[i],colours).effects);assert.equal(body.effects[0].skinSmoothStrength,0);assert.equal(body.effects[0].skinSmoothColorIntensity,0);assert.equal(p.options.redirect,'error');});
 const loaded=await personalPreviewSet({photo:photo.toString('base64'),records:results},recipes,colours);assert.equal(loaded.length,3);
 loaded[0].output[10]^=1;await assert.rejects(verifyPersonalPreviews(loaded,recipes,colours),/changed/);
});
test('changing the photo changes every personal approval identity and mixed recipes cannot load',async()=>{
 const photo=await picture(),records=[];
 for(const recipe of recipes)records.push({recipeId:recipe.id,output:photo.toString('base64'),identity:await makeIdentity({photo:new Uint8Array(photo),output:new Uint8Array(photo),recipe:renderRecipe(recipe,colours)})});
 await personalPreviewSet({photo:photo.toString('base64'),records},recipes,colours);
 const other=await sharp({create:{width:128,height:128,channels:3,background:'black'}}).png().toBuffer();
 await assert.rejects(personalPreviewSet({photo:other.toString('base64'),records},recipes,colours),/changed/);
 records[2]=records[1];await assert.rejects(personalPreviewSet({photo:photo.toString('base64'),records},recipes,colours),/recipes/);
});
