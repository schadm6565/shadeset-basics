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
 let token='',enabled=false,remaining=0,maxFileBytes=5*1024*1024,inFlight=false,generation=0,controller;
 const controls=()=>{submit.disabled=inFlight||!enabled||remaining<3||!consent.checked||!file.files?.length;file.disabled=inFlight||!enabled||remaining<3;consent.disabled=inFlight||!enabled||remaining<3;};
 const quotaText=()=>{const n=Math.floor(remaining/3);return n>0?`${n} photo preview${n>1?'s':''} left`:'Photo previews used up · try our model';};
 const offText='Photo previews paused · try our model';
 async function refresh(){
  try{const response=await fetch('/api/upload/status',{cache:'no-store'});if(!response.ok)throw Error();const data=await response.json();token=data.token;remaining=data.remaining;enabled=data.enabled&&remaining>=3;maxFileBytes=data.maxFileBytes||5*1024*1024;status.textContent=enabled?quotaText():offText;}
  catch{enabled=false;status.textContent=offText;}
  controls();
 }
 const updateControls=()=>{controls();if(enabled)status.textContent=quotaText();};
 consent.addEventListener('change',updateControls);
 file.addEventListener('change',()=>{
  generation++;onChange();
  const chosen=file.files?.[0];
  if(chosen&&(!['image/jpeg','image/png'].includes(chosen.type)||chosen.size>maxFileBytes||chosen.size===0)){file.value='';status.textContent=`Choose a JPEG or PNG no larger than ${Math.floor(maxFileBytes/1024/1024)} MB.`;}
  else status.textContent=enabled?quotaText():offText;
  controls();
  if(!submit.disabled)submit.click();
 });
 sample.addEventListener('click',async()=>{
  generation++;controller?.abort();file.value='';onSample();
  if(!inFlight)await refresh();controls();
 });
 submit.addEventListener('click',async()=>{
  const chosen=file.files?.[0];if(inFlight||!chosen||!consent.checked||!enabled||remaining<3)return;
  const version=++generation;onChange();inFlight=true;controller=new AbortController();controls();
  const steps=['Getting your looks ready','Finding your eyes','Blending the shades','Almost there'];let step=0;
  status.classList.add('loading');status.textContent=steps[0];
  const ticker=setInterval(()=>{step=Math.min(step+1,steps.length-1);status.textContent=steps[step];},6000);
  try{
   const response=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':chosen.type,'X-Photo-Consent':'yes','X-Upload-Token':token},body:chosen,signal:controller.signal});
   const data=await response.json();if(Number.isFinite(data.remaining))remaining=data.remaining;if(remaining<3||data.enabled===false)enabled=false;
   if(version!==generation)return;
   if(!response.ok)throw Error(data.error||'The preview could not be completed.');
   await onResult(data,()=>version===generation);
   if(version!==generation)return;
   file.value='';status.textContent='Your looks are ready. Approve the ones you like. This visitor’s upload allowance may now be exhausted.';
  }catch(error){if(version===generation){onError();status.textContent=error.name==='AbortError'?'Upload cancelled. Reserved quota may remain used.':error.message;}}
  finally{clearInterval(ticker);status.classList.remove('loading');inFlight=false;controller=undefined;controls();if(version!==generation)await refresh();}
 });
 refresh();
}
