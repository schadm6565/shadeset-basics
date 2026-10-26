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
Image-led layout with a dark, full-height hero and three expanding panels showing genuine YouCam eye-look crops. Short headings introduce the light recipe-card grid and dark basket comparison. Inter Tight and JetBrains Mono are bundled locally; square corners, fine rules and reduced-motion-aware presentation effects remain. Placement labels, repeated per-item price-source caveats and the comparison explanation paragraph are visually hidden at Chad’s request; recipe data, exact product links, prices and the compact pricing/fair-test notes remain.
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
- Clear limits: South Africa delivery, not live stock, approximate preview colours and no retailer partnership.
- Tests first for the optimiser and baseline, including a small independent brute-force check and a filler-choice regression.
- A local app on port 5173, planning documents and a demo recording shot list. The user writes and submits the entry.

## Rendering Decision
Chad explicitly authorised a dedicated YouCam key and three existing bonus units for this separate Basics entry on 26 October 2026. Three one-unit Makeup VTO renders succeeded, with both skin-smoothing parameters set to zero. The provider usage log confirms a total of three units spent. Original output PNGs, exact parameters and hashes are recorded in public/previews.json. No additional render allowance remains. Swatch fallback remains explicitly labelled as recipe reference, never appearance approval.
No old source or old render files are read from the YouCam repository. Only app/catalogue-evidence.json may be read there as permitted research data. Any later authorised asset reuse must be disclosed, not represented as newly generated.

## Later
After the core release gate only: a side-by-side Cocoa evening alternative requiring fresh approval, and optional static hosting. Neither is required to prove the joint-basket idea.

## Explicitly Cut
Camera and upload: add privacy, device and rendering work beyond the sample experiment.
Live public API calls: unnecessary for a recorded sample demonstration and create spending/access risks.
Currency conversion: the catalogue and delivery assumptions are South African.
HTML export: the visible basket and comparison prove the idea without another output format.
Accounts, payments, live stock and retailer integrations: no supporting partnership or data feed.

## Decisions and Review State
Chad defined the idea, audience, core loop, fair baseline, cuts and time gates. The agent wrote them up in this template; Chad reviewed and approved the document. The visual direction was later revised at Chad's request (see checklist revisions).
Approved by Chad on 26 October 2026. Chad reviewed this document and approved it (his words: "i did look at everything and approved it, i just forgot to update it"); this record was updated at 20:45 SAST to reflect that review. Rendering funding and publication boundaries remain unchanged.
