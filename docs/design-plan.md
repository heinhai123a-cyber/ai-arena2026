# Việt Phục Remix — Design Plan (Phase 3)

## Creative Direction
**"Bàn thợ may của Gen Z"** — A Gen Z tailor's workbench.

## Color Palette

| Token | Name | Hex | Role |
|-------|------|-----|------|
| `--color-paper` | Giấy can | `#E9EEF2` | Background |
| `--color-ink` | Mực chàm | `#1D2F4A` | Text / Ink |
| `--color-tape` | Vàng thước | `#F2C230` | Signature / RemixTape |
| `--color-vermillion` | Son phấn | `#D6402F` | Warning / Accent |
| `--color-moss` | Xanh rêu | `#3F7A52` | Success |
| `--color-peach` | Hồng đào | `#F4A8A0` | Secondary accent |
| `--color-white` | Trắng | `#FFFFFF` | Cards / Surfaces |
| `--color-silver` | Bạc | `#C9D2DB` | Borders / Muted |
| `--color-slate` | Xám | `#5A6878` | Tertiary text |

## Typography
- **Display**: `'Be Vietnam Pro'` — Vietnamese-optimized, editorial weight 700
- **Body**: `'Be Vietnam Pro'` — weights 400, 500, 600 for body/UI
- Replaces Playfair Display (clips Vietnamese diacritics) + Inter

## Type Scale
- 14px, 16px (body), 18px, 22px, 28px, 40px
- Body line-height: 1.6
- Heading line-height: 1.25

## Shape Language
- **Pattern piece**: Angular borders, paper-like (story cards)
- **Swatch**: Textile-like rounded (color chooser)
- **Hang tag**: Tag shape with notch (badges, status)
- **Measuring tape**: Yellow tape with dark marks (RemixTape)
- **Chip**: Pill shape (filters, tags)

## Motion Principles
- 160–220ms for micro interactions
- 300ms for state changes
- Respect `prefers-reduced-motion`
- No decorative scroll animations

## Key Decisions
1. Remove radial gradient decorative blobs from hero
2. Replace generic card grid rhythm with editorial rhythm
3. Add hang-tag visual language to badges
4. Transform RemixTape slider into measuring-tape visual
5. Use sentence case for labels (not ALL CAPS everywhere)
6. Reduce card shadow intensity
7. Add paper/fabric texture to key surfaces via subtle CSS patterns
8. Maintain all existing functionality exactly as-is
