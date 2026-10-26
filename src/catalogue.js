// Facts re-entered from the supplied 17 October 2026 research brief.
export const snapshot = '2026-10-17';
export const shadeNames = ['vanilla','taupe','chocolate','gold','cocoa-plum','stone','nude','d-choc','woody','bronze','caramel','dusty'];
export const colours = {vanilla:'#e5cba5',taupe:'#897064',chocolate:'#604333',gold:'#c59648','cocoa-plum':'#704653'};
export const recipes = [
 {id:'soft-taupe',name:'Soft taupe',occasion:'Everyday',shades:['vanilla','taupe','chocolate'],pattern:'3colors1',intensity:40,placements:['Inner corner','Centre lid','Outer corner']},
 {id:'golden-hour',name:'Golden hour',occasion:'Dinner',shades:['vanilla','gold','chocolate'],pattern:'3colors1',intensity:60,placements:['Inner corner','Centre lid','Outer corner']},
 {id:'plum-after-dark',name:'Plum after dark',occasion:'Evening',shades:['vanilla','cocoa-plum','chocolate'],pattern:'3colors8',intensity:100,placements:['Inner corner','Upper lid','Outer lower lashes']}
];
export function combinations(values, size) {
 const out=[];
 function visit(start, selected) {
  if (selected.length===size) {out.push(selected); return;}
  for(let i=start;i<=values.length-(size-selected.length);i++) visit(i+1,[...selected,values[i]]);
 }
 visit(0,[]); return out;
}
const generated=[];
function add(type, shades, price, caseName, capacity, selected=shades) {
 const chosen=[...selected].sort();
 generated.push({id:`${type}:${chosen.join(',')}`,type,shades:[...new Set(shades)].sort(),chosen,price,case:caseName,capacity,quantity:1,source:null,sourceStatus:'Exact product URL pending verification'});
}
for (const [size,price] of [[4,32400],[10,56100]]) {
 for (const shades of combinations(shadeNames,size)) add(`Custom ${size}`,shades,price,`${size}-pan case included`,size);
}
const ready=[
 ['Cool',['vanilla','taupe','mink','chestnut','nite-light','stone','nude','d-choc','woody']],
 ['Warm',['glow','vanilla','dusty','bronze','night-light','caramel','rusty-sand','chocolate','exotic-spice']],
 ['Dark Nude',['taupe','dusty','bronze','chestnut','night-light','caramel','rust','cocoa-plum','woody']]
];
for (const [name,fixed] of ready) for (const choice of shadeNames) add(`${name} ready-made`,[...fixed,choice],51700,'10-pan case included',10,[choice]);
// Complete loose-refill configurations include one case. Multiple such offers
// remain available to the cover solver, so multiple cases are not excluded.
for (const [capacity,casePrice] of [[1,5800],[4,14500],[10,18400],[15,15600]]) {
 for(let size=1;size<=Math.min(capacity,shadeNames.length);size++) {
  for(const shades of combinations(shadeNames,size)) add(`Refills + ${capacity}-pan case`,shades,size*7300+casePrice,`${capacity}-pan empty case`,capacity);
 }
}
export const offers=generated;
