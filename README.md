# ShadeSet — fresh Basics proof of concept

**Live demo:** https://shadeset-basics.vercel.app — click *Try the sample*. No account needed.

Try three eye-makeup looks on a face, add the ones you like to your kit, and get the one cheapest basket that makes them all, compared fairly with buying each look's cheapest kit separately. For the sample with all three looks: R550 delivered vs R743, R193 less, within this catalogue and price snapshot.

## Run locally
Requires Node 20.9 or later. Install the locked dependencies; no API key is needed for the sample.

```sh
npm ci
npm test
npm run dev
```

Open http://127.0.0.1:5173 and choose **Try the sample**, then **Try it on our model** (or **Try it on you**). Choose **Add to kit** on a look to open your kit, then add more looks from **Add another look**; the basket and fair comparison update as you go. Each product has a **Shop ↗** link to the retailer.

## Current status
The catalogue calculation is implemented and independently reviewed. The sample trio calculates R550 delivered versus R743 for separate kits, retaining all cheapest filler choices. This is calculated from the supplied catalogue, not hardcoded output.

Three genuine YouCam previews now share one synthetic sample face. Each approval binds the photo, complete rendering parameters and output image hashes. Missing or changed assets fail closed into a clearly labelled recipe-only fallback. Desktop and 390px checks cover adding and removing looks, image loading and the R550/R743 comparison. Exact palette, refill and case links include itemised prices.

## Limits
Prices are a 26 October 2026 VAT-inclusive ZAR snapshot, checked against every retailer product page that day. The /api/prices route can re-check them on request; it is not shown in the current UI and never changes the basket. Local Pretoria/Johannesburg delivery is estimated at R95 once per basket. No checkout, accounts or payments; buy through the Shop links.

## Prior work and reuse
Data: catalogue prices are a 26 October 2026 snapshot (see devpost/evidence/price-check-2026-10-26.md); recipes and colour references are entered as data. All application code was written fresh in this repository, starting from an empty folder. The installed challengepost/learn-ai-basics Skill Pack shaped the scope, PRD, specification and build checklist. Chad made the product decisions and reviewed and approved the scope, PRD and specification before implementation; the approval lines were brought up to date at 20:45 SAST.

## Verification and remaining work
See devpost/verification.md and devpost/checklist.md. Planning was committed before implementation. Source research is recorded in devpost/source-follow-up.md. The public repository is https://github.com/schadm6565/shadeset-basics. Live demo: https://shadeset-basics.vercel.app (sample flow, plus one shared photo batch from a 3-render hosted allowance).

## Licence
Application code is MIT licensed; see LICENSE. Third-party names and research remain attributed facts. The Skill Pack is separately sourced by skills-lock.json.

## UI revision
The Chad-requested redesign uses eye-focused CSS crops of the unchanged genuine images, three dark hero panels, reduced-motion-aware presentation effects and a dark basket comparison. Inter Tight and JetBrains Mono are bundled locally; their SIL Open Font Licences and source notes are in public/fonts/. Approval and basket logic are unchanged.

## Optional personal-photo previews (local, plus a small hosted allowance)
Set `YOUCAM_API_KEY` and `YOUCAM_UPLOADS_ENABLED=1` in an ignored `.env`, then start the server. Keep the key out of Git. The sample works with uploads disabled or without a key.

Open **Try it on you** and choose a still JPEG/PNG (maximum 5 MB, 12 megapixels, minimum 100 × 100 pixels); the previews generate automatically. At Chad's request for the demo (commit bb0a5a2) there is no consent checkbox, notice or Generate button: choosing a photo starts the YouCam previews automatically. Photos are sent to YouCam, which generally retains uploads and results for up to 30 days under its privacy policy. Sharp decodes, strips metadata and resizes it to at most 1024 pixels per side. Three previews use the existing recipes with smoothing zero; each requires separate appearance approval. Changing the photo clears all approvals.

The local server keeps images only in memory for the request and does not log them. YouCam generally retains uploads/results for 30 days under its privacy policy. Results remain in the browser tab until replaced or reloaded.

Each batch reserves three renders before contacting YouCam: maximum nine per server run and six per session. Failed or cancelled work is not refunded locally because the provider may have charged it. There are no automatic task retries. Restarting the server resets its in-memory cap; it does not grant any additional spending permission. Locally, the endpoint is restricted to localhost with same-origin and session-token checks. The hosted deployment has its own shared allowance of 3 renders (one photo batch) enforced by a persistent counter; when it is used up, the sample still works.
