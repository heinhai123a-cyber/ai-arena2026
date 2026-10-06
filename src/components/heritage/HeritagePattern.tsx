import React, { useRef, useEffect, useState, useCallback, useSyncExternalStore } from 'react';

/**
 * Heritage Pattern — hoa văn nền lặp vô hạn (seamless tile) với parallax cực nhẹ.
 *
 * Render một `<svg>` chứa `<pattern>` với motif "hồi văn" (meander kiểu Việt)
 * kết hợp hoa cúc dây đơn giản hóa, tạo nền texture cho `.heritage-zone`.
 *
 * ### Parallax
 * Dịch chuyển 4–8px theo scroll — **CHỈ trên desktop** (≥ 768px), tắt hẳn trên mobile
 * và khi `prefers-reduced-motion: reduce`. Không dùng thư viện ngoài.
 *
 * Dùng ở:
 * - Hero section `HomePage` (overlay sau nội dung)
 * - `CulturePage` (nền toàn trang hoặc section)
 *
 * **Không** dùng đè lên lưới chấm giấy can (`radial-gradient`) của nền chính.
 *
 * @see docs/design-plan.md §5 — Motion Discipline
 * @see docs/design-plan.md §7.2 — Hoa văn nền lặp (Seamless Pattern)
 */

export interface HeritagePatternProps {
  /** Opacity tổng thể — mặc định 0.08, khuyến nghị giữ trong khoảng 0.06–0.18
   *  để không đè lên nội dung chữ. */
  opacity?: number;
  /** Cường độ parallax tính bằng px (tối đa dịch chuyển). Mặc định 6. */
  parallaxAmount?: number;
  /** CSS class bổ sung */
  className?: string;
  /** Inline style bổ sung */
  style?: React.CSSProperties;
}

const HERITAGE_LINE = 'var(--color-heritage-line, #C5972C)';

/** Evaluate current parallax eligibility (desktop + no reduced motion) */
function getCanParallax(): boolean {
  if (typeof window === 'undefined') return false;
  const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  return motionOk && isDesktop;
}

/**
 * Subscribe to viewport resize to re-evaluate parallax eligibility.
 * Uses useSyncExternalStore to avoid setState-in-effect lint warnings.
 */
function useCanParallax(): boolean {
  return useSyncExternalStore(
    (notify) => {
      window.addEventListener('resize', notify);
      return () => window.removeEventListener('resize', notify);
    },
    getCanParallax,
    () => false, // server snapshot
  );
}

/**
 * Hoa văn "hồi văn" + hoa cúc dây, lặp liền mạch 64×64.
 * Stroke monoline, không fill — đúng phong cách poster cổ điển.
 */
export const HeritagePattern: React.FC<HeritagePatternProps> = ({
  opacity = 0.08,
  parallaxAmount = 6,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canParallax = useCanParallax();
  const [offsetY, setOffsetY] = useState(0);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return; // throttle via rAF
    rafRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) { rafRef.current = 0; return; }

      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Normalize: 0 when element top is at bottom of viewport, 1 when at top
      const progress = 1 - (rect.top / viewH);
      // Clamp to [-1, 1] and scale by parallaxAmount
      const clamped = Math.max(-1, Math.min(1, progress));
      setOffsetY(clamped * parallaxAmount);
      rafRef.current = 0;
    });
  }, [parallaxAmount]);

  useEffect(() => {
    if (!canParallax) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Compute initial position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Reset offset synchronously on cleanup — next render will use 0
      rafRef.current = 0;
    };
  }, [canParallax, handleScroll]);

  // When parallax is disabled, offset must be 0 (derived, not set in effect)
  const effectiveOffsetY = canParallax ? offsetY : 0;

  // Unique pattern ID to avoid SVG ID collisions when multiple instances exist
  const patternId = 'heritage-pat';

  return (
    <div
      ref={containerRef}
      className={`heritage-pattern ${className}`}
      role="presentation"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity,
        ...style,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{
          display: 'block',
          transform: effectiveOffsetY !== 0 ? `translateY(${effectiveOffsetY}px)` : undefined,
          willChange: canParallax ? 'transform' : undefined,
        }}
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            {/*
              Hồi văn (meander / Greek key kiểu Việt) — 4 đoạn tạo ô vuông xoắn.
              Nét monoline, không fill.
            */}
            <g
              fill="none"
              stroke={HERITAGE_LINE}
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Hồi văn chính — meander path */}
              <path d="M4 4 L20 4 L20 20 L12 20 L12 12 L4 12 Z" />
              <path d="M36 4 L52 4 L52 20 L44 20 L44 12 L36 12 Z" />
              <path d="M4 36 L20 36 L20 52 L12 52 L12 44 L4 44 Z" />
              <path d="M36 36 L52 36 L52 52 L44 52 L44 44 L36 44 Z" />

              {/* Hoa cúc dây giữa các ô — flower accent */}
              <circle cx="28" cy="28" r="4" />
              <line x1="28" y1="24" x2="28" y2="20" />
              <line x1="28" y1="32" x2="28" y2="36" />
              <line x1="24" y1="28" x2="20" y2="28" />
              <line x1="32" y1="28" x2="36" y2="28" />

              {/* Diagonal petal hints */}
              <line x1="25.2" y1="25.2" x2="22" y2="22" />
              <line x1="30.8" y1="25.2" x2="34" y2="22" />
              <line x1="25.2" y1="30.8" x2="22" y2="34" />
              <line x1="30.8" y1="30.8" x2="34" y2="34" />

              {/* Tiny corner dots for seamless tiling continuity */}
              <circle cx="0" cy="0" r="1" fill={HERITAGE_LINE} stroke="none" />
              <circle cx="64" cy="0" r="1" fill={HERITAGE_LINE} stroke="none" />
              <circle cx="0" cy="64" r="1" fill={HERITAGE_LINE} stroke="none" />
              <circle cx="64" cy="64" r="1" fill={HERITAGE_LINE} stroke="none" />

              {/* Edge connector wisps — ensure seamless horizontally */}
              <path d="M60 28 L64 28" />
              <path d="M0 28 L4 28" />
              <path d="M28 60 L28 64" />
              <path d="M28 0 L28 4" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};

export default HeritagePattern;
