import React from 'react';
import { useInViewOnce } from '../../lib/useInViewOnce';

/**
 * Heritage Ornament — SVG trang trí di sản monoline với hiệu ứng "vẽ nét" (line-draw-in).
 *
 * Ba biến thể (variant):
 *
 * - **corner**: Khung góc hoa văn xoắn lá sen + dải mây cách điệu thời Lê.
 *   Dùng ở 4 góc hero `HomePage`, khung thẻ xuất `LookbookPage` / `ResultPage`.
 *   Xoay bằng CSS `transform: rotate()` cho mỗi góc.
 *
 * - **emblem**: Con dấu tròn kép (triện) với hoa sen 8 cánh cách điệu.
 *   Dùng ở header `CulturePage`, góc thẻ xuất `LookbookPage`.
 *
 * - **divider**: Skyline mái đình/chùa Bắc Bộ chấm phá (nét đứt monoline).
 *   Dùng làm `<hr>` trang trí trên `CulturePage` và phần lịch sử `GarmentDetailPage`.
 *
 * Tất cả motif dùng nét monoline `--color-heritage-line` (kem `#F6F4EE`),
 * `pointer-events: none`, `aria-hidden="true"`.
 *
 * ### Animation — Line-draw-in
 * Kỹ thuật `stroke-dasharray` / `stroke-dashoffset` tạo hiệu ứng SVG được "vẽ tay"
 * khi phần tử vào viewport (một lần duy nhất, qua `useInViewOnce`).
 * - Thời lượng: 1000ms, easing: ease-out
 * - Tự động tắt khi `prefers-reduced-motion: reduce`
 * - Không dùng `animate-fadeInUp` hay `stagger-*` (đã loại — Rationale Log)
 *
 * @see docs/design-plan.md §5 — Motion Discipline
 * @see docs/design-plan.md §7 — Lớp trang trí di sản (Heritage Layer)
 */

/* ── Types ── */

export interface HeritageOrnamentProps {
  /** Biến thể hoa văn */
  variant: 'corner' | 'emblem' | 'divider';
  /** Kích thước tính theo px — ảnh hưởng width/height của SVG viewBox.
   *  Mặc định: corner=80, emblem=64, divider chiều rộng 100%. */
  size?: number;
  /** CSS class bổ sung */
  className?: string;
  /** Inline style bổ sung (dùng để position: absolute, rotate...) */
  style?: React.CSSProperties;
}

/* ── Shared constants ── */
const HERITAGE_LINE = 'var(--color-heritage-line, #C5972C)';
const HERITAGE_RED = 'var(--color-heritage-red, #8B1A1A)';

/**
 * Tổng chiều dài nét ước lượng cho mỗi variant.
 * Dùng làm `stroke-dasharray` & `stroke-dashoffset` ban đầu.
 * Giá trị lớn hơn tổng path length thực tế là OK — nét sẽ chạy hết sớm hơn.
 */
const DASH_TOTAL: Record<string, number> = {
  corner: 300,
  emblem: 500,
  divider: 1800,
};

/** CSS transition cho hiệu ứng line-draw */
const DRAW_DURATION = '1000ms';
const DRAW_EASING = 'ease-out';

/* ── Corner Ornament ─────────────────────────────────────────────
   viewBox 0 0 80 80 — hoa văn xoắn lá sen + dải mây cách điệu.
   Đặt ở góc, xoay 0°/90°/180°/270° qua CSS transform.
   ─────────────────────────────────────────────────────────────── */
