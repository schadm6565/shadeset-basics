import sharp from 'sharp';
import {randomBytes} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {coreRecipes as recipes,colours} from './src/catalogue.js';
import {renderRecipe} from './src/previews.js';
import {makeIdentity} from './src/approval.js';

sharp.cache(false);
const MAX_FILE=5*1024*1024, MAX_PIXELS=12_000_000;
const API='https://yce-api-01.makeupar.com';
const LIMIT=9, SESSION_LIMIT=6, BATCH=3;
export class UploadError extends Error { constructor(status,message){super(message);this.status=status;} }
const fail=(status,message)=>{throw new UploadError(status,message);};
export async function uploadConfig(){
 let env='';try{env=await readFile(new URL('.env',import.meta.url),'utf8');}catch{}
 const value=name=>process.env[name]??env.match(new RegExp('^'+name+'=(.*)$','m'))?.[1]?.trim().replace(/^(['"])(.*)\1$/,'$2')??'';
 return {key:value('YOUCAM_API_KEY'),enabled:value('YOUCAM_UPLOADS_ENABLED')==='1'};
}
export async function normalisePhoto(bytes,type){
 if(!bytes.length||bytes.length>MAX_FILE)fail(413,'Choose a JPEG or PNG no larger than 5 MB.');
 const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if(!((type==='image/png'&&png)||(type==='image/jpeg'&&jpeg)))fail(415,'The file must be a valid JPEG or PNG image.');
 try{
  const image=sharp(bytes,{limitInputPixels:MAX_PIXELS,failOn:'warning',animated:false});
  const meta=await image.metadata();
  if(!['png','jpeg'].includes(meta.format)||meta.pages>1||meta.width<100||meta.height<100)throw Error();
  // Fully decode, auto-orient, remove metadata and keep both dimensions below 1080.
  return await image.rotate().resize({width:1024,height:1024,fit:'inside',withoutEnlargement:true}).png().toBuffer();
 }catch{fail(415,'This image could not be decoded. Use a still JPEG/PNG of at least 100 × 100 pixels and at most 12 megapixels.');}
}
async function boundedResponse(response,max){
 if(!response.ok)throw new UploadError(502,'YouCam could not complete the preview. Try the sample instead.');
 const reader=response.body.getReader();const chunks=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max)throw Error('Response too large');chunks.push(value);}return Buffer.concat(chunks);}finally{await reader.cancel().catch(()=>{});}
}
export function providerAssetURL(value){
 let u;try{u=new URL(value);}catch{fail(502,'YouCam returned an invalid asset address.');}
 const hosts=['makeupar.com','perfectcorp.com','amazonaws.com'];
 if(u.protocol!=='https:'||u.username||u.password||(u.port&&u.port!=='443')||!hosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h)))fail(502,'YouCam returned an unsupported asset address.');
 return u.href;
}
export async function renderYouCam(photo,{key,signal,fetcher=fetch,normaliseOutput=normalisePhoto}){
 const api=async(path,body)=>{
  const r=await fetcher(API+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal,redirect:'error'});
  return JSON.parse((await boundedResponse(r,1024*1024)).toString());
 };
 const created=await api('/s2s/v2.0/file',{files:[{content_type:'image/png',file_name:'consented-photo.png',file_size:photo.length}]});
 const file=created.data?.files?.[0];
 if(!file?.file_id||file.requests?.length!==1)fail(502,'YouCam upload preparation failed.');
 const upload=file.requests[0];
 if(upload.method!=='PUT'||Object.keys(upload.headers??{}).some(k=>['authorization','cookie','host'].includes(k.toLowerCase())))fail(502,'YouCam upload preparation failed.');
 const uploaded=await fetcher(providerAssetURL(upload.url),{method:'PUT',headers:upload.headers,body:photo,signal,redirect:'error'});
 if(!uploaded.ok)fail(502,'The photo could not be sent to YouCam.');
 await uploaded.body?.cancel();
 const results=[];
 for(const recipe of recipes){
  signal.throwIfAborted();
  const params=renderRecipe(recipe,colours);
  // No POST retry: a timeout may still have consumed a unit at the provider.
  const started=await api('/s2s/v2.0/task/makeup-vto',{src_file_id:file.file_id,effects:params.effects,version:params.version});
  const id=started.data?.task_id;if(typeof id!=='string'||id.length>512)fail(502,'YouCam did not return a task identifier.');
  let result;
  for(let attempt=0;attempt<60;attempt++){
   signal.throwIfAborted();
   const status=await api('/s2s/v2.0/task/makeup-vto/'+encodeURIComponent(id));
   if(status.data?.task_status==='error')fail(502,'YouCam could not detect or render this face. Use a clear, front-facing photo.');
   if(status.data?.task_status==='success'){result=status.data.results;break;}
   await new Promise((resolve,reject)=>{const abort=()=>{clearTimeout(timer);reject(signal.reason);};const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},1500);signal.addEventListener('abort',abort,{once:true});});
  }
  if(!result)fail(504,'YouCam took too long. Reserved quota remains used to avoid duplicate charges.');
  const url=Array.isArray(result)?result[0]?.download_url??result[0]?.url:result.url??result.download_url;
  const bytes=await boundedResponse(await fetcher(providerAssetURL(url),{signal,redirect:'error'}),10*1024*1024);
  const type=bytes[0]===137?'image/png':'image/jpeg';
  const output=await normaliseOutput(bytes,type);
  const identity=await makeIdentity({photo:new Uint8Array(photo),recipe:params,output:new Uint8Array(output)});
  results.push({recipeId:recipe.id,output:output.toString('base64'),identity});
 }
 return results;
}
async function requestBytes(req){
 const chunks=[];let size=0;
 if(Number(req.headers['content-length'])>MAX_FILE)fail(413,'Choose a JPEG or PNG no larger than 5 MB.');
 const timer=setTimeout(()=>req.destroy(),15000);timer.unref();
 try{for await(const chunk of req){size+=chunk.length;if(size>MAX_FILE)fail(413,'Choose a JPEG or PNG no larger than 5 MB.');chunks.push(chunk);}return Buffer.concat(chunks);}
 finally{clearTimeout(timer);}
}
export function createUploadHandler({key='',enabled=false,render=renderYouCam,normalise=normalisePhoto,now=Date.now}={}){
 const sessions=new Map();let used=0,active=false;
 const quota=s=>({remaining:Math.min(LIMIT-used,SESSION_LIMIT-s.used),runRemaining:LIMIT-used,sessionRemaining:SESSION_LIMIT-s.used,perUpload:BATCH});
 const send=(res,status,body)=>{if(!res.destroyed){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));}};
 return async function uploadHandler(req,res){
  const path=req.url?.split('?')[0];if(!['/api/upload/status','/api/upload'].includes(path))return false;
  let input,photo,session;
  try{
   const host=req.headers.host;
   if(!['127.0.0.1:5173','localhost:5173'].includes(host))fail(403,'Open the demo on localhost to upload.');
   const cookie=req.headers.cookie?.match(/(?:^|;\s*)shadeset_session=([a-f0-9]{48})(?:;|$)/)?.[1];
   for(const [id,s] of sessions)if(now()-s.created>3600000)sessions.delete(id);
   session=sessions.get(cookie);
   if(path==='/api/upload/status'&&req.method==='GET'){
    if(!session){if(sessions.size>=100)fail(429,'Too many local sessions. Use the sample.');const id=randomBytes(24).toString('hex');session={used:0,created:now(),token:randomBytes(24).toString('hex')};sessions.set(id,session);res.setHeader('Set-Cookie',`shadeset_session=${id}; HttpOnly; SameSite=Strict; Path=/api/upload; Max-Age=3600`);}
    send(res,200,{enabled:!!key&&enabled,busy:active,token:session.token,...quota(session)});return true;
   }
   if(req.method!=='POST'||path!=='/api/upload')fail(405,'Method not allowed.');
   if(req.headers.origin!==`http://${host}`||!session||req.headers['x-upload-token']!==session.token)fail(403,'Reload this local page before uploading.');
   if(req.headers['x-photo-consent']!=='yes')fail(400,'Consent is required before sending a photo to YouCam.');
   if(!key||!enabled)fail(503,'Personal-photo previews are not enabled on this server. The sample still works.');
   if(active)fail(409,'Another preview is running. Wait for it to finish.');
   if(quota(session).remaining<BATCH)fail(429,'Preview quota reached. Use the sample instead.');
   const type=req.headers['content-type'];if(!['image/jpeg','image/png'].includes(type))fail(415,'Choose a JPEG or PNG image.');
   active=true;
   try{
    input=await requestBytes(req);photo=await normalise(input,type);input.fill(0);input=undefined;
    if(res.destroyed)throw Error('Client disconnected');
    // Atomic reservation before any provider call; never refund uncertain work.
    used+=BATCH;session.used+=BATCH;
    const disconnect=new AbortController();const onClose=()=>{if(!res.writableEnded)disconnect.abort();};res.on('close',onClose);
    try{
     const signal=AbortSignal.any([disconnect.signal,AbortSignal.timeout(180000)]);
     const records=await render(photo,{key,signal});
     send(res,200,{photo:photo.toString('base64'),records,...quota(session)});
    }finally{res.off('close',onClose);}
   }finally{active=false;}
  }catch(error){send(res,error instanceof UploadError?error.status:502,{error:error instanceof UploadError?error.message:'The preview could not be completed. No automatic retry was made; reserved quota remains used.',...(session?quota(session):{})});}
  finally{input?.fill(0);photo?.fill(0);}
  return true;
 };
}
