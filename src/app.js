import {recipes,offers,colours} from './catalogue.js';
import {compareLooks} from './optimiser.js';
import {ApprovalSession} from './approval.js';
import {loadPreviews} from './previews.js';
import {setupPhotoUpload,personalPreviewSet,verifyPersonalPreviews} from './upload-ui.js';
const approvals=new ApprovalSession();
let previews=new Map(),actionVersion=0,busy=false,photoMode='sample';
const objectURLs=[];
function clearPreviewURLs(){for(const url of objectURLs)URL.revokeObjectURL(url);objectURLs.length=0;}
function imageFrom(bytes,alt){const image=element('img','face-preview');const url=URL.createObjectURL(new Blob([bytes],{type:'image/png'}));objectURLs.push(url);image.src=url;image.alt=alt;return image;}
async function decodePreviewSet(loaded){
 for(const preview of loaded){for(const bytes of [preview.photo,preview.output]){const bitmap=await createImageBitmap(new Blob([bytes],{type:'image/png'}));bitmap.close();}}
 return loaded;
}
function installPreviews(loaded){
 clearPreviewURLs();previews=new Map(loaded.map(p=>[p.recipeId,p]));
 for(const recipe of recipes){const preview=previews.get(recipe.id);if(preview)approvals.update(recipe.id,preview.identity);else approvals.remove(recipe.id);}
 selected.clear();for(const id of approvals.approvedIds())selected.add(id);
 document.querySelector('#sample-notice').textContent=previews.size?(photoMode==='own'?'YouCam preview of your photo. Approve each look explicitly. Colours are approximate; physical results may differ.':'Inspect the sample-face previews, then approve the looks you like. Colours are approximate; they do not guarantee a physical result.'):'Recipe-selection demo: genuine sample-face previews are unavailable. Selecting a recipe does not approve its appearance on a face.';
 renderLooks();renderResult();
}
async function toggleLook(recipe){
 if(busy||photoMode==='pending')return;
 if(!previews.size){if(selected.has(recipe.id))selected.delete(recipe.id);else selected.add(recipe.id);renderResult();return;}
 if(selected.has(recipe.id)){approvals.reject(recipe.id);selected.delete(recipe.id);renderResult();return;}
 const displayed=previews.get(recipe.id).identity,version=++actionVersion;busy=true;renderResult();
 try{const loaded=await decodePreviewSet(photoMode==='own'?await verifyPersonalPreviews([...previews.values()],recipes,colours):await loadPreviews(recipes,colours));if(version!==actionVersion)return;installPreviews(loaded);approvals.approve(recipe.id,displayed);selected.add(recipe.id);}
 catch(error){if(version!==actionVersion)return;if(photoMode==='own'){photoMode='pending';approvals.clear();installPreviews([]);document.querySelector('#sample-notice').textContent='Personal preview verification failed. All approvals cleared; choose your photo again or use the sample.';}else if(error.message.includes('changed')){document.querySelector('#sample-notice').textContent='A preview changed. Inspect it again before approving; affected approvals were cleared.';}else{installPreviews([]);document.querySelector('#sample-notice').textContent='Preview verification failed. Appearance approvals were cleared; only recipe selection is available.';}}
 finally{if(version===actionVersion){busy=false;renderResult();}}
}
const selected=new Set();
const money=value=>new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR',maximumFractionDigits:0}).format(value/100);
const label=value=>value.replaceAll('-',' ').replace(/\b\w/g,c=>c.toUpperCase());
function element(tag,className,text) {
 const node=document.createElement(tag); if(className) node.className=className; if(text!==undefined) node.textContent=text; return node;
}
function renderLooks() {
 const container=document.querySelector('#looks');container.replaceChildren();
 for(const [index,recipe] of recipes.entries()) {
  const card=element('article','look-card');
  card.append(element('p','eyebrow',`0${index+1} / ${recipe.occasion.toUpperCase()}`),element('h3','',recipe.name));
  const preview=element('div','preview-missing');
  const strip=element('div','colour-strip');
  for(const shade of recipe.shades) {const swatch=element('span');swatch.style.backgroundColor=colours[shade];strip.append(swatch);}
  const genuine=previews.get(recipe.id);
  if(genuine){preview.className='preview-pair';const before=element('figure');before.append(imageFrom(genuine.photo,photoMode==='own'?'Your photo, resized with metadata removed':'Unmodified synthetic sample face'),element('figcaption','','Before'));const after=element('figure');after.append(imageFrom(genuine.output,photoMode==='own'?`${recipe.name}: YouCam preview of your photo`:`${recipe.name} on the same synthetic sample face`),element('figcaption','',photoMode==='own'?'YouCam preview of your photo':'YouCam preview'));preview.append(before,after);}else preview.append(strip,element('span','','Recipe colour reference'),element('small','','Genuine face preview pending'));card.append(preview);
  const list=element('ol','recipe-list');
  recipe.shades.forEach((shade,i)=>{const row=element('li');const dot=element('span','dot');dot.style.backgroundColor=colours[shade];dot.setAttribute('aria-hidden','true');row.append(dot,element('strong','',label(shade)),element('span','',recipe.placements[i]));list.append(row);});card.append(list);
  const button=element('button','select-button','Select recipe');button.type='button';button.dataset.recipe=recipe.id;button.setAttribute('aria-pressed','false');
  button.addEventListener('click',()=>toggleLook(recipe));card.append(button);container.append(card);
 }
}
function basketList(basket,looks) {
 const list=element('div','basket-list');
 for(const item of basket.items) {
  const row=element('article','basket-item');
  const heading=element('div','item-heading');heading.append(element('h4','',item.type),element('strong','',money(item.price)));row.append(heading);
  row.append(element('p','',`${item.shades.map(label).join(' · ')}`),element('p','small',`${item.case} · Quantity ${item.quantity}`));
  const uses=looks.filter(r=>r.shades.some(s=>item.shades.includes(s))).map(r=>r.name);
  row.append(element('p','small',`Contributes to: ${uses.join(', ')}`));
  const parts=element('ul','product-links');
  for(const component of item.components){const part=element('li');const link=element('a','',`${label(component.name)} × ${component.quantity}`);link.href=component.url;link.target='_blank';link.rel='noopener noreferrer';part.append(link,element('span','',money(component.price)));parts.append(part);}
  row.append(parts,element('p','small',item.sourceStatus));list.append(row);
 }
 return list;
}
function renderResult() {
 for(const button of document.querySelectorAll('[data-recipe]')) {
  const active=selected.has(button.dataset.recipe);button.setAttribute('aria-pressed',String(active));button.disabled=busy||photoMode==='pending';button.textContent=previews.size?(active?'Approved · Reject':'Approve this look'):(active?'Selected · Remove':'Select recipe');
 }
 const root=document.querySelector('#result');root.replaceChildren();
 const looks=recipes.filter(r=>selected.has(r.id));
 document.querySelector('#announcement').textContent=previews.size?`${looks.length} of 3 looks approved.`:`${looks.length} of 3 recipes selected.`;
 if(!looks.length){root.append(element('div','empty',previews.size?'Approve a look above to see a complete costed basket. Nothing is approved for you.':'Select a recipe above to see a complete costed basket. Nothing is selected for you.'));return;}
 let result;try{result=compareLooks(looks,offers);}catch{root.append(element('div','notice','This catalogue cannot cover the selected shades. No incomplete basket is shown.'));return;}
 const layout=element('div','results-grid'),items=element('div');items.append(basketList(result.joint,looks));
 const total=element('div','cost-lines');for(const [name,value] of [['Products',result.joint.subtotal],['Local delivery estimate',result.joint.delivery],['Delivered total',result.joint.total]]) {const row=element('div');row.append(element('span','',name),element('strong','',money(value)));total.append(row);}items.append(total);
 const comparison=element('aside','comparison');comparison.append(element('p','eyebrow','THE FAIR COMPARISON'),element('h3','',`One basket. ${money(result.saving)} less.`));
 for(const [name,value] of [['Cheapest separate kits',result.baseline.total],['Your joint basket',result.joint.total]]){const row=element('div','comparison-row');row.append(element('span','',name),element('strong','',money(value)));comparison.append(row);}
 comparison.append(element('p','saving',`${result.percentage.toFixed(1)}% lower estimated total`),element('p','','Both totals include one R95 delivery. We find every cheapest kit for each recipe, then choose the combination with the cheapest shared purchase. Identical configurations count once.'));
 const details=element('details');details.append(element('summary','','Inspect the separate-kit basket'),basketList(result.baseline,looks));comparison.append(details);
 layout.append(items,comparison);root.append(layout);
}
document.querySelector('#start').addEventListener('click',()=>{document.querySelector('#sample').hidden=false;document.querySelector('#sample-heading').focus();document.querySelector('#sample').scrollIntoView({block:'start'});});
document.querySelector('#reset').addEventListener('click',()=>{actionVersion++;busy=false;approvals.clear();selected.clear();renderResult();});
renderLooks();renderResult();

