import {makeIdentity} from './approval.js';
import {renderRecipe} from './previews.js';
function bytes(value){
 if(typeof value!=='string'||value.length>15*1024*1024||!value.length)throw Error('Invalid preview image.');
 const decoded=Uint8Array.from(atob(value),c=>c.charCodeAt(0));
 if(decoded[0]!==137||decoded[1]!==80||decoded[2]!==78||decoded[3]!==71)throw Error('Invalid preview image.');
 return decoded;
}
export async function personalPreviewSet(data,recipes,colours){
 if(!data||!Array.isArray(data.records)||data.records.length!==recipes.length)throw Error('The complete three-look preview was not returned.');
 const photo=bytes(data.photo),ids=new Set(data.records.map(r=>r.recipeId));
 if(ids.size!==recipes.length||!recipes.every(r=>ids.has(r.id)))throw Error('The preview recipes do not match.');
 return verifyPersonalPreviews(data.records.map(r=>({recipeId:r.recipeId,photo,output:bytes(r.output),identity:r.identity})),recipes,colours);
}
export async function verifyPersonalPreviews(loaded,recipes,colours){
 for(const record of loaded){
  const recipe=recipes.find(r=>r.id===record.recipeId);if(!recipe)throw Error('Invalid preview recipe.');
  const identity=await makeIdentity({photo:record.photo,recipe:renderRecipe(recipe,colours),output:record.output});
  if(!Object.keys(identity).every(k=>identity[k]===record.identity?.[k]))throw Error('The preview changed. Choose your photo again.');
 }
 return loaded;
}
export function setupPhotoUpload({onChange,onResult,onSample,onError}){
 const file=document.querySelector('#own-photo'),consent=document.querySelector('#photo-consent');
 const submit=document.querySelector('#generate-photo'),sample=document.querySelector('#sample-photo');
 const status=document.querySelector('#photo-status');
 let token='',enabled=false,remaining=0,inFlight=false,generation=0,controller;
 const controls=()=>{submit.disabled=inFlight||!enabled||remaining<3||!consent.checked||!file.files?.length;file.disabled=inFlight;consent.disabled=inFlight;};
 const quotaText=()=>`${remaining} renders available for this session/run; each photo uses three. Maximum nine per server run and six per session.`;
 async function refresh(){
  try{const response=await fetch('/api/upload/status',{cache:'no-store'});if(!response.ok)throw Error();const data=await response.json();token=data.token;enabled=data.enabled;remaining=data.remaining;status.textContent=enabled?quotaText():'Personal-photo previews are unavailable on this server. The sample still works.';}
  catch{enabled=false;status.textContent='Own-photo previews run in the local version, which holds the private YouCam key. The sample works here.';}
  controls();
 }
 consent.addEventListener('change',controls);
 file.addEventListener('change',()=>{
  generation++;onChange();
  const chosen=file.files?.[0];
  if(chosen&&(!['image/jpeg','image/png'].includes(chosen.type)||chosen.size>5*1024*1024||chosen.size===0)){file.value='';status.textContent='Choose a JPEG or PNG no larger than 5 MB.';}
  else status.textContent=enabled?quotaText():'Personal-photo previews are unavailable. Use the sample.';
  controls();
 });
 sample.addEventListener('click',async()=>{
  generation++;controller?.abort();file.value='';consent.checked=false;onSample();
  if(!inFlight)await refresh();controls();
 });
 submit.addEventListener('click',async()=>{
  const chosen=file.files?.[0];if(inFlight||!chosen||!consent.checked||!enabled||remaining<3)return;
  const version=++generation;onChange();inFlight=true;controller=new AbortController();controls();
  status.textContent='Generating three YouCam previews. This may take up to three minutes. Keep this tab open.';
  try{
   const response=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':chosen.type,'X-Photo-Consent':'yes','X-Upload-Token':token},body:chosen,signal:controller.signal});
   const data=await response.json();if(Number.isFinite(data.remaining))remaining=data.remaining;
   if(version!==generation)return;
   if(!response.ok)throw Error(data.error||'The preview could not be completed.');
   await onResult(data,()=>version===generation);
   if(version!==generation)return;
   file.value='';consent.checked=false;status.textContent='Your three YouCam previews are ready. Approve the looks you like. '+quotaText();
  }catch(error){if(version===generation){onError();status.textContent=error.name==='AbortError'?'Upload cancelled. Reserved quota may remain used.':error.message;}}
  finally{inFlight=false;controller=undefined;controls();if(version!==generation)await refresh();}
 });
 refresh();
}
