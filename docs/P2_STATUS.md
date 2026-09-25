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
| **Weather / Seasonal Integration** | **Not implemented** | Handled contextually via Occasion selection (e.g. "Tết" implies festive spring season). | Requires optional client-side weather input widget; excluded to avoid unnecessary external API dependencies. |
| **Shareable URL with State (Share Link)** | **Partially implemented** | Full outfit configuration is encoded in query parameters (`/result?garment=...&event=...&remix=...`). | Native Web Share API (`navigator.share`) can be added on mobile browsers with clipboard fallback. |
| **Avatar Variants (Gender / Silhouette)** | **Partially implemented** | Figure uses gender-neutral stylized silhouette with garment tailoring; 4 major traditional silhouettes represented. | Requires expanded SVG figure variations and anatomy switchers. |
| **Academic Source Verification** | **Partially implemented** | Complete 4-layer validation schema, grading criteria (A/B/C), and `TODO_SOURCES.csv` in place. Content is marked as `draft`. | Requires human historians and museum curators to formally examine and endorse citations. |
| **User Survey & Testing Data** | **Partially implemented** | Complete survey questionnaire, 1:1 interview guide, and usability testing protocol created in `docs/02-research-toolkit.md`. | Requires field execution with 20–30 survey respondents and 5 interviewees. |
| **Fabric Swatch Textures (High-res)** | **Partially implemented** | Pure SVG paper texture and Dó fiber watermark pattern in export card; solid color swatches in Studio. | High-resolution photographic fabric swatches were excluded to maintain the strict <300KB gzip bundle limit. |

---

## Core Invariant
None of the unimplemented P2 items compromise core functionality, cultural safety gates, or offline-first stability. All primary MVP flows (Prompts 1–6) are complete and operational.
