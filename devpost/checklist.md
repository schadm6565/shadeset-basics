---
doc: checklist
status: approved
---
# Build Checklist
Build mode: fast, chosen by Chad on 26 October 2026. Chad reviewed and approved the plan before implementation and reviewed the build as it progressed.

## Slices
- [x] **1. Inspect the sample recipes and calculate a fair complete basket**
  Becomes usable: One-click sample opens three recipe cards; selecting recipes produces a real catalogue calculation and transparent baseline.
  Why now: Proves the unique kernel and filler-choice risk before image or styling work. Missing previews stay explicit.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Features and Behaviour`
  Spec ref: `spec.md > Catalogue and offers`, `spec.md > Optimiser`, `spec.md > Presentation`
  Build: Write optimiser tests first, implement catalogue and algorithms, then minimal local sample and comparison UI with bootstrap included.
  Verify (mechanical): npm test; run local app; verify trio 550/743, no selection zero, every nonempty subset covered, all cheapest filler ties and tiny independent exhaustive oracle.
  Learner check: Open the sample and inspect how removing one recipe changes both purchases. This remains a reference check, not a claim of user testing.
  Commit: `build sample recipes and fair basket comparison`

- [x] **2. Verify appearance approval and polish the complete demonstration**
  Becomes usable: Genuine rendered sample looks can be approved with identity-bound tokens; responsive basket includes exact sources and all limitations.
  Why now: Builds on proven maths, checks real image provenance and avoids fake appearance approval.
  PRD ref: `prd.md > States and Boundaries`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Approval identity`, `spec.md > Catalogue Evidence Gate`, `spec.md > Look and Feel`
  Build: Implement image hashing and invalidation, connect permitted genuine assets when available, complete exact source evidence, keyboard and mobile layout.
  Verify (mechanical): npm test including photo/recipe/output invalidation; inspect desktop and 390px journey; verify file allowlist rejects private paths; inspect provenance against actual asset bytes.
  Learner check: Approve/reject each available look, inspect exact basket contents and return to zero approvals.
  Commit: `complete verified approval journey and responsive presentation`

