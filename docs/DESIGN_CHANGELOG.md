# DESIGN CHANGELOG — VIỆT PHỤC REMIX
**Phase 6: Final Visual Redesign + Art Direction Polish**  
**Theme:** "Bàn thợ may của Gen Z" (Gen Z tailor's workbench)  
**Date:** 2026-09-25  

---

## 1. Design Principles & Hard Constraints Enforced
1. **NO Gradients:** Removed all `linear-gradient` and `radial-gradient` backgrounds across CSS, SVG defs, and inline styles in favor of solid tailor paper tones (`#E9EEF2`, `#FAF8F3`, `#FFFFFF`) and craft borders.
2. **NO Excessive Pills:** Replaced generic `radius-full` on buttons, tags, and cards with crisp craft radii (`radius-sm` 4px for buttons/tags, `radius-md` 8px for cards/boards).
3. **Tactile Craft Details:** Introduced tailor measurement tick marks, division notches, hang tags with stitch and dashed borders, and corner crop marks (`+`).
4. **Zero Functional Regression:** All Phase 5 functional safety gates (§35 RED + Nguyên bản blocks, §36 Bản nháp label, §37 Remix disclaimer footer, 5-second Lookbook undo, HashRouter routes) remain 100% intact.

---

## 2. Component Changelog Table

| Component | Before (Phase 5 Baseline) | After (Phase 6 Final Redesign) | Reason |
|-----------|---------------------------|--------------------------------|--------|
| **RemixTape (Thước Remix)** | Standard `<input type="range">` with a `linear-gradient` track; white plastic pill thumb. | Crafted `.remixtape-board` featuring millimeter measuring ticks, a solid 3-color segmented bar (moss, tape, vermillion), physical tailor notches at 33% and 66%, brass slide caliper handle (`var(--color-ink)` with `var(--color-tape)` border), and instant clickable level snap tabs. | Transforms the slider into the core visual signature of the app ("Thước Remix"), establishing the tactile sensation of a tailor's measuring tape on a workbench without gradients. |
| **Lookbook Grid (≥1440px)** | Hardcoded `.grid-3` on all desktop viewports, causing cards on ultra-wide screens (≥1440px) to stretch excessively with unbalanced whitespace. | Responsive `.lookbook-grid`: 1 column (<640px), 2 columns (640–1023px), 3 columns (1024–1439px), and 4 columns (≥1440px). | Optimizes layout density on large monitors, prevents cards from over-stretching, and provides an editorial lookbook rhythm. |
| **Lookbook Card Visual** | Card image container used inline `linear-gradient(135deg, var(--color-cream), var(--color-ivory-warm))`. | Replaced with solid paper tone `var(--color-paper-soft)` and crisp craft card framing. | Strictly adheres to the "NO gradients" hard constraint and reinforces the cutting-board sheet aesthetic. |
| **Export Card (Thẻ Outfit)** | Plain cream container with standard rounded borders and generic yellow badge for drafts. | Added `.export-card-frame` with tailor corner crop marks (`+` in all 4 corners), a faint woven paper fiber watermark grid (`opacity: 0.035`), and distinct `.badge-draft` with dashed border. | Gives exported cards the physical identity of an authentic tailor lookbook swatch card printed on Vietnamese Dó paper, while distinguishing "Bản nháp" from active Remix tiers. |
| **Studio Step Transitions** | Generic `animate-fadeInUp` (350ms slow fade). | Tactile `.studio-step-pane` (180ms ease-out cubic-bezier micro-transition with 6px subtle vertical settle), fully disabled when `prefers-reduced-motion` is active. | Provides a swift, responsive feeling of turning pattern pieces on a cutting table without slowing down navigation. |
| **Buttons & Icon Buttons** | `border-radius: var(--radius-full)` (generic SaaS pill style). | `border-radius: var(--radius-sm)` (4px) with crisp edges and tactile active feedback. | Eliminates generic rounded pill styling; establishes the physical, tailored aesthetic of the product. |
| **Tags & Badges** | `border-radius: var(--radius-full)` with generic background colors. | Rectangular hang tags with `radius-sm` (4px), explicit border weights, and a dedicated dashed-border style for draft tags (`.badge-draft`). | Prevents visual confusion between drafts and intentional modern Remix tiers (§20 Hang Tag System). |
| **Loading Skeleton** | Animated `linear-gradient(90deg, ...)` shimmer. | Gradient-free opacity pulse `.skeleton` (`animation: pulse-skeleton 1.6s ease-in-out infinite`). | Removes illegal gradient while retaining accessible loading state feedback. |
| **Explore & Culture Headers** | Contained inline `linear-gradient` banner and search pill. | Solid curated Giấy can (`#E9EEF2`) paper tones with subtle craft borders. | Complies with color palette guidelines and avoids generic gradients. |
| **Home Hero & Entry** | English banner ("Tradition × Personal expression") and generic CTA. | "Bàn thợ may Gen Z · Phối trang phục Việt theo dịp" banner with clear primary action ("Bắt đầu phối outfit") and secondary ("Khám phá 4 dáng áo"). | Immediately communicates the core value proposition and entry point within 3 seconds (§9 Home Redesign). |

---

## 3. Responsive & Viewport Verification
- **360px – 430px (Mobile):** Single column flow, touch targets $\ge 44$px, bottom sheets and sliders touch-optimized with adequate breathing room.
- **768px – 1023px (Tablet):** 2-column lookbook grid, well-proportioned selection cards.
- **1024px – 1439px (Desktop):** Two-column studio composition with character visual prominent on left, controls on right; 3-column Lookbook.
- **≥1440px (Large Screens):** 4-column Lookbook grid; maximum content width bounded to prevent excessive horizontal stretching.
- **200% Zoom:** Layout remains unbroken; all text, buttons, sliders, dialogs, and tags remain accessible without horizontal overflow clipping.

---

## 4. Accessibility & Performance Verification
- **Accessibility:**
  - Standard keyboard range slider controls (Arrows, Home, End, PageUp, PageDown) preserved.
  - ARIA attributes (`aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`) 100% preserved.
  - Skip link (`#main-content`) verified.
  - Toasts `role="alert"` and `aria-live="polite"` verified.
  - Reduced motion respects user preferences (`prefers-reduced-motion: reduce`).
- **Performance:**
  - CSS bundle: 21.34 kB (gzip 4.76 kB).
  - JS bundle: 387.91 kB (gzip 113.31 kB).
  - Zero heavy third-party UI libraries introduced.
  - SVG node count: well below 600 nodes across all figures and components.
