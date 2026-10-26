// Server-side live check of the retailer pages behind the catalogue snapshot.
// It verifies prices and stock; it never changes the optimiser's catalogue.
import {refillSources, caseSources} from './src/sources.js';

const TTL = 10 * 60 * 1000;
let cache = null;

function items() {
  return [
    ...Object.entries(refillSources).map(([id, s]) => ({id, kind: 'refill', url: s.url, expected: s.price})),
    ...Object.entries(caseSources).map(([size, s]) => ({id: `case-${size}`, kind: 'case', url: s.url, expected: s.price}))
  ];
}

async function checkOne(item) {
  try {
    const res = await fetch(item.url, {headers: {'User-Agent': 'ShadeSet price check (proof of concept)'}, signal: AbortSignal.timeout(8000)});
    if (!res.ok) return {...item, availability: 'unknown', status: 'unreachable'};
    const html = await res.text();
    const price = html.match(/itemprop="price"\s+content="([\d.]+)"/);
    const stock = html.match(/schema\.org\/(InStock|OutOfStock|PreOrder|BackOrder|SoldOut|Discontinued)/);
    const live = price ? Math.round(Number(price[1]) * 100) : null;
    return {
      ...item, live, availability: stock ? stock[1] : 'unknown',
      status: live === null ? 'unreadable' : live === item.expected ? 'match' : 'changed'
    };
  } catch {
    return {...item, availability: 'unknown', status: 'unreachable'};
  }
}

export async function livePriceCheck() {
  if (cache && Date.now() - cache.at < TTL) return cache.result;
  const results = await Promise.all(items().map(checkOne));
  const count = s => results.filter(r => r.status === s).length;
  const result = {
    checkedAt: new Date().toISOString(),
    total: results.length,
    match: count('match'), changed: count('changed'), unreadable: count('unreadable') + count('unreachable'),
    outOfStock: results.filter(r => ['OutOfStock', 'PreOrder', 'BackOrder', 'SoldOut', 'Discontinued'].includes(r.availability)).map(r => r.id),
    stockUnknown: results.filter(r => r.availability === 'unknown').map(r => r.id),
    items: results.map(({id, kind, expected, live, availability, status}) => ({id, kind, expected, live, availability, status}))
  };
  cache = {at: Date.now(), result};
  return result;
}
