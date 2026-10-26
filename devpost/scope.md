---
doc: scope
status: approved
---

# LookKit

Choose a few eye-makeup looks and find one complete purchase that covers their recipes, within a small catalogue.

## The Unique Kernel
The app works out what the looks need together. It compares that basket with buying each look’s cheapest kit separately, giving the separate-kit approach the fairest possible combination of choices. Shared shades should not mean unnecessary duplicate purchases.

## Who It's For
Proposed audience: a South African makeup shopper who wants an everyday look and a couple of going-out looks, but finds it awkward to work out which shades and palettes overlap. This is a product hypothesis, not a customer-research finding or a claim about Chad’s personal shopping experience.

## The Core Loop
Open the app, try the sample, inspect three looks and approve the ones you like. See one basket covering the approved recipes, what each product supplies and which looks use it. Compare its complete estimated cost with the fair separate-kit baseline. Remove an approval and the comparison updates for the remaining looks.

## Inspiration & Identity
A calm, polished beauty-shopping tool with warm ivory, dark brown text and restrained olive accents. Clear product prices and genuine preview images take priority over decoration. Serif headings, readable supporting text and a compact mobile layout.
Prior design references: https://www.framer.com/marketplace/templates/ and https://garden-eight.com/archives/. These are visual references; no old app code or template source is reused.

## Why This Matters to the Learner
“I want to get better at planning with AI before jumping into code, and checking that what we build actually does what I intended.”
The project gives us a concrete way to practise that: define the fair comparison first, then test the maths and the interaction against it.

## What "Working" Looks Like
A person opens the local app and reaches the sample with one click. They inspect and approve Everyday soft taupe, Dinner golden hour and Evening plum after dark. The app shows the required shades, placements, complete products, cases, quantities, source links and one R95 local delivery estimate.
For the supplied sample, investigate the expected joint total of R550 versus a fair baseline of R743: R193 difference, about 26.0% of the baseline. These are acceptance expectations from the brief, never hardcoded results. The comparison explains its assumptions and does not imply the preview exactly reproduces physical makeup.
The demo works at desktop width and 390px and can be shown in a short screen recording. No deployment is required to prove the core flow.

## The POC Boundary
- A fresh implementation for Build With AI: Basics only, in this folder.
- Three fixed sample looks and their shade recipes; explicit approve/reject controls.
- Approval bound to the photo, recipe and output hashes. Any identity change invalidates it.
- One jointly optimised purchase over the researched Creative Glamour offers.
- A fair baseline choosing among ALL cheapest per-look configurations, then minimising their deduplicated union; deduplicate identical configurations only and add delivery once.
- Twelve R73 refills, custom four/ten options, three ready-made palettes and the specified empty cases; ZAR prices and source links from the 17 October snapshot.
- Clear limits: South Africa delivery, not live stock, approximate preview colours and no retailer partnership.
- Tests first for the optimiser and baseline, including a small independent brute-force check and a filler-choice regression.
- A local app on port 5173, planning documents and a demo recording shot list. The user writes and submits the entry.

## Rendering Decision
The brief proposes fresh synthetic-sample YouCam renders, at most four units, with skin smoothing zero and provenance recorded. This proposal is not treated as confirmed API spending. No render runs until that allowance and the funding source are explicitly settled. Swatches may be used while planning/building and must be labelled as recipe references, never YouCam previews. Genuine renders remain a release criterion unless the user explicitly chooses the disclosed swatch fallback.
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
The supplied user brief defines the core loop, fair baseline, cuts and time gates. The intended-audience wording and exact visual treatment above are agent-drafted proposals, following the user’s request to draft answers without further questionnaires.
Approved through delegated decision-making on 26 October 2026. Chad instructed: “stop asking me to approve i told you approve all these stuff for me”. The agent owns routine choices under that instruction; this does not claim personal review of this document. Rendering funding and publication boundaries remain unchanged.
