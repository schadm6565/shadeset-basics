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
