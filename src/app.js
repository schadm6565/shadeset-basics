import {recipes,offers,colours} from './catalogue.js';
import {compareLooks} from './optimiser.js';
const selected=new Set();
const money=value=>new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR',maximumFractionDigits:0}).format(value/100);
const label=value=>value.replaceAll('-',' ').replace(/\b\w/g,c=>c.toUpperCase());
function element(tag,className,text) {
 const node=document.createElement(tag); if(className) node.className=className; if(text!==undefined) node.textContent=text; return node;
}
function renderLooks() {
 const container=document.querySelector('#looks');
 for(const [index,recipe] of recipes.entries()) {
  const card=element('article','look-card');
  card.append(element('p','eyebrow',`0${index+1} / ${recipe.occasion.toUpperCase()}`),element('h3','',recipe.name));
  const preview=element('div','preview-missing');
  const strip=element('div','colour-strip');
  for(const shade of recipe.shades) {const swatch=element('span');swatch.style.backgroundColor=colours[shade];strip.append(swatch);}
  preview.append(strip,element('span','','Recipe colour reference'),element('small','','Genuine face preview pending'));card.append(preview);
  const list=element('ol','recipe-list');
  recipe.shades.forEach((shade,i)=>{const row=element('li');row.append(element('strong','',label(shade)),element('span','',recipe.placements[i]));list.append(row);});card.append(list);
  const button=element('button','select-button','Select recipe');button.type='button';button.dataset.recipe=recipe.id;button.setAttribute('aria-pressed','false');
  button.addEventListener('click',()=>{if(selected.has(recipe.id))selected.delete(recipe.id);else selected.add(recipe.id);renderResult();});card.append(button);container.append(card);
 }
}
function basketList(basket,looks) {
 const list=element('div','basket-list');
 for(const item of basket.items) {
  const row=element('article','basket-item');
  const heading=element('div','item-heading');heading.append(element('h4','',item.type),element('strong','',money(item.price)));row.append(heading);
  row.append(element('p','',`${item.shades.map(label).join(' · ')}`),element('p','small',`${item.case} · Quantity ${item.quantity}`));
  const uses=looks.filter(r=>r.shades.some(s=>item.shades.includes(s))).map(r=>r.name);
  row.append(element('p','small',`Contributes to: ${uses.join(', ')}`),element('p','source-pending',item.sourceStatus));list.append(row);
 }
 return list;
}
function renderResult() {
 for(const button of document.querySelectorAll('[data-recipe]')) {
  const active=selected.has(button.dataset.recipe);button.setAttribute('aria-pressed',String(active));button.textContent=active?'Selected · Remove':'Select recipe';
 }
 const root=document.querySelector('#result');root.replaceChildren();
 const looks=recipes.filter(r=>selected.has(r.id));
 document.querySelector('#announcement').textContent=`${looks.length} of 3 recipes selected.`;
 if(!looks.length){root.append(element('div','empty','Select a recipe above to see a complete costed basket. Nothing is selected for you.'));return;}
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
document.querySelector('#reset').addEventListener('click',()=>{selected.clear();renderResult();});
renderLooks();renderResult();
