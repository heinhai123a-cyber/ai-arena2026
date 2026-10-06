import { useRef, useState, useEffect, useMemo } from 'react';

/**
 * Custom hook: phát hiện khi phần tử vào viewport **một lần duy nhất**.
 *
 * Trả về `[ref, isInView]`:
 * - `ref` — gắn vào phần tử DOM cần theo dõi
 * - `isInView` — `true` khi phần tử đã vào viewport, sau đó giữ nguyên `true` mãi
 *   (observer tự ngắt kết nối sau lần trigger đầu tiên)
 *
 * Nếu `prefers-reduced-motion: reduce`, hook trả về `true` ngay lập tức
 * (SVG hiện đầy đủ, không animation).
 *
 * @param threshold Tỉ lệ phần tử cần hiện trong viewport để trigger (0–1). Mặc định 0.15.
 * @param rootMargin Margin bổ sung cho vùng nhìn, ví dụ `'0px 0px -40px 0px'`. Mặc định `'0px'`.
 *
 * @example
 * ```tsx
 * const [ref, isInView] = useInViewOnce(0.2);
 * return <div ref={ref} className={isInView ? 'animate' : ''}>…</div>;
 * ```
 *
 * @see docs/design-plan.md §5 — Motion Discipline
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
  rootMargin = '0px',
): [React.RefObject<T | null>, boolean] {
  // Check reduced motion preference once, at module scope during render.
  // matchMedia is safe to call during render (synchronous, no DOM mutation).
  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const ref = useRef<T | null>(null);
  const [intersected, setIntersected] = useState(false);

  // If reduced motion → skip observer entirely, show content immediately
  const isInView = prefersReduced || intersected;

  useEffect(() => {
    if (isInView) return; // already triggered or reduced-motion

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersected(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, isInView]);

  return [ref, isInView];
}

export default useInViewOnce;
