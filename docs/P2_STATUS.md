# P2 STATUS — VIỆT PHỤC REMIX
**Phase 7: Backlog & Secondary Feature Audit**  
**Date:** 2026-09-25  

This document honestly audits the status of all secondary (P2) backlog ideas and candidate features.

---

## P2 Feature Audit Table

| Feature / Idea | Implementation Status | Current Behavior / Workaround | Technical Pre-requisites for Full Implementation |
|----------------|-----------------------|--------------------------------|--------------------------------------------------|
| **Multi-outfit Compare View** | **Not implemented** | Users can inspect outfits sequentially in Lookbook by tapping each card. | Requires dual-column canvas comparator component and diff view logic. |
| **Direct Canvas PNG Export** | **Partially implemented** | Export modal formats cards cleanly in 4:5 and 9:16 aspect ratios; relies on `window.print()` / PDF export. | Requires client-side HTML5 Canvas rasterizer (e.g. `html-to-image` or canvas polyfill) without external API dependencies. |
| **Weather / Event Suggestions** | **Implemented (manual)** | User chooses event and expected weather in Studio; event catalog suggests garments and deterministic comfort notes adapt to the selected weather. No live forecast or location request. | Live forecast remains optional and needs a weather provider plus location consent; not required for this flow. |
| **Cultural Presentation Guidance** | **Implemented** | Result page labels draft content, distinguishes no-warning from verified history, and gives context guidance. Cultural Light checks selected accessory variants and warns for known conflicts or catalog mismatches. | The rules are an application heuristic, not a scholarly verdict; source review by human experts remains required. |
| **Shareable URL with State (Share Link)** | **Partially implemented** | Full outfit configuration is encoded in query parameters (`/result?garment=...&event=...&remix=...`). | Native Web Share API (`navigator.share`) can be added on mobile browsers with clipboard fallback. |
| **Representative Characters** | **Implemented (6 profiles)** | Hạ, Đông, Xuân, Thu, Việt, Hằng use distinct age/body/hair profiles; choice is preserved in results and Lookbook. Outfit illustration is stylized vector art, not a photorealistic fitting. | Further polish should be reviewed for visual/cultural accuracy; AI photo try-on remains a separate optional feature. |
| **Academic Source Verification** | **Partially implemented** | Complete 4-layer validation schema, grading criteria (A/B/C), and `TODO_SOURCES.csv` in place. Content is marked as `draft`. | Requires human historians and museum curators to formally examine and endorse citations. |
| **User Survey & Testing Data** | **Partially implemented** | Complete survey questionnaire, 1:1 interview guide, and usability testing protocol created in `docs/02-research-toolkit.md`. | Requires field execution with 20–30 survey respondents and 5 interviewees. |
| **Fabric Swatch Textures (High-res)** | **Partially implemented** | Pure SVG paper texture and Dó fiber watermark pattern in export card; solid color swatches in Studio. | High-resolution photographic fabric swatches were excluded to maintain the strict <300KB gzip bundle limit. |
| **AI Photo Try-On** | **MVP implemented** | User uploads one image, adds a prompt, consents, then receives a FLUX.2 [klein] image-edit result through Cloudflare Workers AI. | Requires Cloudflare credentials, Node host, real API testing, public abuse controls, and monitoring the 10,000-neuron free daily allocation. |

---

## Core Invariant
Unimplemented P2 items do not block the core outfit flow. The AI Try-On is an optional network feature; its output is illustrative and must not be presented as historically authoritative.
