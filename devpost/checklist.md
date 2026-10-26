---
doc: checklist
status: approved
---
# Build Checklist
Build mode: fast, from the supplied brief. Routine review and approval decisions delegated by Chad on 26 October 2026. Hands-on participation is not fabricated.

## Slices
- [ ] **1. Inspect the sample recipes and calculate a fair complete basket**
  Becomes usable: One-click sample opens three recipe cards; selecting recipes produces a real catalogue calculation and transparent baseline.
  Why now: Proves the unique kernel and filler-choice risk before image or styling work. Missing previews stay explicit.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Features and Behaviour`
  Spec ref: `spec.md > Catalogue and offers`, `spec.md > Optimiser`, `spec.md > Presentation`
  Build: Write optimiser tests first, implement catalogue and algorithms, then minimal local sample and comparison UI with bootstrap included.
  Verify (mechanical): npm test; run local app; verify trio 550/743, no selection zero, every nonempty subset covered, all cheapest filler ties and tiny independent exhaustive oracle.
  Learner check: Open the sample and inspect how removing one recipe changes both purchases. This remains a reference check, not a claim of user testing.
  Commit: `build sample recipes and fair basket comparison`

- [ ] **2. Verify appearance approval and polish the complete demonstration**
  Becomes usable: Genuine rendered sample looks can be approved with identity-bound tokens; responsive basket includes exact sources and all limitations.
  Why now: Builds on proven maths, checks real image provenance and avoids fake appearance approval.
  PRD ref: `prd.md > States and Boundaries`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Approval identity`, `spec.md > Catalogue Evidence Gate`, `spec.md > Look and Feel`
  Build: Implement image hashing and invalidation, connect permitted genuine assets when available, complete exact source evidence, keyboard and mobile layout.
  Verify (mechanical): npm test including photo/recipe/output invalidation; inspect desktop and 390px journey; verify file allowlist rejects private paths; inspect provenance against actual asset bytes.
  Learner check: Approve/reject each available look, inspect exact basket contents and return to zero approvals.
  Commit: `complete verified approval journey and responsive presentation`

- [ ] **3. Prepare reproducible local shipping material**
  Becomes usable: Another person can run the app and follow a short recording shot list with honest reuse and limitations.
  Why now: Documentation describes verified final behaviour.
  PRD ref: `prd.md > What We're Building`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > File Structure`
  Build: README, MIT licence/About, evidence report, app map, recording shot list and factual submission checklist. No publishing or submission.
  Verify (mechanical): Run documented startup/test commands, inspect tracked files and history for private material, check app-map paths and offline rendering.
  Learner check: Use the shot list to record the demonstrated flow. Recording/submission remains user-owned.
  Commit: `prepare local demo and shipping handoff`

## Hands-on Checkpoints
User requested no routine approval prompts. Agent verification replaces blocking review checkpoints under delegated authority; no hands-on user activity is claimed.
- [ ] Early usable behaviour inspected by agent
- [ ] Final desktop/mobile exploration completed by agent

## Final Review
- [ ] Complete task diff self-reviewed and relevant checks pass
- [ ] All required release gates verified; unresolved items explicitly reported

## Code Tour and App Map
- [ ] Brief evidence-based recap prepared and shared
- [ ] Optional exercise/reflection omitted per user's no-question preference; no learning claim made
- [ ] devpost/app-map.html generated, checked and shown

## Revisions
