# ASSUMPTIONS

## Stack
- React 19 + TypeScript + Vite (fresh setup)
- react-router-dom for client-side routing
- Lucide React for icons
- No user accounts or user database. Optional AI Try-On uses an Express API proxy; Cloudflare Workers AI token stays server-side.
- localStorage for Lookbook persistence

## Content
- Cultural content is written as best-effort draft. ALL cultural notes marked as `status: "draft"`, `reviewedBy: null`, `sources: []`
- Garment descriptions based on commonly known characteristics — NOT authoritative sources
- Visual representations use SVG/CSS compositions, not photos
- Character figures are gender-neutral, faceless silhouettes
- viewsNote is required (and present) for any garment with `certainty !== "consensus"`

## Design
- Vietnamese language UI throughout
- Google Fonts: Be Vietnam Pro (all weights 300–800) — full Vietnamese diacritics support
- Color system (Phase 3 Giấy can palette):
  - Background: #E9EEF2 (Giấy can)
  - Ink: #1D2F4A (Mực chàm)
  - Signature: #F2C230 (Vàng thước)
  - Warning: #D6402F (Son phấn)
  - Success: #3F7A52 (Xanh rêu)
  - Accent: #F4A8A0 (Hồng đào)
- Mobile-first responsive design tested at 390px, 768px, 1024px, 1440px

## Scope
- 4 garment groups only: Áo dài, Áo ngũ thân, Áo tứ thân, Áo bà ba
- 6 events, 3 regions, 4 styles as defined in spec
- Deterministic core outfit engine — no randomness or AI API calls. Optional photo try-on sends a consented image and prompt to Cloudflare Workers AI.
- No ethnic minority traditional clothing
- No historical court costumes (giao lĩnh, áo tấc, nhật bình)

## Data
- All outfit combinations are pre-computed/deterministic
- Color harmony is a simple complementary/analogous calculation
- Cultural validation rules are hardcoded heuristics, not academic sources

## Content Status (Phase 4)
- All garments: status=draft, reviewedBy=null, sources=[]
- No source has been verified by a human expert
- No reviewer has been assigned
- researchLeads are suggestions only — NOT citations
- Content validator (npm run validate:content) runs Phase 4 schema checks
