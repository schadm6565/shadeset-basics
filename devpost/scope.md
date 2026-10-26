---
doc: scope
status: approved
---

# ShadeSet

Choose a few eye-makeup looks and find one complete purchase that covers their recipes, within a small catalogue.

## The Unique Kernel
The app works out what the looks need together. It compares that basket with buying each look’s cheapest kit separately, giving the separate-kit approach the fairest possible combination of choices. Shared shades should not mean unnecessary duplicate purchases.

## Who It's For
A South African makeup shopper who wants an everyday look and a couple of going-out looks, but finds it awkward to work out which shades and palettes overlap. Chad chose this audience; it has not yet been validated with real shoppers.

## The Core Loop
Open the app, try the sample, inspect three looks and approve the ones you like. See one basket covering the approved recipes, what each product supplies and which looks use it. Compare its complete estimated cost with the fair separate-kit baseline. Remove an approval and the comparison updates for the remaining looks.

## Inspiration & Identity
Image-led layout. The header shows only the wordmark, and there is no footer. Each step fits one screen at 1440×695. HERO (dark): top-left label "Eye-look planner"; top-right note "Creative Glamour prices · ZAR"; the headline; three expanding panels showing genuine YouCam eye-look crops on dark translucent chips; the intro "Approve the looks you love. Get one kit that makes them all."; Try the sample; and a slim seamless marquee. FLOW (commit 6d83236, at Chad's request): Try the sample opens "Pick your looks." with two cards, "Try it on you" (face-tracking dot-mesh icon) and "Try it on our model". Choosing your own photo generates the previews automatically, with a status line that cycles "Getting your looks ready / Finding your eyes / Blending the shades / Almost there" beside a pulsing dot. On the looks screen each look has "Add to kit" (adding a look is the approval, bound to the photo, recipe and render) and a "← Change face" back link. Adding a look opens the kit page straight away. The kit page has "← Back to looks", a "Shop ↗" link for each product, and an "Add another look" row with buttons such as "+ Golden hour"; adding looks updates the basket and saving in place. The dark comparison panel explains the fair test; its headline reads "One basket. Already the cheapest." when combining saves nothing and "One basket. R 193 less." with all three sample looks. Removed from the UI at Chad's request: the Clear approvals button, the live price/stock badge line, the dated basket note, the consent checkbox and Generate button, the "Add every look you like…" line and the "Inspect the separate-kit basket" expander. The /api/prices route still exists but is not shown. Inter Tight and JetBrains Mono are bundled locally; square corners, fine rules and reduced-motion-aware presentation effects.
Prior design references: https://www.framer.com/marketplace/templates/ and https://garden-eight.com/archives/. These are visual references; no old app code or template source is reused.

## Why This Matters to the Learner
“I want to get better at planning with AI before jumping into code, and checking that what we build actually does what I intended.”
The project gives us a concrete way to practise that: define the fair comparison first, then test the maths and the interaction against it.

## What "Working" Looks Like
A person opens the local app and reaches the sample with one click. They inspect and approve Everyday soft taupe, Dinner golden hour and Evening plum after dark. The app shows the required shades and complete products, cases, quantities, source links and one R95 local delivery estimate.
For the supplied sample, investigate the expected joint total of R550 versus a fair baseline of R743: R193 difference, about 26.0% of the baseline. These are acceptance expectations from the brief, never hardcoded results. The comparison explains its assumptions and does not imply the preview exactly reproduces physical makeup.
The demo works at desktop width and 390px and can be shown in a short screen recording. No deployment is required to prove the core flow.

## The POC Boundary
- A fresh implementation for Build With AI: Basics only, in this folder.
- Three fixed sample looks and their shade recipes; explicit approve/reject controls.
- Approval bound to the photo, recipe and output hashes. Any identity change invalidates it.
- One jointly optimised purchase over the researched Creative Glamour offers.
- A fair baseline choosing among ALL cheapest per-look configurations, then minimising their deduplicated union; deduplicate identical configurations only and add delivery once.
- Twelve R73 refills, custom four/ten options, three ready-made palettes and the specified empty cases; ZAR prices and source links from the 26 October snapshot.
- Use your own photo: upload (no consent step, see below), server-side YouCam key, the same three recipes, a 9-render cap, approvals bound to the new photo. Runs locally only (the key stays private); the hosted demo offers the sample and the live price check.
- Live price and stock check against the retailer's product pages (server route /api/prices). Verification only, it never changes the basket. Its badge was removed from the UI at Chad's request on 26 October; the route remains.
- Clear limits: South Africa delivery, stock checked on request rather than reserved, approximate preview colours and no retailer partnership.
- Tests first for the optimiser and baseline, including a small independent brute-force check and a filler-choice regression.
- A local app on port 5173, planning documents and a demo recording shot list. The user writes and submits the entry.

## Rendering Decision
Chad explicitly authorised a dedicated YouCam key and three existing bonus units for this separate Basics entry on 26 October 2026. Three one-unit Makeup VTO renders succeeded, with both skin-smoothing parameters set to zero. The provider usage log confirms a total of three units spent. Original output PNGs, exact parameters and hashes are recorded in public/previews.json. No additional render allowance remains. Swatch fallback remains explicitly labelled as recipe reference, never appearance approval. Re-render, 26 October about 21:58 SAST, at Chad's request (the Everyday and Dinner looks were barely visible): soft-taupe and golden-hour intensity raised from 40 and 60 to 90, and all three sample previews re-rendered using 3 more units. 6 of the 9 additional units Chad approved are now used; previews.json funding and hashes are updated.
All application code and render images are created fresh in this repository. Any asset reuse must be disclosed, not represented as newly generated.

## Later
After the core release gate only: a side-by-side Cocoa evening alternative requiring fresh approval, and optional static hosting. Neither is required to prove the joint-basket idea.

## Explicitly Cut
Live camera capture: photo upload covers the personal-photo case with less device and privacy work.
Unlimited live rendering: personal renders are capped at 9 per server run to control spending.
Currency conversion: the catalogue and delivery assumptions are South African.
HTML export: the visible basket and comparison prove the idea without another output format.
Checkout, accounts, payments and retailer integrations: no supporting partnership. The price/stock check only reads public product pages.

## Scope change — 26 October 2026, about 21:15 SAST
After reviewing the working build, Chad decided to add two features, each with a hard stop at 22:05 SAST; anything not working by then is reverted:
1. **Use your own photo.** Upload of one photo (no consent step, see below); a server-side YouCam key renders the same three recipes on it; a hard cap of 9 renders; approvals are bound to the new photo, so changing the photo clears them.
2. **Live price and stock check.** The app re-reads the retailer's product pages on request and shows whether each price still matches the catalogue and whether the item is listed in stock. It verifies only; it never changes the optimiser or the basket.
Checkout, accounts and payments stay cut.
Chad reviewed these changed sections and approved them ("looks good") at 21:23 SAST.

## Decisions and Review State
Chad reviewed and approved the updated look-and-feel description at 21:25 SAST.
Chad defined the idea, audience, core loop, fair baseline, cuts and time gates. The agent wrote them up in this template; Chad reviewed and approved the document. The visual direction was later revised at Chad's request (see checklist revisions).
Approved by Chad on 26 October 2026. Chad reviewed this document and approved it (his words: "i did look at everything and approved it, i just forgot to update it"); this record was updated at 20:45 SAST to reflect that review. Rendering funding and publication boundaries remain unchanged.

Additional personal-photo authorisation: Chad directly approved up to nine additional existing bonus units, including live testing, on 26 October. This does not authorise unlimited usage after server restarts.

### Authorised personal-photo feature — 26 October 2026
This later revision supersedes the fixed-sample-only scope and the earlier exhausted three-unit allowance. Chad directly authorised up to nine additional existing YouCam bonus units, including live testing. Three one-unit renders succeeded in the live upload test; six additional units remain authorised.

The optional local upload takes a validated JPEG/PNG (5 MB maximum, 12 MP maximum, 100 × 100 minimum), strips metadata and normalises it to at most 1024 pixels per side using Sharp. The API key stays in ignored .env and uploads require YOUCAM_UPLOADS_ENABLED=1. All three existing recipes use smoothing zero. Approvals bind the displayed photo, full recipe and result bytes; changing the photo clears them.

The local server keeps photos in request memory only, without logs or disk storage. YouCam generally retains inputs/results for 30 days. The UI no longer shows this notice (Chad's demo decision); it is stated here and in the README. Results stay in the browser tab until replaced/reloaded. Caps are nine renders per server run and six per session, reserved in batches of three before provider work. Uncertain failures are not refunded and tasks are not automatically retried. Restarting does not grant further spending permission. The keyless sample remains available.

Verification: see evidence/upload-verification-2026-10-26.md. This is a local-only endpoint, not a public deployment.
