import { useEffect, type RefObject, type MouseEvent } from 'react';

/**
 * Adds `is-visible` to every element matching `selector` inside `root`
 * the first time it scrolls into view. Pair with `.reveal` CSS classes.
 */
export function useReveal(root: RefObject<HTMLElement | null>, selector = '.reveal') {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll<HTMLElement>(selector));

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      targets.forEach(t => t.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, [root, selector]);
}

/** Mouse handlers that drive a 3D tilt + glare via CSS variables (see `.tilt`). */
export const tiltHandlers = {
  onMouseMove: (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
  },
  onMouseLeave: (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  },
};
