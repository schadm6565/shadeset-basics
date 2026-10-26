import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import sharp from 'sharp';
import {normalisePhoto,renderYouCam,UploadError} from './upload-service.js';
import {createQuotaStore} from './hosted-quota.js';

const MAX_FILE=4*1024*1024;
const COOKIE='__Host-shadeset-upload';
export function hostedConfig(env=process.env){
 return {key:env.YOUCAM_API_KEY||'',enabled:env.YOUCAM_UPLOADS_ENABLED==='1',secret:env.UPLOAD_SESSION_SECRET||'',origin:env.UPLOAD_ALLOWED_ORIGIN||'',url:env.UPSTASH_REDIS_REST_URL||'',token:env.UPSTASH_REDIS_REST_TOKEN||''};
}
const mac=(secret,text)=>createHmac('sha256',secret).update(text).digest('hex');
function equal(a,b){return typeof a==='string'&&typeof b==='string'&&a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));}
function visitorCookie(request,secret){
 const value=request.headers.get('cookie')?.match(/(?:^|;\s*)__Host-shadeset-upload=([a-f0-9]{48})\.([a-f0-9]{64})(?:;|$)/);
 return value&&equal(value[2],mac(secret,'cookie:'+value[1]))?value[1]:null;
}
export async function hostedPhoto(bytes,type){
 const decoded=await normalisePhoto(bytes,type);
 try{return await sharp(decoded).resize({width:480,height:480,fit:'inside',withoutEnlargement:true}).flatten({background:'#ffffff'}).removeAlpha().toColourspace('srgb').png().toBuffer();}
 finally{decoded.fill(0);}
}
async function readPhoto(request){
 if(Number(request.headers.get('content-length'))>MAX_FILE)throw new UploadError(413,'Choose a JPEG or PNG no larger than 4 MB for the hosted demo.');
 if(!request.body)throw new UploadError(400,'Choose a photo first.');
 const reader=request.body.getReader(),chunks=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX_FILE)throw new UploadError(413,'Choose a JPEG or PNG no larger than 4 MB for the hosted demo.');chunks.push(value);}return Buffer.concat(chunks);}
 finally{await reader.cancel().catch(()=>{});}
}
export function createHostedHandler({config=hostedConfig,storeFactory=createQuotaStore,render=renderYouCam,normalise=hostedPhoto}={}){
 return async request=>{
  let input,photo;
  const headers={'Cache-Control':'no-store','Content-Type':'application/json','X-Content-Type-Options':'nosniff'};
  const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers});
  try{
   const cfg=config(),url=new URL(request.url),status=url.pathname==='/api/upload/status';
   if(!status&&url.pathname!=='/api/upload')return reply(404,{error:'Not found'});
   if(request.method!==(status?'GET':'POST'))return reply(405,{error:'Method not allowed'});
   const unavailable=message=>reply(status?200:503,{enabled:false,remaining:0,maxFileBytes:MAX_FILE,message,error:message});
   if(!cfg.enabled)return unavailable('Personal-photo uploads are switched off. The sample still works.');
   if(!cfg.key||cfg.secret.length<32||!cfg.url||!cfg.token)return unavailable('Personal-photo uploads are not configured. The sample still works.');
   let allowed;try{allowed=new URL(cfg.origin);}catch{return unavailable('Upload origin is not configured. The sample still works.');}
   if(allowed.protocol!=='https:'||allowed.origin!==cfg.origin||url.origin!==cfg.origin)return reply(403,{error:'Open the published ShadeSet site to upload.'});
   if(request.headers.get('sec-fetch-site')==='cross-site'||(!status&&request.headers.get('origin')!==cfg.origin))return reply(403,{error:'Upload from the ShadeSet page only.'});
   let id=visitorCookie(request,cfg.secret);
   if(!id&&!status)return reply(403,{error:'Reload this page before uploading.'});
   if(!id){id=randomBytes(24).toString('hex');headers['Set-Cookie']=`${COOKIE}=${id}.${mac(cfg.secret,'cookie:'+id)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`;}
   const csrf=mac(cfg.secret,'csrf:'+id),visitor=mac(cfg.secret,'budget:'+id);
   let quotaStore,budget;
   try{quotaStore=storeFactory(cfg);budget=await quotaStore(visitor);}catch{return unavailable('Upload budget storage is unavailable or not initialised. The sample still works.');}
   if(status)return reply(200,{...budget,enabled:budget.remaining>=3,token:csrf,maxFileBytes:MAX_FILE,message:budget.remaining>=3?'One photo batch per visitor; six renders in total.':'Preview allowance reached. The sample still works.'});
   if(!equal(request.headers.get('x-upload-token'),csrf))return reply(403,{error:'Reload this page before uploading.'});
   if(request.headers.get('x-photo-consent')!=='yes')return reply(400,{error:'Consent is required before sending your photo to YouCam.'});
   if(budget.remaining<3)return reply(429,{...budget,error:'Preview allowance reached. The sample still works.'});
   const type=request.headers.get('content-type');if(!['image/jpeg','image/png'].includes(type))return reply(415,{error:'Choose a JPEG or PNG.'});
   input=await readPhoto(request);photo=await normalise(input,type);input.fill(0);input=undefined;
   request.signal.throwIfAborted();
   // Reserve the entire batch atomically AFTER validation, BEFORE any YouCam request.
   try{budget=await quotaStore(visitor,true);}catch{return unavailable('Could not confirm the upload reservation. No YouCam request was made. Use the sample.');}
   if(!budget.reserved)return reply(429,{...budget,error:'Preview allowance reached. The sample still works.'});
   const signal=AbortSignal.any([request.signal,AbortSignal.timeout(180000)]);
   const records=await render(photo,{key:cfg.key,signal,normaliseOutput:hostedPhoto});
   const payload={photo:photo.toString('base64'),records,...budget};
   // 480px RGB PNGs keep the four-image response below Vercel's 4.5 MB limit.
   if(Buffer.byteLength(JSON.stringify(payload))>4*1024*1024)throw Error('Oversized result');
   return reply(200,payload);
  }catch(error){return reply(error instanceof UploadError?error.status:502,{error:error instanceof UploadError?error.message:'Preview unavailable. Reserved units remain used; no automatic retry was made. Use the sample.',enabled:false,remaining:0});}
  finally{input?.fill(0);photo?.fill(0);}
 };
}
