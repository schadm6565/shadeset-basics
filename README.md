# ShadeSet — fresh Basics proof of concept

Choose eye-look recipes and compare one jointly optimised basket with the fairest combination of independently cheapest kits.

## Run locally
Requires Node 20 or later. No installation or API key is needed.

```sh
npm test
npm run dev
```

Open http://127.0.0.1:5173 and choose **Try the sample**. Inspect the before/after previews and explicitly approve looks to calculate both baskets; clear approvals to start again. No selections survive reload.

## Current status
The catalogue calculation is implemented and independently reviewed. The sample trio calculates R550 delivered versus R743 for separate kits, retaining all cheapest filler choices. This is calculated from the supplied catalogue, not hardcoded output.

Three genuine YouCam previews now share one synthetic sample face. Each approval binds the photo, complete rendering parameters and output image hashes. Missing or changed assets fail closed into a clearly labelled recipe-only fallback. Desktop and 390px checks cover approval, rejection, reset, image loading and the R550/R743 comparison. Exact palette, refill and case links include itemised prices.

## Limits
Prices are a 17 October 2026 VAT-inclusive ZAR research snapshot. Local Pretoria/Johannesburg delivery is estimated at R95 once per basket. Stock is not live; no retailer partnership, payment, upload, account or public API exists. Swatches are editorial approximations, not YouCam outputs. Three authorised bonus units were used for three successful Makeup VTO calls on 26 October 2026; the provider usage records confirm three one-unit charges. Both skin-smoothing settings were explicitly zero. Output PNGs are unmodified; public/previews.json records exact parameters and hashes. The API key is stored only in the ignored local .env and is not needed to run this static demo. A fresh synthetic source portrait was generated with the built-in image-generation tool; public/sample-provenance.json records its exact prompt and hash. It is not a YouCam makeup result.

## Prior work and reuse
ShadeSet was renamed from LookKit on 26 October 2026. The project folder remains `lookkit-basics`. The LookKit concept, recipes, pricing facts and colour references were researched before this fresh Basics implementation. Those facts were re-entered as data from the supplied brief and the expressly permitted catalogue-evidence.json. Application code was written afresh here; no previous application source or render assets were copied. The installed challengepost/learn-ai-basics Skill Pack shaped the scope, PRD, specification and build checklist. Routine planning decisions were initially delegated. The planning documents now preserve Chad’s reported personal review and approval at 20:45 SAST. No personal learning reflection is written on his behalf.

## Verification and remaining work
See devpost/verification.md and devpost/checklist.md. Planning was committed before implementation. Source research is recorded in devpost/source-follow-up.md. The public repository is https://github.com/schadm6565/shadeset-basics. No live deployment, video recording or Devpost submission has been made by this task.

## Licence
Application code is MIT licensed; see LICENSE. Third-party names and research remain attributed facts. The Skill Pack is separately sourced by skills-lock.json.

## UI revision
The Chad-requested redesign uses eye-focused CSS crops of the unchanged genuine images, three dark hero panels, reduced-motion-aware presentation effects and a dark basket comparison. Inter Tight and JetBrains Mono are bundled locally; their SIL Open Font Licences and source notes are in public/fonts/. Approval and basket logic are unchanged.
