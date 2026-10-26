---
doc: prd
status: approved
---
# ShadeSet — Product Requirements
Choose several eye looks and find one complete purchase covering their recipes. Source: scope.md > The Unique Kernel.

## The Core Journey
1. Arrive at a concise introduction with one prominent Try the sample button.
2. Inspect Everyday soft taupe, Dinner golden hour and Evening plum after dark. Each card contains its three named shades, placement notes and sample-face preview when genuine output is available.
3. Explicitly approve or reject individual looks. There is no default approval. A recipe reference without a genuine preview must never be described as an appearance approval.
4. See a complete joint basket for the approved recipes: configuration, shade list, included case, quantity, price, retailer source and the looks served.
5. Compare it with independently cheapest per-look kits, using the least expensive deduplicated union across every tied cheapest configuration. Delivery appears once in both totals.
6. Remove a look and see both baskets recalculate. Reset returns to no approvals.

## Screens and Layout
One page with introduction, sample look cards and a basket/comparison section. Three desktop cards collapse into a single mobile column. Basket details stay readable at 390px without horizontal scrolling. Empty basket explains the next action. Buttons have visible focus and explicit text states.

## Look and Feel
Neutral, high-contrast editorial grid: off-white background, near-black type, Inter Tight with a monospace face for labels and prices, square corners and hairline rules. The genuine eye close-up previews lead; motion is subtle and respects reduced-motion settings. Revised on 26 October 2026 at Chad's request after he reviewed the first build, which used warm ivory, olive and serif headings and read as generic. References are the Framer marketplace and Garden Eight archives named in scope; reference style only, with fresh code. Avoid dashboard clutter, misleading product photography or decorative fake preview imagery.

## Features and Behaviour
Source: scope.md > The POC Boundary.
- Required shades are the union of selected recipes. Every basket must cover them using purchasable configurations and adequate cases.
- Compare product subtotals separately from R95 local delivery. Describe the result as within this catalogue and dated snapshot, never globally cheapest or live stock.
- Baseline keeps every tied cheapest configuration per recipe, then minimises the union of identical complete configurations. Two custom palettes with different fillers remain different products.
- Sample expectations to investigate: products R455, delivered R550; baseline products R648, delivered R743; difference R193 (26.0%). Never encode these as output constants.
- Appearance approval binds photo bytes, full recipe and output bytes by hash. Replacement of any component invalidates approval.
- Genuine previews carry provenance and colour approximation notices. Missing previews show a plain unavailable state with recipe swatches; this is not evidence of a finished visual demo.

## States and Boundaries
No approvals: no purchase recommendation or delivery charge. Rejection: remove that look only. No feasible basket: explain catalogue cannot cover the selection, never show partial coverage as complete. Missing image: show unavailable state. Invalidated approval: explain why re-approval is needed. Selections exist in memory and reset on reload; no personal data is stored.

## Product Decisions
Chad's brief fixes the recipes, catalogue, fair comparison and cuts. The agent proposed a single-page layout and Chad approved it. Genuine image readiness was verified after Chad separately authorised three one-unit renders. This PRD does not authorise additional spending.

## What We're Building
The core journey, tested optimiser and baseline, verifiable approval identity, responsive local demonstration and local shipping materials. Source: scope.md > What "Working" Looks Like.

## Non-Goals
No camera/upload, live public API, accounts, payments, live stock, currency conversion, export, retailer partnership or deployment. Cocoa alternative is deferred until all core requirements pass.

## Open Questions
Render funding and provenance are resolved: Chad authorised three existing bonus units, three one-unit renders succeeded, and their exact parameters and original output hashes are recorded. Features are frozen; remaining work is publication, the demo video and Chad’s own submission answers.

Approved by Chad on 26 October 2026. Chad reviewed this document and approved it (his words: "i did look at everything and approved it, i just forgot to update it"); this record was updated at 20:45 SAST to reflect that review.
