# LookKit — fresh Basics proof of concept

Choose eye-look recipes and compare one jointly optimised basket with the fairest combination of independently cheapest kits.

## Run locally
Requires Node 20 or later. No installation or API key is needed.

```sh
npm test
npm run dev
```

Open http://127.0.0.1:5173 and choose **Try the sample**. Select recipes to calculate both baskets; clear selections to start again. No selections survive reload.

## Current status
The catalogue calculation is implemented and independently reviewed. The sample trio calculates R550 delivered versus R743 for separate kits, retaining all cheapest filler choices. This is calculated from the supplied catalogue, not hardcoded output.

The interface currently supports recipe selection only. The preview-loading and appearance-approval code is implemented and independently reviewed, but **genuine sample assets are absent and the full journey is not yet browser-verified**. The unavailable manifest keeps the visible app in recipe-selection mode. Exact palette, refill and case links are integrated, with itemised component prices. Browser/mobile visual checks remain outstanding. This is not yet a complete release.

## Limits
Prices are a 17 October 2026 VAT-inclusive ZAR research snapshot. Local Pretoria/Johannesburg delivery is estimated at R95 once per basket. Stock is not live; no retailer partnership, payment, upload, account or public API exists. Swatches are editorial approximations, not YouCam outputs. No paid units were used for this implementation.

## Prior work and reuse
The LookKit concept, recipes, pricing facts and colour references were researched before this fresh Basics implementation. Those facts were re-entered as data from the supplied brief and the expressly permitted catalogue-evidence.json. Application code was written afresh here; no previous application source or render assets were copied. The installed challengepost/learn-ai-basics Skill Pack shaped the scope, PRD, specification and build checklist. Routine planning decisions were delegated by the user; no personal document review or learning reflection is claimed.

## Verification and remaining work
See devpost/verification.md and devpost/checklist.md. Planning was committed before implementation. Source research is recorded in devpost/source-follow-up.md. No public repository, deployment, recording or submission has been made by this task.

## Licence
Application code is MIT licensed; see LICENSE. Third-party names and research remain attributed facts. The Skill Pack is separately sourced by skills-lock.json.
