---
doc: prd
status: approved
---
# ShadeSet — Product Requirements
Choose several eye looks and find one complete purchase covering their recipes. Source: scope.md > The Unique Kernel.

## The Core Journey
1. Arrive at a concise introduction with one prominent Try the sample button.
2. Inspect Everyday soft taupe, Dinner golden hour and Evening plum after dark. Each card contains its three named shades and sample-face preview when genuine output is available.
3. Explicitly approve or reject individual looks. There is no default approval. A recipe reference without a genuine preview must never be described as an appearance approval.
4. See a complete joint basket for the approved recipes: configuration, shade list, included case, quantity, price, retailer source and the looks served.
5. Compare it with independently cheapest per-look kits, using the least expensive deduplicated union across every tied cheapest configuration. Delivery appears once in both totals.
6. Remove a look and see both baskets recalculate. Reset returns to no approvals.

## Screens and Layout
One page with introduction, sample look cards and a basket/comparison section. Three desktop cards collapse into a single mobile column. Basket details stay readable at 390px without horizontal scrolling. Empty basket explains the next action. Buttons have visible focus and explicit text states.

## Look and Feel
Image-led layout. The header shows only the wordmark, and there is no footer. Each step fits one screen at 1440×695. HERO (dark): top-left label "Eye-look planner"; top-right note "Creative Glamour prices · ZAR"; the headline; three expanding panels showing genuine YouCam eye-look crops on dark translucent chips; the intro "Approve the looks you love. Get one kit that makes them all."; Try the sample; and a slim seamless marquee. FLOW (commit 18ee803, at Chad's request): Try the sample opens "Pick your looks." with two cards, "Try it on you" (face viewfinder icon) and "Try it on our model". Choosing a face opens the looks screen: each look card has an "Add to kit" / "In your kit" button (adding a look is the approval, still bound to the photo, recipe and render), a "← Change face" back link, and "See your kit →" once at least one look is added. The kit page has "← Back to looks", each product has a "Shop ↗" link to the retailer, and the dark comparison panel explains the fair test. When the joint basket saves nothing, the headline reads "One basket. Already the cheapest." and the percentage pill is hidden. Removed from the UI: the Clear approvals button, the live price/stock badge line and the dated basket note. The /api/prices route still exists but is not shown. Inter Tight and JetBrains Mono are bundled locally; square corners, fine rules and reduced-motion-aware presentation effects.

## Features and Behaviour
Source: scope.md > The POC Boundary.
- Required shades are the union of selected recipes. Every basket must cover them using purchasable configurations and adequate cases.
- Compare product subtotals separately from R95 local delivery. Describe the result as within this catalogue and dated snapshot, never globally cheapest or live stock.
- Baseline keeps every tied cheapest configuration per recipe, then minimises the union of identical complete configurations. Two custom palettes with different fillers remain different products.
- Sample expectations to investigate: products R455, delivered R550; baseline products R648, delivered R743; difference R193 (26.0%). Never encode these as output constants.
- Appearance approval binds photo bytes, full recipe and output bytes by hash. Replacement of any component invalidates approval.
- Genuine previews carry provenance and colour approximation notices. Missing previews show a plain unavailable state with recipe swatches; this is not evidence of a finished visual demo.

- **Use your own photo:** At Chad's request for the demo (commit bb0a5a2) there is no consent checkbox, notice or Generate button: choosing a photo starts the YouCam previews automatically. Photos are sent to YouCam, which generally retains uploads and results for up to 30 days under its privacy policy. The same three recipes render on their photo, up to the 9-render cap; when the cap is reached the app says so and the sample still works. Changing the photo clears all approvals. The local server does not save or log photos; YouCam’s generally 30-day retention is disclosed before consent. Runs locally only (the key stays private); the hosted demo offers the sample and the live price check.
- **Check live prices:** a button re-reads each product page and shows, per item, "price matches" or "price changed to Rx" and "in stock" or "not listed in stock", with the time checked. If the retailer can't be reached the app says so and keeps the dated snapshot. The basket and comparison never change because of this check. Update 26 October (commit 18ee803): at Chad's request this line is no longer shown in the UI; the /api/prices route remains.

## States and Boundaries
No approvals: no purchase recommendation or delivery charge. Rejection: remove that look only. No feasible basket: explain catalogue cannot cover the selection, never show partial coverage as complete. Missing image: show unavailable state. Invalidated approval: explain why re-approval is needed. Selections exist in memory and reset on reload; no personal data is stored.

## Product Decisions
Scope change, 26 October 2026 about 21:15 SAST: after reviewing the build, Chad added "use your own photo" and a live price/stock check (hard stop 22:05, reverted if not working); checkout stays cut. Chad reviewed and approved these sections at 21:23 SAST.
Chad's brief fixes the recipes, catalogue, fair comparison and cuts. The agent proposed a single-page layout and Chad approved it. Genuine image readiness was verified after Chad separately authorised three one-unit renders. This PRD does not authorise additional spending.

## What We're Building
The core journey, tested optimiser and baseline, verifiable approval identity, responsive local demonstration and local shipping materials. Source: scope.md > What "Working" Looks Like.

## Non-Goals
No live camera capture, checkout, accounts, payments, currency conversion, export, retailer partnership or deployment. Personal rendering is capped at 9 renders. Cocoa alternative remains deferred.

## Open Questions
Render funding and provenance are resolved: Chad authorised three existing bonus units, three one-unit renders succeeded, and their exact parameters and original output hashes are recorded. Features are frozen; remaining work is publication, the demo video and Chad’s own submission answers. Re-render, 26 October about 21:58 SAST, at Chad's request (the Everyday and Dinner looks were barely visible): soft-taupe and golden-hour intensity raised from 40 and 60 to 90, and all three sample previews re-rendered using 3 more units. 6 of the 9 additional units Chad approved are now used; previews.json funding and hashes are updated.

Approved by Chad on 26 October 2026. Chad reviewed this document and approved it (his words: "i did look at everything and approved it, i just forgot to update it"); this record was updated at 20:45 SAST to reflect that review.

### Authorised personal-photo feature — 26 October 2026
This later revision supersedes the fixed-sample-only scope and the earlier exhausted three-unit allowance. Chad directly authorised up to nine additional existing YouCam bonus units, including live testing. Three one-unit renders succeeded in the live upload test; six additional units remain authorised.

The optional local upload takes a validated JPEG/PNG (5 MB maximum, 12 MP maximum, 100 × 100 minimum), strips metadata and normalises it to at most 1024 pixels per side using Sharp. The API key stays in ignored .env and uploads require YOUCAM_UPLOADS_ENABLED=1. All three existing recipes use smoothing zero. Approvals bind the displayed photo, full recipe and result bytes; changing the photo clears them.

The local server keeps photos in request memory only, without logs or disk storage. YouCam generally retains inputs/results for 30 days. The UI no longer shows this notice (Chad's demo decision); it is stated here and in the README. Results stay in the browser tab until replaced/reloaded. Caps are nine renders per server run and six per session, reserved in batches of three before provider work. Uncertain failures are not refunded and tasks are not automatically retried. Restarting does not grant further spending permission. The keyless sample remains available.

Verification: see evidence/upload-verification-2026-10-26.md. This is a local-only endpoint, not a public deployment.