function CornerSvg({ size = 80, drawn }: { size: number; drawn: boolean }) {
  const total = DASH_TOTAL.corner;
  const pathStyle: React.CSSProperties = {
    strokeDasharray: total,
    strokeDashoffset: drawn ? 0 : total,
    transition: drawn ? `stroke-dashoffset ${DRAW_DURATION} ${DRAW_EASING}` : 'none',
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      stroke={HERITAGE_LINE}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer corner frame lines */}
      <path d="M2 20 L2 2 L20 2" style={pathStyle} />
      <path d="M2 6 L6 2" style={pathStyle} />

      {/* Decorative scroll / lá sen curl — primary */}
      <path d="M8 2 C12 8, 20 14, 28 10 C32 8, 30 4, 26 6 C22 8, 24 14, 30 16" style={pathStyle} />
      <path d="M2 8 C8 12, 14 20, 10 28 C8 32, 4 30, 6 26 C8 22, 14 24, 16 30" style={pathStyle} />

      {/* Inner spirals — dây lá sen nhỏ */}
      <path d="M14 14 C18 10, 24 12, 22 18 C20 22, 14 20, 16 16" style={pathStyle} />

      {/* Cloud wisps — mây cách điệu */}
      <path d="M32 4 C36 2, 40 4, 38 8 C42 6, 46 8, 44 12" style={pathStyle} />
      <path d="M4 32 C2 36, 4 40, 8 38 C6 42, 8 46, 12 44" style={pathStyle} />

      {/* Tiny dot accents — fade in with opacity, no dashoffset */}
      <circle cx="20" cy="20" r="1" fill={HERITAGE_LINE} stroke="none"
        style={{ opacity: drawn ? 1 : 0, transition: drawn ? `opacity 400ms ${DRAW_EASING} 800ms` : 'none' }} />
      <circle cx="36" cy="12" r="0.8" fill={HERITAGE_LINE} stroke="none"
        style={{ opacity: drawn ? 1 : 0, transition: drawn ? `opacity 400ms ${DRAW_EASING} 900ms` : 'none' }} />
      <circle cx="12" cy="36" r="0.8" fill={HERITAGE_LINE} stroke="none"
        style={{ opacity: drawn ? 1 : 0, transition: drawn ? `opacity 400ms ${DRAW_EASING} 950ms` : 'none' }} />
    </svg>
  );
}

/* ── Heritage Emblem ─────────────────────────────────────────────
   viewBox 0 0 64 64 — con dấu tròn kép + hoa sen 8 cánh cách điệu.
   ─────────────────────────────────────────────────────────────── */