- [x] **3. Prepare reproducible local shipping material**
  Becomes usable: Another person can run the app and follow a short recording shot list with honest reuse and limitations.
  Why now: Documentation describes verified final behaviour.
  PRD ref: `prd.md > What We're Building`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > File Structure`
  Build: README, MIT licence/About, evidence report, app map, recording shot list and factual submission checklist. No publishing or submission.
  Verify (mechanical): Run documented startup/test commands, inspect tracked files and history for private material, check app-map paths and offline rendering.
  Learner check: Use the shot list to record the demonstrated flow. Recording/submission remains user-owned.
  Commit: `prepare local demo and shipping handoff`

## Hands-on Checkpoints
Chad asked not to be prompted for every routine check, so the agent ran automated verification after each slice. Chad reviewed the running app himself and requested a full UI redesign after his first walkthrough; that revision is recorded below.
- [x] Early usable behaviour inspected by agent — My Hero desktop and 390px recipe flow
- [x] Final desktop/mobile exploration completed by agent

## Final Review
- [x] Complete task diff self-reviewed and relevant checks pass
- [x] All required local release gates verified; external publication/recording/submission excluded

## Code Tour and App Map
- [x] Brief evidence-based recap prepared and shared — fair filler choices, their regression tests and observed basket totals
- [x] Optional exercise/reflection omitted per user's no-question preference; no learning claim made
- [x] devpost/app-map.html generated and checked; linked in handoff (Codex panel opening queued)

## Revisions

### Feature freeze and shipping handoff — 26 October 2026
Features frozen after commit a40edf0. Existing final-review evidence remains valid; this pass only reconciles planning approval and actual rendering spend. Chad's reported personal planning approval is preserved verbatim in scope, PRD and spec.

Learning wrap-up shared: the vague requirement “compare fairly” became a testable rule—retain all tied cheapest per-look configurations before minimising their deduplicated union. The source route is src/app.js → src/optimiser.js → test/optimiser.test.js, with R550/R743 observed in the browser. This is an explanation of verified behaviour, not an invented personal learning reflection. The existing app map and recording shot list remain the handoff.

### Chad-requested UI revision — 26 October 2026
- [x] Chad requested a redesign after viewing the app; Claude handed back index.html, src/style.css and the recipe-row swatch addition in src/app.js. Neutral editorial grid, three-look hero strip, eye-focused CSS crops, locally bundled Inter Tight/JetBrains Mono, dark comparison panel and reduced-motion overrides are retained. No approval or optimiser logic changed.
- [x] Integration fixes: local font files and five explicit allowlisted routes avoid weakening CSP; unavailable-preview copy remains truthful; reset touch target is 44px; cheapest-basket wording is bounded to this catalogue. Font licences included.
- [x] `npm test`: 15/15. Desktop and 390px approval/rejection/reset and expanded baseline verified, nine images load, no horizontal overflow, 48px approval controls, 44px reset, R550/R743/R193 and two-look R419. Console warnings/errors empty. Temporary viewport reset. Reduced-motion animation/transition suppression checked in CSS.
- [x] Complete revision diff self-reviewed; no new API calls or feature expansion. Ready for the authorised public push and video recording.

### Final Chad-requested motion/design revision — 26 October 2026
- [x] Claude returned file ownership after the final request: dark image-led hero panels, 0.9-second preloader with CSS failsafe, line-mask heading reveal, colour-dot marquee, scroll reveals, parallax and button fills. The motion block was already present in 861e907; this pass reconciles it with the final panel markup.
- [x] Restored required shade-placement notes, catalogue-price caveats and the fair-baseline explanation hidden by the shorter layout. Rebound parallax to the new hero panels; suppressed hover zoom/panel resizing for reduced-motion users. Local font files and server security policy unchanged. Approval and optimiser logic unchanged.
- [x] `npm test`: 15/15 passed. Desktop and 390×844: loader detached, 9 images loaded, three approvals give R550/R743/R193, expanded baseline readable, rejection gives R419, reset zero, no console warnings/errors. Mobile width390 without overflow; approval controls48px/reset44px; placement text visible. Scroll updates observed on all three hero images. Reduced-motion overrides inspected in source; OS preference emulation was not run.
- [x] Complete revision diff self-reviewed and final UI hashes remained stable through browser verification. Secrets scan passed before the authorised push. No additional API calls or feature expansion.

### Final compact visual choice — 26 October 2026
- [x] Chad explicitly requested the less text-heavy image-led treatment: dark full-height hero, expanding genuine eye-look panels, short headings and compact pricing notes. Placement labels, repeated per-item source caveats and the comparison paragraph are now visually hidden. This supersedes the earlier decision to restore those labels. Exact product links, prices, cases and quantities remain visible; recipe data and calculation/approval logic are unchanged.
- [x] Scope, PRD and spec look-and-feel descriptions updated. `npm test`:15/15; desktop1470px and mobile390px checks passed. Nine images load, no overflow, five product links in expanded three-look comparison, R550/R743/R193, reject→R419, reset→0, no console warnings/errors. Final source hashes checked unchanged before commit.
- [x] At Chad's request the loader's "000" counter was removed; the intro now shows only the wordmark for about 0.6 seconds. Footer note now states the 26 Oct 2026 price date and "Not a checkout".
- [x] Final design tweaks approved by Chad, then design frozen: hero bottom row states "R550 for all three looks, delivered. R193 less than the cheapest separate kits, duplicates removed" beside Try the sample; smaller marquee band; eye-panel labels on a dark translucent chip. Tests 23/23.
- [x] At Chad's request the footer was removed so the landing page is a single screen. The pricing note ("Creative Glamour prices, 26 Oct 2026 · ZAR · SA delivery · Not a checkout · Fair test removes duplicates · YouCam previews, colour approximate") moved to the hero's top-right line. The MIT licence remains in the repository's LICENSE file.
- [x] Hero result wording made exact at Chad's request: "R550 for all three looks, delivered. R193 less than the cheapest separate kits, duplicates removed."
- [x] Hero text reduced at Chad's request: top-right note "Creative Glamour prices · 26 Oct 2026 · ZAR"; result line "R550 · All three looks, delivered. R193 below the fair separate-kit price." Because per-item retailer lines are hidden, one basket-section line now states "SA delivery only · Not a checkout: buy via the product links · Preview colour is approximate"; the comparison's "Cheapest separate kits" row and the hero's "fair separate-kit price" carry the fair-test meaning; stock status is in the live check.
- [x] At Chad's request the price date moved from the hero to the basket note ("Prices recorded 26 Oct 2026 · SA delivery only · Not a checkout: buy via the product links · Preview colour is approximate"); hero note is now "Creative Glamour prices · ZAR". The comparison panel's fair-test explanation paragraph is visible again in small text.
- [x] At Chad's request the R550 result line was removed from the hero. The hero now holds the headline, three eye panels, the intro, Try the sample and the marquee; R550 and R193 appear only in the basket and comparison after trying the sample.
- [x] Final hero/basket state (reconciled 26 Oct): hero has "Eye-look planner", note "Creative Glamour prices · ZAR", headline, three eye panels, intro "Approve the looks you love. Get one kit that makes them all.", Try the sample and a seamless marquee; no result line, no footer. Basket note "Prices recorded 26 Oct 2026 · SA delivery only · Not a checkout: buy via the product links · Preview colour is approximate" plus live price badge. Comparison fair-test paragraph visible. Tests 23/23.

### Authorised personal-photo feature — 26 October 2026
This later revision supersedes the fixed-sample-only scope and the earlier exhausted three-unit allowance. Chad directly authorised up to nine additional existing YouCam bonus units, including live testing. Three one-unit renders succeeded in the live upload test; six additional units remain authorised.

The optional local upload takes a consented, validated JPEG/PNG (5 MB maximum, 12 MP maximum, 100 × 100 minimum), strips metadata and normalises it to at most 1024 pixels per side using Sharp. The API key stays in ignored .env and uploads require YOUCAM_UPLOADS_ENABLED=1. All three existing recipes use smoothing zero. Approvals bind the displayed photo, full recipe and result bytes; changing the photo clears them.

The local server keeps photos in request memory only, without logs or disk storage. YouCam generally retains inputs/results for 30 days, disclosed before consent. Results stay in the browser tab until replaced/reloaded. Caps are nine renders per server run and six per session, reserved in batches of three before provider work. Uncertain failures are not refunded and tasks are not automatically retried. Restarting does not grant further spending permission. The keyless sample remains available.

Verification: see evidence/upload-verification-2026-10-26.md. This is a local-only endpoint, not a public deployment.
- [x] Chad's requests, about 21:58 SAST: soft-taupe and golden-hour intensity raised to 90 and all three sample previews re-rendered (3 more units; 6 of 9 approved now used); sample page became a two-card choice screen ("Your photo" / "The sample face") with looks shown only after a choice; consent tick replaced by the notice "Sent to YouCam for the previews · kept up to 30 days", with choosing a photo as the consent action; back control is now "← Start over" in the header. Tests 29/29 (c5cfa63).
- [x] Flow change at Chad's request (18ee803): Pick your looks (Try it on you / Try it on our model) → looks screen with Add to kit / In your kit, ← Change face, See your kit → → kit page with ← Back to looks and Shop ↗ links. Removed Clear approvals, the live price badge line and the dated basket note (/api/prices route kept). Zero-saving case reads "One basket. Already the cheapest." Each step fits 1440×695. Tests 36/36.
- [x] At Chad's request (bb0a5a2): consent checkbox, Generate button and quota text removed from the UI again; choosing a photo auto-generates; the viewfinder icon is a face-tracking dot mesh. Docs and README now say there is no consent step in the UI and note YouCam's up-to-30-day retention.
- [x] At Chad's request (6d83236): Add to kit opens the kit page directly; the kit page has "Add another look" buttons that update the saving in place ("Already the cheapest" → "One basket. R 193 less." with all three); removed the "Add every look you like…" line and the separate-kit expander; generating shows a cycling status line with a pulsing dot. Tests 36/36.
- [x] (bd500b0) Upload status line under the face cards reads "N photo preview(s) left" when available, otherwise "Photo previews paused · try our model". Hosted upload remains switched off; the hosted 3-unit cap and consent tick are on hold pending Chad's unit approval. At about 22:25 Chad asked for more credits for local testing, and the local server was restarted, resetting the local in-memory allowance (9 per run, 6 per session) for further local tests at his request.
