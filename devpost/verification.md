# Verification record

26 October 2026 — first implementation checkpoint.

- Node v20.20.1.
- Tests written and run before implementation: failed because src/optimiser.js did not exist, as expected.
- After fresh implementation, `npm test`: five tests pass. These cover the sample 550/743 comparison, all nine cheapest filler configurations, all seven sample subsets, empty/uncoverable cases and an independent exhaustive tiny-catalogue oracle.
- `node --check src/app.js` and `node --check server.js`: pass.
- `npm run dev`: serving on 127.0.0.1:5173, session 27784 at time of verification.
- HTTP probes: /, /src/app.js and /LICENSE return 200. /.env, /.git/config, /devpost/learner-profile.md and traversal to .env return 404.
- Clean-context read-only gpt-5.6-sol/high review of the implementation against planning commit 360e484: no actionable defects. Reviewer independently checked 500 deterministic random catalogues against exhaustive subset results and tested encoded traversal, HEAD, POST and response headers.
- Browser verification NOT performed. The CUA runtime fails because its configured working directory still points to the renamed Build With AI folder. A temporary compatibility symlink was rejected as an unsupported writable root and removed. No security setting was changed.
- Genuine previews, appearance approval identity, exact purchase-link integration, desktop/mobile browser evidence and shipping materials are still incomplete. Checklist slice 1 stays unchecked until UI interaction is verified.
- Zero YouCam/API units spent. No public deployment, push, repository creation or submission.

## Product links and approval component checkpoint
- `npm test`: ten tests pass, including photo/recipe/output invalidation, stale approval rejection, missing bytes and caller mutation. Test bytes are fixtures, not image provenance.
- All 9,579 generated offers have component totals equal to their offer prices and retailer-hosted URLs. Actual basket quantities and component costs are displayed.
- Public product sources were researched without checkout interaction; see source-follow-up.md.
- CUA runtime recovery succeeded using an empty temporary directory at its stale working-directory path. The authoritative project remains lookkit-basics; no files were copied. Browser discovery shows chad and Andrea only, not the required My Hero profile. No profile substitution or UI verification occurred.
- Development server restarted in session 65198 to serve the added sources module.
- Local app map, recording shot list and shipping fact checklist prepared. They explicitly distinguish current recipe selection from the unfinished genuine-preview approval journey.

## Guarded preview integration checkpoint
- Tests-first preview checks initially failed because src/previews.js did not exist; after implementation, `npm test` passes all 15 tests.
- Incremental read-only gpt-5.6-sol/high review against ec646d6 found no actionable defects. Browser image-paint and layout checks were not performed.
- A complete matching local asset set and provenance are required; images must decode before appearance approval becomes available. Approval rechecks bytes, recipe and output hashes. Reset cancels older pending state changes.
- Current public/previews.json explicitly says unavailable and contains no real or test images. This is not completion of the genuine-render requirement.
- Restarted server in session 48169. New approval/preview modules and manifest return 200; missing sample image, private files, arbitrary PNG and traversal requests return 404; POST returns 405.
- Browser-profile question remains pending: My Hero was not in discovery, and no alternative profile has been authorised for this separate task.
- Official Makeup VTO documentation consulted read-only: https://docs.perfectcorp.com/reference/makeup_vto/section/overview . It confirms POST /s2s/v2.0/task/makeup-vto and task-status polling. No actual request or paid unit was used.

## Browser verification — My Hero
- Chad connected the required profile, discovered as myherostudio.com / browser5. Tested the app in a new dedicated tab.
- Desktop: one-click sample opens three cards; selections progress0→1→2→3. Totals observed419/419 for one and two compatible recipes, then550/743 with193 saving and26.0% for all three. Expanded baseline shows two distinct custom-four configurations. Product/refill/case links and individual prices are visible.
-390px by844px viewport: document width390px, no horizontal overflow; buttons48px or50px high. Readable stacked cards and cost rows. Removing plum returns two selections and419/419; reset shows zero selections and no basket/delivery.
- No console warnings/errors reported. Restored default viewport and left the local app tab available as a deliverable.
- Screenshots: evidence/desktop-recipe-comparison.jpg and evidence/mobile-390-recipe-comparison.jpg. These show the current recipe-selection flow, not genuine preview approval.
- Remaining browser evidence: actual image paint and appearance approval require genuine assets.

## Synthetic source preparation
- Fresh fictional adult source portrait generated with the built-in image_gen tool and inspected visually. Saved to public/sample.png; exact prompt, source type and SHA-256 recorded in public/sample-provenance.json. It is not a genuine YouCam output.
- The public preview manifest remains unavailable with no output records; the source photo alone does not enable appearance approval.
- Official unit-consumption documentation confirms 1 unit per Makeup VTO render: https://docs.perfectcorp.com/reference/makeup_vto/section/overview/unit-consumption . Three required renders would consume 3 units. No YouCam calls made.
- A project-specific funding/key question is pending. Never paste credentials into chat or transfer the original project's allowance.

## Genuine preview release — 26 October 2026, approximately 20:45 SAST
- Three authorised Makeup VTO calls succeeded; provider usage records show -1 at 18:41:44, 18:41:58 and 18:42:13 UTC. Key creation supplied another 40 free units; balance after this run 1,037. No purchase or subscription.
- Dedicated key is permanent, labelled ShadeSet Basics — local demo, stored in ignored .env mode 0600. No credential in tracked content or history. It is never used by the browser app.
- Original output PNGs are 1254×1254. Exact effects include explicit skinSmoothStrength=0 and skinSmoothColorIntensity=0. Shimmer colour/intensity and pattern are included in approval recipe hashes.
- `npm test`: 15/15 pass. Live `loadPreviews` accepts all three actual assets. Private HTTP paths return 404 and POST returns 405.
- Chad browser: desktop 0→1→2→3 explicit approvals; R550/R743/R193. Mobile at 390×844: width390, six images loaded, approval controls48px, rejection→2 and R419, reapproval→3, clear→0, no warning/error logs. Temporary viewport restored.
- Deliberately corrupted one outputHash, attempted approval: verification failed, no appearance approval issued, fallback clearly labelled and count0. Original manifest restored immediately.
- Evidence: desktop-genuine-previews.png and mobile-genuine-previews.png. No further paid calls, deployment, push or submission.
