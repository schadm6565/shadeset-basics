---
doc: spec
status: approved
---
# ShadeSet — Technical Spec

## How This Works, In Plain Language
A small browser app reads a fixed catalogue, records which looks were approved and calculates two purchases. It tries valid product combinations instead of guessing from a prompt. There is no account, server database or payment service.

## The Core Journey Through the System
Try the sample reveals recipe cards. Approval identity is checked against the photo, recipe and render hashes. Valid selected recipes become a required-shade set. The optimiser calculates the joint basket and every cheapest separate kit; the baseline reducer chooses the cheapest union of those kits. The view displays their products and one delivery charge. Implements prd.md > The Core Journey.

## Stack
Fresh JavaScript ES modules, semantic HTML and CSS. Node's built-in test runner for algorithm tests, a small local static development server with an explicit public-file allowlist. Sharp is the sole runtime dependency, added for safe image decoding and normalisation in the optional upload flow. Proposed by the agent and approved by Chad: a fixed sample needs no framework or database. Docs: https://nodejs.org/api/test.html and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules . Node v20.20.1 was verified locally before build.

## Where It Runs and How Someone Tries It
Node 20.9+; npm ci installs dependencies, npm test runs unit checks, npm run dev serves http://127.0.0.1:5173. No key needed for the local catalogue journey. The development server must not expose .env, .git, learner profile or arbitrary files. Local video recording is the delivery path. Public repository and video submission remain user-owned and unperformed.

