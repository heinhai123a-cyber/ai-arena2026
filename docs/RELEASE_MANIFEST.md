# RELEASE MANIFEST — VIỆT PHỤC REMIX
**Version:** 0.0.0  
**Generated:** 2026-09-25  

This manifest lists all genuine project files included in the source release package.

---

## 1. Core Application Source (`src/`)

### Entry & Configuration
- `src/main.tsx` — Application bootstrapper with React 19 root
- `src/App.tsx` — Top-level router (`HashRouter`), skip link, and error boundary
- `src/index.css` — Craft design system tokens, typography, Thước Remix, Lookbook grid, and animations
- `src/App.css` — Global utility styles

### Pages (`src/pages/`)
- `src/pages/HomePage.tsx` — Landing page with hero, value proposition, and quick entry presets
- `src/pages/ExplorePage.tsx` — 4-garment visual gallery with region, silhouette, and story filters
- `src/pages/GarmentDetailPage.tsx` — Detailed garment piece with historical context, components, and certainty status
- `src/pages/RemixStudioPage.tsx` — 6-step tailor studio featuring Thước Remix signature component
- `src/pages/ResultPage.tsx` — Generated outfit display, Cultural Light evaluation, Color Harmony score, and export modal
- `src/pages/LookbookPage.tsx` — Responsive Lookbook (1–4 cols) with 12-slot storage, undo, and duplicate actions
- `src/pages/CulturePage.tsx` — "Chuyện chiếc áo" cultural insights and ethical guidelines
- `src/pages/SourcesPage.tsx` — Academic sources transparency dashboard and report submission form
- `src/pages/NotFoundPage.tsx` — Safe 404 recovery page

### Components (`src/components/`)
- `src/components/Navigation.tsx` — Top navigation bar with active route indicators and mobile drawer
- `src/components/OutfitVisualization.tsx` — Programmatic SVG garments, figures, and swatches (gradient-free)
- `src/components/ErrorBoundary.tsx` — Graceful React error boundary preventing white-screen crashes
- `src/components/ScrollToTop.tsx` — Automatic scroll restoration on navigation

### Core Logic & Libraries (`src/lib/`)
- `src/lib/remixEngine.ts` — Deterministic outfit generator adhering to cultural levels and regional rules
- `src/lib/culturalValidation.ts` — Cultural validation engine (Green, Yellow, Red rules with repair recommendations)
- `src/lib/colorHarmony.ts` — Separate aesthetic heuristic color scoring engine (0–100)
- `src/lib/storage.ts` — Robust localStorage manager with legacy migration and in-memory fallback
- `src/lib/useDocumentTitle.ts` — Dynamic document title manager for accessibility

### Data Catalogs (`src/content/`)
- `src/content/garments.ts` — The 4 core traditional garments (Áo dài, Áo ngũ thân, Áo tứ thân, Áo bà ba)
- `src/content/catalog.ts` — Occasions (6), regions (3), styles (4), and traditional color palettes
- `src/content/presets.ts` — Curated 4-look preset matrix for instant demo loading

### Types (`src/types/`)
- `src/types/index.ts` — TypeScript definitions for garments, preferences, validation, sources, and storage

---

## 2. Cultural & Research Documentation (`content/`)
- `content/TODO_SOURCES.csv` — 16 items awaiting scholarly domain validation
- `content/PROPOSED_RULES.md` — Proposed rules catalog (PR-01 to PR-03) pending human expert confirmation

---

## 3. Project Documentation (`docs/`)
- `docs/01-concept.md` — Product concept, user problem, JTBD, and personas
- `docs/02-research-toolkit.md` — Survey, interview, and usability test templates with target metrics
- `docs/03-content-assurance.md` — 4-layer content assurance system, grading, and review rules
- `docs/04-pitch-script.md` — 5-minute pitch, 90–120s pitch, and 10-slide outline
- `docs/ASSUMPTIONS.md` — Technical and cultural assumptions record
- `docs/TODO_FOR_HUMANS.md` — Explicit checklist of tasks requiring human researchers
- `docs/LICENSES.md` — Open source dependencies, font licenses, and asset provenance
- `docs/PROGRESS.md` — Chronological log of Phase 1 through Phase 7 implementations
- `docs/FINAL_QA.md` — Comprehensive Phase 5 acceptance testing baseline
- `docs/DESIGN_CHANGELOG.md` — Detailed component-by-component Phase 6 visual redesign log
- `docs/RELEASE_STATUS.md` — Formal release readiness scorecard
- `docs/RELEASE_MANIFEST.md` — This release file manifest
- `docs/FINAL_ACCEPTANCE.md` — Full acceptance criteria matrix
- `docs/P2_STATUS.md` — Detailed status of P2 backlog features
- `docs/SCREENSHOT_PLAN.md` — 10 key interface screenshot specifications
- `docs/DEMO_SCRIPT.md` — Step-by-step walkthrough scripts for primary and safety demos
- `docs/SUBMISSION_CHECKLIST.md` — Pre-submission verification checklist
- `docs/PACKAGING.md` — Source archive distribution guidelines
- `docs/QUICK_START.md` — Concise 2-minute setup guide

---

## 4. Test Suite (`tests/`)
- `tests/app.test.ts` — 19 unit and integration tests across 6 test suites
- `tests/validateContent.ts` — Content schema and cultural safety validator script

---

## 5. Build, Configuration & Assets
- `package.json` — Project metadata, dependencies, and verification scripts
- `package-lock.json` — Pinned dependency tree
- `vite.config.ts` — Vite 8 build configuration (`base: './'`)
- `tsconfig.json` — TypeScript root config
- `tsconfig.app.json` — Application TypeScript config (strict mode, ES2022)
- `tsconfig.node.json` — Tooling TypeScript config
- `.oxlintrc.json` — Oxlint rules configuration
- `.gitignore` — Ignore rules for node_modules, dist, logs, and environments
- `index.html` — HTML5 entry point (`lang="vi"`, Google Fonts preconnect)
- `public/` — Static assets directory
- `README.md` — Public project guide and overview