setupPhotoUpload({
 onChange(){actionVersion++;busy=false;photoMode='pending';approvals.clear();installPreviews([]);document.querySelector('#sample-notice').textContent='New photo selected. All approvals cleared. Generate its previews or return to the sample.';},
 async onResult(data,isCurrent){const version=actionVersion;const loaded=await decodePreviewSet(await personalPreviewSet(data,recipes,colours));if(!isCurrent()||version!==actionVersion)return;photoMode='own';installPreviews(loaded);},
 async onSample(){const version=++actionVersion;busy=false;photoMode='sample';approvals.clear();installPreviews([]);try{const loaded=await decodePreviewSet(await loadPreviews(recipes,colours));if(version===actionVersion)installPreviews(loaded);}catch{}},
 onError(){photoMode='pending';approvals.clear();installPreviews([]);document.querySelector('#sample-notice').textContent='No personal-photo previews are approved. Retry within the remaining quota, or use the sample.';}
});

const initialVersion=actionVersion;
loadPreviews(recipes,colours).then(decodePreviewSet).then(loaded=>{if(initialVersion===actionVersion)installPreviews(loaded);}).catch(()=>{});

// Presentation-only motion layer: preloader, scroll reveals and hero parallax. No app state is read or changed.
(()=>{
 const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 root.classList.add('js');
 const loader=document.querySelector('.loader'),count=loader?.querySelector('.loader-count');
 const finish=()=>{root.classList.add('is-loaded');setTimeout(()=>loader?.remove(),1200);};
 if(!loader||reduce)finish();
 else{const start=performance.now(),duration=600;const tick=now=>{const p=Math.min(1,(now-start)/duration);if(count)count.textContent=String(Math.round((1-Math.pow(1-p,3))*100)).padStart(3,'0');if(p<1)requestAnimationFrame(tick);else setTimeout(finish,120);};requestAnimationFrame(tick);}
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target);}},{rootMargin:'0px 0px -8% 0px'});
 const watch=()=>document.querySelectorAll('[data-reveal]:not(.in),.look-card:not(.in),.basket-item:not(.in)').forEach(node=>observer.observe(node));
 watch();new MutationObserver(watch).observe(document.querySelector('main'),{childList:true,subtree:true});
 if(!reduce){const images=[...document.querySelectorAll('.hero-panels .panel img')];let queued=false;
  addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{const y=Math.min(scrollY,900);images.forEach((image,i)=>image.style.setProperty('--py',`${y*(0.03+i*0.015)}px`));queued=false;});},{passive:true});}
})();

// Live retailer check (server route /api/prices). Verifies the snapshot; it never changes the basket.
(async()=>{
 const badge=document.querySelector('#live-prices');if(!badge)return;
 try{
  const res=await fetch('/api/prices',{cache:'no-store'});if(!res.ok)return;
  const r=await res.json();const time=new Date(r.checkedAt).toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'});
  badge.textContent=r.changed||r.unreadable||r.outOfStock.length
   ?`Live check ${time}: ${r.match}/${r.total} prices match · ${r.changed} changed · ${r.unreadable} unreadable · ${r.outOfStock.length} not in stock — confirm with the retailer`
   :`Live check ${time}: all ${r.total} refill and case prices match the retailer today · all in stock`;
  badge.dataset.state=r.changed||r.outOfStock.length?'warn':'ok';badge.hidden=false;
 }catch{}
})();
