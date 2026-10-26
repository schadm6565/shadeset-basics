import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeIdentity} from '../src/approval.js';
import {loadPreviews,renderRecipe} from '../src/previews.js';
const bytes=text=>new TextEncoder().encode(text);
const recipes=[{id:'soft-taupe',shades:['vanilla'],intensity:40,pattern:'3colors1'}];
const colours={vanilla:'#e5cba5'};
// Network and bytes below are synthetic test fixtures, never product assets.
async function fixture(){
 const photo=bytes('fixture-photo'),output=bytes('fixture-output');
 const identity=await makeIdentity({photo,recipe:renderRecipe(recipes[0],colours),output});
 const manifest={version:1,provider:'YouCam',photo:'/public/sample.png',records:[{id:'soft-taupe',output:'/public/soft-taupe.png',...identity,createdAt:'2026-10-26T12:00:00Z',endpoint:'https://yce-api-01.makeupar.com/s2s/v2.0/task/makeup-vto',skinSmoothing:0,funding:'test fixture only'}]};
 const calls=[];
 const fetcher=async path=>{calls.push(path);return path==='/public/previews.json'?new Response(JSON.stringify(manifest),{headers:{'content-type':'application/json'}}):new Response(path===manifest.photo?photo:output,{headers:{'content-type':'image/png'}});};
 return {manifest,fetcher,calls};
}
test('verified fixture bytes and matching recipe identity load together',async()=>{
 const f=await fixture(),loaded=await loadPreviews(recipes,colours,f.fetcher);
 assert.equal(loaded.length,1);assert.equal(loaded[0].recipeId,'soft-taupe');assert.ok(loaded[0].output instanceof Uint8Array);
});
test('empty manifest is unavailable and does not request any image',async()=>{
 let calls=0;
 await assert.rejects(loadPreviews(recipes,colours,async()=>{calls++;return new Response('{"version":1,"records":[]}');}),/unavailable/);
 assert.equal(calls,1);
});
test('changed recipe or expected output hash fails closed',async()=>{
 const f=await fixture();
 await assert.rejects(loadPreviews(recipes,{vanilla:'#000000'},f.fetcher),/match/);
 f.manifest.records[0].outputHash='a'.repeat(64);
 await assert.rejects(loadPreviews(recipes,colours,f.fetcher),/match/);
});
test('external or arbitrary image paths are rejected before transmission',async()=>{
 const f=await fixture();f.manifest.photo='https://example.com/photo.png';
 await assert.rejects(loadPreviews(recipes,colours,f.fetcher),/path/);
 assert.deepEqual(f.calls,['/public/previews.json']);
});
test('missing provenance and bad HTTP responses cannot enable approval',async()=>{
 const f=await fixture();delete f.manifest.records[0].funding;
 await assert.rejects(loadPreviews(recipes,colours,f.fetcher),/provenance/);
 await assert.rejects(loadPreviews(recipes,colours,async()=>new Response('',{status:404})),/unavailable/);
});
