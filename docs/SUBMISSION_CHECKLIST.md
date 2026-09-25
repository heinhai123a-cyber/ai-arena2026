# SUBMISSION CHECKLIST — VIỆT PHỤC REMIX
**Phase 7: Final Audition & Submission Readiness Checklist**  
**Date:** 2026-09-25  

Before final delivery or public link submission, verify each item in this checklist:

---

## 1. Documentation & Concept Deliverables
- [x] **README.md** — Up-to-date overview, problem statement, differentiators, run instructions, and limitations.
- [x] **docs/01-concept.md** — Product concept, hypothesis personas, JTBD, scope, and differentiators.
- [x] **docs/02-research-toolkit.md** — Honest research toolkit (survey target 20–30, 5 interviews, 5 usability tests).
- [x] **docs/03-content-assurance.md** — 4-layer content assurance system, grading criteria, and review rules.
- [x] **docs/04-pitch-script.md** — 5-minute pitch, 90–120s pitch, and 10-slide presentation outline.
- [x] **docs/LICENSES.md** — Third-party library licenses, OFL font license, and asset attribution.
- [x] **docs/TODO_FOR_HUMANS.md** — Explicit checklist of scholarly and field tasks reserved for human researchers.
- [x] **docs/FINAL_QA.md** — Functional QA and integration test verification report.
- [x] **docs/DESIGN_CHANGELOG.md** — Visual redesign changes and craft aesthetic decisions log.
- [x] **docs/SCREENSHOT_PLAN.md** — Complete specification for 10 key portfolio screenshots.
- [x] **docs/DEMO_SCRIPT.md** — Spoken Vietnamese presentation scripts for Golden Path & Safety Demo.
- [x] **docs/FINAL_ACCEPTANCE.md** — 28/28 criteria acceptance matrix (Y1–Y4, D1–D4, B1–B6, NT1–NT14).
- [x] **docs/P2_STATUS.md** — Backlog and future features status audit.
- [x] **docs/QUICK_START.md** — 2-minute local setup and evaluation guide.
- [x] **docs/PACKAGING.md** — Distribution bundle guide.

---

## 2. Technical Quality & Code Integrity
- [x] **Clean Build:** `npm run build` succeeds without warnings (`dist/` generated in <200ms).
- [x] **Clean Tests:** `npm test` passes 19/19 tests across 6 test suites.
- [x] **Zero Type Errors:** `npm run typecheck` (`tsc --noEmit`) passes with 0 errors.
- [x] **Zero Lint Errors:** `npm run lint` (`oxlint`) passes with 0 errors across all 27 source files.
- [x] **Content Schema Valid:** `npm run validate:content` passes with 0 errors and 0 schema violations.
- [x] **Zero Secrets:** Zero API keys, secrets, tokens, or credentials in codebase; `.env*` ignored in `.gitignore`.
- [x] **Zero External Network Dependencies:** All assets, styles, fonts, and logic execute 100% offline.
- [x] **Client-Side Routing:** `HashRouter` with `base: './'` verified for static host compatibility.

---

## 3. Cultural & Academic Honesty Invariants
- [x] **No Fabricated Sources:** `content/TODO_SOURCES.csv` honestly lists 16 pending items.
- [x] **No Fabricated Reviewers:** All garments maintain `reviewedBy: null` and `status: "draft"`.
- [x] **No Unsupported Claims:** Personas and research metrics are documented as hypotheses/templates.
- [x] **Safety Gates Active:** RED + Nguyên bản combinations remain strictly blocked from export and saving.
- [x] **Clear Distinction:** Color Harmony score (aesthetic heuristic) is explicitly separated from Cultural Truth.

---

## 4. Human Submitter Action Items (Before Sending)
- [ ] Fill in `[TÊN NHÓM]` (Team Name) in `docs/TODO_FOR_HUMANS.md` and submission forms.
- [ ] Fill in `[EMAIL NHÓM]` (Contact Email) for issue reports.
- [ ] Deploy to static host (GitHub Pages / Vercel / Netlify) and fill `[DEPLOY DEMO URL]`.
- [ ] Push code to repository and fill `[REPOSITORY URL]`.
- [ ] Capture the 10 screenshots per `docs/SCREENSHOT_PLAN.md` if submitting a slide deck or PDF report.
