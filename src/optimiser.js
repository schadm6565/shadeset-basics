// Prices are integer cents. Retain configuration identities even when their
// coverage is equal: free filler choices can change the fair baseline union.
export function cheapestKits(required, offers) {
 const shades=[...new Set(required)];
 if (!shades.length) return [{items:[],subtotal:0}];
 if(shades.length>20) throw new Error('Catalogue target exceeds supported size');
 const target=(1<<shades.length)-1;
 const groups=new Map();
 for(const offer of offers) {
  if(!Number.isSafeInteger(offer.price)||offer.price<=0) throw new Error('Invalid offer price');
  const coverage=shades.reduce((mask,s,i)=>mask|(offer.shades.includes(s)?1<<i:0),0);
  if(!coverage) continue;
  const group=groups.get(coverage);
  if(!group||offer.price<group.price) groups.set(coverage,{price:offer.price,offers:[offer]});
  else if(offer.price===group.price) group.offers.push(offer);
 }
 const cost=Array(target+1).fill(Infinity), paths=Array.from({length:target+1},()=>new Map());
 cost[0]=0; paths[0].set('',[]);
 for(let mask=0;mask<=target;mask++) {
  if(!Number.isFinite(cost[mask])) continue;
  for(const [coverage,group] of groups) {
   const next=mask|coverage;
   if(next===mask) continue;
   const value=cost[mask]+group.price;
   if(value>cost[next]) continue;
   if(value<cost[next]) {cost[next]=value; paths[next].clear();}
   for(const items of paths[mask].values()) for(const offer of group.offers) {
    const kit=[...items,offer].sort((a,b)=>a.id.localeCompare(b.id));
    paths[next].set(JSON.stringify(kit.map(x=>x.id)),kit);
   }
  }
 }
 return [...paths[target].values()].map(items=>({items,subtotal:cost[target]}));
}
function delivered(kit, delivery) {return {...kit,delivery:kit.items.length?delivery:0,total:kit.subtotal+(kit.items.length?delivery:0)};}
export function compareLooks(looks, offers, delivery=9500) {
 if(!Number.isSafeInteger(delivery)||delivery<0) throw new Error('Invalid delivery');
 const jointOptions=cheapestKits(looks.flatMap(r=>r.shades),offers);
 if(!jointOptions.length) throw new Error('Catalogue cannot cover these shades');
 const separate=looks.map(r=>cheapestKits(r.shades,offers));
 let best=null;
 function choose(index,union) {
  const subtotal=[...union.values()].reduce((sum,o)=>sum+o.price,0);
  if(best&&subtotal>best.subtotal) return;
  if(index===separate.length) {
   if(!best||subtotal<best.subtotal) best={items:[...union.values()],subtotal};
   return;
  }
  for(const kit of separate[index]) {
   const next=new Map(union);
   for(const item of kit.items) next.set(item.id,item);
   choose(index+1,next);
  }
 }
 choose(0,new Map());
 const joint=delivered(jointOptions[0],delivery),baseline=delivered(best,delivery);
 const saving=baseline.total-joint.total;
 return {joint,baseline,saving,percentage:baseline.total?saving/baseline.total*100:0};
}
