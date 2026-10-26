import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cheapestKits, compareLooks} from '../src/optimiser.js';
import {offers, coreRecipes as recipes, recipes as allRecipes} from '../src/catalogue.js';

test('sample calculation gives the fair baseline without arbitrary filler inflation', () => {
 const result = compareLooks(recipes, offers, 9500);
 assert.equal(result.joint.subtotal, 45500);
 assert.equal(result.joint.total, 55000);
 assert.equal(result.baseline.subtotal, 64800);
 assert.equal(result.baseline.total, 74300);
 assert.equal(result.saving, 19300);
 assert.equal(result.percentage.toFixed(1), '26.0');
 assert.notEqual(result.baseline.subtotal, 97200);
});

test('all nine cheapest four-pan filler configurations survive per recipe', () => {
 for (const recipe of recipes) {
  const kits = cheapestKits(recipe.shades, offers);
  assert.equal(kits.length, 9);
  assert.ok(kits.every(k => k.subtotal === 32400));
 }
});

test('every nonempty sample subset is fully covered and no more costly jointly', () => {
 for (let mask = 1; mask < 8; mask++) {
  const chosen = recipes.filter((_, i) => mask & (1 << i));
  const result = compareLooks(chosen, offers, 9500);
  for (const basket of [result.joint, result.baseline]) {
   const coverage = new Set(basket.items.flatMap(o => o.shades));
   assert.ok(chosen.flatMap(r => r.shades).every(s => coverage.has(s)));
   assert.equal(basket.total - basket.subtotal, 9500);
  }
  assert.ok(result.joint.total <= result.baseline.total);
 }
});

test('empty input has no delivery and unavailable shades fail explicitly', () => {
 assert.equal(compareLooks([], offers, 9500).joint.total, 0);
 assert.deepEqual(cheapestKits(['unavailable'], offers), []);
 assert.throws(() => compareLooks([{shades:['unavailable']}], offers, 9500), /cover/i);
});

test('independent exhaustive subset oracle agrees on every tiny target and tied kit', () => {
 const tiny = [
  {id:'a', shades:['a'], price:3}, {id:'b', shades:['b'], price:3},
  {id:'ab', shades:['a','b'], price:6}, {id:'bc', shades:['b','c'], price:4},
  {id:'c', shades:['c'], price:2}, {id:'abc', shades:['a','b','c'], price:8}
 ];
 for (let target = 1; target < 8; target++) {
  const required = ['a','b','c'].filter((_,i) => target & (1 << i));
  let best = Infinity, expected = [];
  for (let subset = 0; subset < 2 ** tiny.length; subset++) {
   const items = tiny.filter((_,i) => subset & (1 << i));
   const coverage = new Set(items.flatMap(x => x.shades));
   if (!required.every(s => coverage.has(s))) continue;
   const cost = items.reduce((sum,x) => sum+x.price,0);
   if (cost < best) { best=cost; expected=[]; }
   if (cost === best) expected.push(items.map(x=>x.id).sort().join('|'));
  }
  const actual=cheapestKits(required,tiny);
  assert.equal(actual[0].subtotal,best);
  assert.deepEqual(actual.map(k=>k.items.map(x=>x.id).sort().join('|')).sort(),expected.sort());
 }
});
