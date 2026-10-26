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
Fresh JavaScript ES modules, semantic HTML and CSS. Node's built-in test runner for algorithm tests, a small local static development server with an explicit public-file allowlist. No third-party runtime dependencies. Delegated implementation choice: a fixed sample needs no framework or database. Docs: https://nodejs.org/api/test.html and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules . Node v20.20.1 was verified locally before build.

## Where It Runs and How Someone Tries It
Node 20+; npm test runs unit checks, npm run dev serves http://127.0.0.1:5173. No key needed for the local catalogue journey. The development server must not expose .env, .git, learner profile or arbitrary files. Local video recording is the delivery path. Public repository and video submission remain user-owned and unperformed.

## Look and Feel
CSS warm ivory canvas, chocolate text, muted olive primary button and fine borders. System serif heading stack, system sans body. Three-column cards above 900px, stacked at narrow widths. Buttons at least 44px high, keyboard focus visible, reduced-motion respected. Avoid external font and image requests.

## Components
### Catalogue and offers
src/catalogue.js contains twelve refill shades, recipes, cases and palette facts re-entered from the brief and the permitted research JSON only. Offer generation enumerates all valid chosen-shade configurations. Custom four and ten include cases; ready-made palettes include their nine fixed shades and one configurable slot. Loose refills must be combined with sufficient case capacity, including multiple cases when cheaper. Complete configuration identity includes case type and exact shade contents.
### Optimiser
src/optimiser.js uses shade bitmasks and positive integer prices in cents. Enumerate valid complete offers and minimum-cost covers. Retain ALL tied minimum-cost per-look kits; then exhaustively choose combinations across up to three looks and deduplicate by complete configuration identity. Optimise equivalent candidate states without dropping filler choices that can affect baseline reuse. Empty input costs zero including delivery. Uncoverable input returns an explicit error. Independent tiny-catalogue exhaustive test guards the algorithm.
### Approval identity
src/approval.js computes SHA-256 of photo bytes, canonical recipe data and output bytes, and validates approval tokens against all three. Absent genuine images cannot yield appearance approval. UI can demonstrate recipe selection while prominently stating preview unavailable, but that does not satisfy the genuine visual release gate.
### Presentation
src/app.js renders the sample, approval controls, basket and baseline, with explanatory limits. Product links come from source data. No untrusted HTML injection. src/style.css handles responsive design. Implements prd.md > Screens and Layout and States and Boundaries.

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
No external service in the running public app. Three genuine YouCam renders were generated on 26 October 2026 using three expressly authorised bonus units: three one-unit renders, three units spent in total. The runtime needs no API key. Exact payloads disable both skin-smoothing settings; source and unmodified PNG output hashes are recorded in public/previews.json. The dedicated permanent key stays in ignored .env. No old renders may be copied. Research catalogue URLs are ordinary links, not live inventory feeds.

## Important Failure Modes
Missing genuine renders: clearly labelled unavailable panel, no fake appearance approval. The current release includes all three verified renders. Uncoverable shade: explicit failure and no misleading total. Changed recipe/photo/output: invalidate previous approval. Empty selections: show guidance with zero cost. Server file request outside allowlist: 404.

## What Was Simplified and Why
Fixed recipes and in-memory choices keep the proof centred on fair joint purchasing. No account, backend AI or public paid endpoint is needed. This does not replace the required genuine image evidence with generated decorative art.

## Decisions and Open Issues
Agent selected dependency-free modules under Chad's delegated authority. The supplied brief's real uncertainty is whether all filler ties produce R743 rather than the unfair R1067 delivered baseline; tests must investigate this, not force the expected output. No additional learner uncertainty is invented. Genuine render authorisation and verification are complete: three one-unit renders authorised and three units spent. The initial planning approval preceded implementation.

Approved by Chad on 26 October 2026. Chad reviewed this document and approved it (his words: "i did look at everything and approved it, i just forgot to update it"); this record was updated at 20:45 SAST to reflect that review.

## Catalogue Evidence Gate
Supplied 17 October prices are valid research inputs for algorithm development, but a retailer homepage is not an exact product link. Before claiming a complete purchasable recommendation, verify exact palette/case URLs and configuration terms. Preserve the supplied snapshot separately from any later price changes. Missing sources must be disclosed and keep this release gate incomplete; do not silently remove required catalogue offers to make checks pass.