## Look and Feel
Image-led layout. The header shows only the wordmark, and there is no footer. Each step fits one screen at 1440×695. HERO (dark): top-left label "Eye-look planner"; top-right note "Creative Glamour prices · ZAR"; the headline; three expanding panels showing genuine YouCam eye-look crops on dark translucent chips; the intro "Approve the looks you love. Get one kit that makes them all."; Try the sample; and a slim seamless marquee. FLOW (commit 18ee803, at Chad's request): Try the sample opens "Pick your looks." with two cards, "Try it on you" (face viewfinder icon) and "Try it on our model". Choosing a face opens the looks screen: each look card has an "Add to kit" / "In your kit" button (adding a look is the approval, still bound to the photo, recipe and render), a "← Change face" back link, and "See your kit →" once at least one look is added. The kit page has "← Back to looks", each product has a "Shop ↗" link to the retailer, and the dark comparison panel explains the fair test. When the joint basket saves nothing, the headline reads "One basket. Already the cheapest." and the percentage pill is hidden. Removed from the UI: the Clear approvals button, the live price/stock badge line and the dated basket note. The /api/prices route still exists but is not shown. Inter Tight and JetBrains Mono are bundled locally; square corners, fine rules and reduced-motion-aware presentation effects.

## Components
### Catalogue and offers
src/catalogue.js contains twelve refill shades, recipes, cases and palette facts re-entered from the brief and the permitted research JSON only. Offer generation enumerates all valid chosen-shade configurations. Custom four and ten include cases; ready-made palettes include their nine fixed shades and one configurable slot. Loose refills must be combined with sufficient case capacity, including multiple cases when cheaper. Complete configuration identity includes case type and exact shade contents.
### Optimiser
src/optimiser.js uses shade bitmasks and positive integer prices in cents. Enumerate valid complete offers and minimum-cost covers. Retain ALL tied minimum-cost per-look kits; then exhaustively choose combinations across up to three looks and deduplicate by complete configuration identity. Optimise equivalent candidate states without dropping filler choices that can affect baseline reuse. Empty input costs zero including delivery. Uncoverable input returns an explicit error. Independent tiny-catalogue exhaustive test guards the algorithm.
### Approval identity
src/approval.js computes SHA-256 of photo bytes, canonical recipe data and output bytes, and validates approval tokens against all three. Absent genuine images cannot yield appearance approval. UI can demonstrate recipe selection while prominently stating preview unavailable, but that does not satisfy the genuine visual release gate.
### Presentation
src/app.js renders the sample, approval controls, basket and baseline, with explanatory limits. Product links come from source data. No untrusted HTML injection. src/style.css handles responsive design. Implements prd.md > Screens and Layout and States and Boundaries.

### Own-photo rendering (added 26 October, about 21:15)
Upload after an on-screen notice ("Sent to YouCam for the previews · kept up to 30 days"); choosing a photo is the consent action, at Chad's request; the server holds the YouCam key (never sent to the browser), renders the three existing recipes with skin smoothing zero, enforces a 9-render cap, and binds approvals to the new photo hash. No uploaded photo is written to disk or logged; request buffers are discarded after processing. YouCam generally retains images for 30 days, disclosed before consent. The limit is nine renders per server run and six per session.
### Price and stock check (added 26 October, about 21:15)
GET /api/prices fetches the exact retailer product pages server-side, extracts each listed price and stock status, and returns them with a timestamp. The UI shows a per-item badge. Results are display-only and never feed the optimiser; on failure the dated snapshot stays in use. As of commit 18ee803 the UI no longer shows the badge; the route remains available.

## Data Model
Catalogue constants are checked into Git with snapshot date and source links. Money is integer cents. Offer: stable id, product type, chosen shades, case, capacity, quantity, price and source. Kit: canonical sorted offer ids and total. Recipe: id, name, occasion, pattern, intensity and ordered shade/placement pairs. Approval: photoHash, recipeHash, outputHash and recipe id. Runtime selections are memory-only; reload clears them. Image provenance records actual creation date, endpoint, params and hashes, never guessed metadata.

## File Structure
```text
src/catalogue.js     # facts and recipe data
src/sources.js       # exact product links and component prices
src/optimiser.js     # complete offers and fair comparison
src/approval.js      # image/recipe identity
src/previews.js      # local asset and provenance integrity gate
public/previews.json # genuine outputs, exact parameters and hashes
src/app.js           # user journey
src/style.css        # responsive presentation
public/              # only authorised demo assets
index.html           # app shell
server.js            # localhost allowlisted static server
test/                # observable algorithm and identity checks
devpost/             # plan, evidence and shipping preparation
README.md            # startup, limitations and reuse
```

## External Services and Dependencies
The fixed sample requires no external rendering service. Optional local uploads use YouCam only through the server. Three genuine YouCam renders were generated on 26 October 2026 using three expressly authorised bonus units: three one-unit renders, three units spent in total. The sample needs no API key; personal uploads require the ignored server-side key and an explicit enable flag. Exact payloads disable both skin-smoothing settings; source and unmodified PNG output hashes are recorded in public/previews.json. The dedicated permanent key stays in ignored .env. No old renders may be copied. Research catalogue URLs are ordinary links, not live inventory feeds. Re-render, 26 October about 21:58 SAST, at Chad's request (the Everyday and Dinner looks were barely visible): soft-taupe and golden-hour intensity raised from 40 and 60 to 90, and all three sample previews re-rendered using 3 more units. 6 of the 9 additional units Chad approved are now used; previews.json funding and hashes are updated.

## Important Failure Modes
Missing genuine renders: clearly labelled unavailable panel, no fake appearance approval. The current release includes all three verified renders. Uncoverable shade: explicit failure and no misleading total. Changed recipe/photo/output: invalidate previous approval. Empty selections: show guidance with zero cost. Server file request outside allowlist: 404.

## What Was Simplified and Why
Fixed recipes and in-memory choices keep the proof centred on fair joint purchasing. No account, backend AI or public paid endpoint is needed. This does not replace the required genuine image evidence with generated decorative art.

## Decisions and Open Issues
Scope change by Chad, 26 October 2026 about 21:15 SAST, after reviewing the build: add own-photo rendering and the price/stock check; checkout stays cut; hard stop 22:05 with revert if not working. Chad reviewed and approved this at 21:23 SAST.
The agent proposed dependency-free modules and Chad approved them. The supplied brief's real uncertainty is whether all filler ties produce R743 rather than the unfair R1067 delivered baseline; tests must investigate this, not force the expected output. No additional learner uncertainty is invented. Genuine render authorisation and verification are complete: three one-unit renders authorised and three units spent. The initial planning approval preceded implementation.

Approved by Chad on 26 October 2026. Chad reviewed this document and approved it (his words: "i did look at everything and approved it, i just forgot to update it"); this record was updated at 20:45 SAST to reflect that review.

## Catalogue Evidence Gate
Prices and contents were checked on every exact retailer product page on 26 October 2026 (devpost/evidence/price-check-2026-10-26.md): all 21 prices, both delivery fees and all three ready-made palette shade lists match the catalogue, and every item was listed as in stock. Prices remain a dated snapshot, not live quotes.

## Public sharing checkpoint
Repository: https://github.com/schadm6565/shadeset-basics (public, MIT). Live demo: https://shadeset-basics.vercel.app, deployed from main on Vercel and checked on 26 October 2026: the sample flow reaches three approved looks and the R550 / R743 comparison, the live price check reads 16 of 16 refill and case pages matching, and /.env returns 404. Personal-photo previews are not available on the hosted demo because no API key is deployed; they run locally only. No video URL or Devpost submission is recorded here.

Chad separately authorised up to nine additional existing bonus units for the personal-photo feature and its live test. This supersedes the earlier exhausted three-unit allowance only for that capped work. Live-test spend is recorded in the verification evidence.

### Authorised personal-photo feature — 26 October 2026
This later revision supersedes the fixed-sample-only scope and the earlier exhausted three-unit allowance. Chad directly authorised up to nine additional existing YouCam bonus units, including live testing. Three one-unit renders succeeded in the live upload test; six additional units remain authorised.

The optional local upload takes a consented, validated JPEG/PNG (5 MB maximum, 12 MP maximum, 100 × 100 minimum), strips metadata and normalises it to at most 1024 pixels per side using Sharp. The API key stays in ignored .env and uploads require YOUCAM_UPLOADS_ENABLED=1. All three existing recipes use smoothing zero. Approvals bind the displayed photo, full recipe and result bytes; changing the photo clears them.

The local server keeps photos in request memory only, without logs or disk storage. YouCam generally retains inputs/results for 30 days, disclosed before consent. Results stay in the browser tab until replaced/reloaded. Caps are nine renders per server run and six per session, reserved in batches of three before provider work. Uncertain failures are not refunded and tasks are not automatically retried. Restarting does not grant further spending permission. The keyless sample remains available.

Verification: see evidence/upload-verification-2026-10-26.md. This is a local-only endpoint, not a public deployment.
