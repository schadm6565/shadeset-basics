// Vercel function: the same live retailer check as the local server's /api/prices.
import {livePriceCheck} from '../price-check.js';

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
    res.status(200).json(await livePriceCheck());
  } catch {
    res.status(502).json({});
  }
}
