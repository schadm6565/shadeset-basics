import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {refillSources,caseSources} from '../src/sources.js';

const sources=[...Object.values(refillSources),...Object.values(caseSources)];
const prices=new Map(sources.map(s=>[s.url,s.price]));
const app=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
const badgeCode=app.slice(app.indexOf('// Live retailer check'));
async function renderBadge(result){
 const badge={dataset:{},hidden:true};
 await vm.runInNewContext(badgeCode,{document:{querySelector:()=>badge},fetch:async()=>({ok:true,json:async()=>result}),Date});
 return badge;
}

for(const mode of ['missing stock','unreadable page','unreachable page','out of stock','all in stock']){
 test(`live price badge: ${mode}`,async()=>{
  const previous=globalThis.fetch;
  let count=0;
  globalThis.fetch=async url=>{
   const first=count++===0;
   if(first&&mode==='unreachable page')throw Error('Network unavailable');
   if(first&&mode==='unreadable page')return new Response('<html>Unavailable</html>');
   const stock=first&&mode==='missing stock'?'':`<link href="https://schema.org/${first&&mode==='out of stock'?'OutOfStock':'InStock'}">`;
   return new Response(`<meta itemprop="price" content="${prices.get(url)/100}">${stock}`);
  };
  let result;
  try{
   const {livePriceCheck}=await import(`../price-check.js?case=${encodeURIComponent(mode)}`);
   result=await livePriceCheck();
  }finally{globalThis.fetch=previous;}
  const badge=await renderBadge(result);
  assert.equal(result.total,16);
  if(mode==='all in stock'){
   assert.match(badge.textContent,/all in stock/);
   assert.equal(badge.dataset.state,'ok');
  }else{
   assert.doesNotMatch(badge.textContent,/all in stock/);
   assert.equal(badge.dataset.state,'warn');
   if(mode!=='out of stock'){
    assert.equal(result.stockUnknown.length,1);
    assert.equal(result.outOfStock.length,0);
    assert.match(badge.textContent,/1 stock unknown — check with the retailer/);
   }else{
    assert.equal(result.stockUnknown.length,0);
    assert.equal(result.outOfStock.length,1);
   }
  }
 });
}

test('badge requires explicit item evidence even if aggregate unknown counts are absent',async()=>{
 const badge=await renderBadge({checkedAt:new Date().toISOString(),total:1,match:1,changed:0,unreadable:0,outOfStock:[],items:[{availability:'unknown'}]});
 assert.doesNotMatch(badge.textContent,/all in stock/);
 assert.equal(badge.dataset.state,'warn');
 assert.match(badge.textContent,/1 stock unknown — check with the retailer/);
});