function EmblemSvg({ size = 64, drawn }: { size: number; drawn: boolean }) {
  const total = DASH_TOTAL.emblem;
  const ringStyle: React.CSSProperties = {
    strokeDasharray: total,
    strokeDashoffset: drawn ? 0 : total,
    transition: drawn ? `stroke-dashoffset ${DRAW_DURATION} ${DRAW_EASING}` : 'none',
  };
  const fadeStyle = (delay: number): React.CSSProperties => ({
    opacity: drawn ? 1 : 0,
    transition: drawn ? `opacity 500ms ${DRAW_EASING} ${delay}ms` : 'none',
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
    >
      {/* Background fill circle — heritage red (fade in) */}
      <circle cx="32" cy="32" r="30" fill={HERITAGE_RED}
        style={{ opacity: drawn ? 0.9 : 0, transition: drawn ? `opacity 600ms ${DRAW_EASING}` : 'none' }} />

      {/* Outer double ring — line-draw */}
      <circle cx="32" cy="32" r="30" stroke={HERITAGE_LINE} strokeWidth={1.5} style={ringStyle} />
      <circle cx="32" cy="32" r="27" stroke={HERITAGE_LINE} strokeWidth={0.75} style={ringStyle} />

      {/* Inner decorative ring */}
      <circle cx="32" cy="32" r="20" stroke={HERITAGE_LINE} strokeWidth={0.5} strokeDasharray="3 2"
        style={fadeStyle(400)} />

      {/* 8-petal lotus — hoa sen 8 cánh cách điệu */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const cx = 32 + Math.cos(angle) * 13;
        const cy = 32 + Math.sin(angle) * 13;
        const cp1x = 32 + Math.cos(angle - 0.3) * 8;
        const cp1y = 32 + Math.sin(angle - 0.3) * 8;
        const cp2x = 32 + Math.cos(angle + 0.3) * 8;
        const cp2y = 32 + Math.sin(angle + 0.3) * 8;
        return (
          <path
            key={i}
            d={`M32 32 Q${cp1x} ${cp1y} ${cx} ${cy} Q${cp2x} ${cp2y} 32 32`}
            stroke={HERITAGE_LINE}
            strokeWidth={1}
            strokeLinecap="round"
            style={{
              strokeDasharray: 60,
              strokeDashoffset: drawn ? 0 : 60,
              transition: drawn ? `stroke-dashoffset 800ms ${DRAW_EASING} ${300 + i * 60}ms` : 'none',
            }}
          />
        );
      })}

      {/* Center dot */}
      <circle cx="32" cy="32" r="2.5" fill={HERITAGE_LINE} style={fadeStyle(600)} />

      {/* Small accent dots between petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = ((i * 45 + 22.5) * Math.PI) / 180;
        const dotX = 32 + Math.cos(angle) * 17;
        const dotY = 32 + Math.sin(angle) * 17;
        return (
          <circle
            key={`dot-${i}`}
            cx={dotX}
            cy={dotY}
            r="0.8"
            fill={HERITAGE_LINE}
            style={fadeStyle(700 + i * 40)}
          />
        );
      })}
    </svg>
  );
}

/* ── Pagoda Divider ──────────────────────────────────────────────
   viewBox 0 0 600 40 — skyline mái đình chấm phá, nét đứt monoline.
   Chiều rộng 100% container, preserveAspectRatio xMidYMid.
   ─────────────────────────────────────────────────────────────── */
function DividerSvg({ drawn }: { drawn: boolean }) {
  const total = DASH_TOTAL.divider;
  const pathStyle: React.CSSProperties = {
    strokeDasharray: total,
    strokeDashoffset: drawn ? 0 : total,
    transition: drawn ? `stroke-dashoffset 1200ms ${DRAW_EASING}` : 'none',
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 40"
      width="100%"
      height="40"
      fill="none"
      stroke={HERITAGE_LINE}
      strokeWidth={1}
      strokeLinecap="round"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Base horizon line */}
      <line x1="0" y1="36" x2="600" y2="36" opacity={0.3} style={pathStyle} />

      {/* Left pagoda — tam quan / cổng */}
      <path d="M60 36 L60 22 L50 16 L70 16 L60 22" style={pathStyle} />
      <path d="M50 16 L45 12 L75 12 L70 16" style={pathStyle} />
      <line x1="60" y1="12" x2="60" y2="8" style={pathStyle} />

      {/* Central temple — mái đình chính, mái cong đao */}
      <path d="M260 36 L260 18" style={pathStyle} />
      <path d="M340 36 L340 18" style={pathStyle} />
      <path d="M250 18 L265 10 L300 6 L335 10 L350 18" style={pathStyle} />
      {/* Mái cong đao — curved eaves */}
      <path d="M248 18 Q255 14, 265 10" style={pathStyle} />
      <path d="M352 18 Q345 14, 335 10" style={pathStyle} />
      {/* Cột trụ */}
      <line x1="275" y1="36" x2="275" y2="18" style={pathStyle} />
      <line x1="325" y1="36" x2="325" y2="18" style={pathStyle} />
      {/* Tháp bút trung tâm */}
      <line x1="300" y1="6" x2="300" y2="2" style={pathStyle} />
      <circle cx="300" cy="2" r="1" fill={HERITAGE_LINE} stroke="none"
        style={{ opacity: drawn ? 1 : 0, transition: drawn ? `opacity 400ms ${DRAW_EASING} 1000ms` : 'none' }} />

      {/* Right stupa — tháp nhỏ */}
      <path d="M500 36 L500 20 L490 16 L510 16 L500 20" style={pathStyle} />
      <path d="M492 16 L500 10 L508 16" style={pathStyle} />
      <line x1="500" y1="10" x2="500" y2="6" style={pathStyle} />

      {/* Scattered cloud wisps */}
      <path d="M140 14 Q150 10, 160 14" style={pathStyle} />
      <path d="M420 12 Q430 8, 440 12" style={pathStyle} />
      <path d="M180 8 Q186 5, 192 8" style={pathStyle} />
    </svg>
  );
}

/* ── Main Component ── */

export const HeritageOrnament: React.FC<HeritageOrnamentProps> = ({
  variant,
  size,
  className = '',
  style,
}) => {
  const resolvedSize = size ?? (variant === 'corner' ? 80 : variant === 'emblem' ? 64 : 40);
  const [ref, isInView] = useInViewOnce<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      className={`heritage-ornament heritage-ornament--${variant} ${className}`}
      role="presentation"
      aria-hidden="true"
      style={{
        pointerEvents: 'none',
        lineHeight: 0,
        flexShrink: 0,
        ...(variant === 'divider'
          ? { width: '100%' }
          : { width: resolvedSize, height: resolvedSize }),
        ...style,
      }}
    >
      {variant === 'corner' && <CornerSvg size={resolvedSize} drawn={isInView} />}
      {variant === 'emblem' && <EmblemSvg size={resolvedSize} drawn={isInView} />}
      {variant === 'divider' && <DividerSvg drawn={isInView} />}
    </div>
  );
};

export default HeritageOrnament;
