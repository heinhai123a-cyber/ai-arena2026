import { useEffect } from 'react';

const BASE_TITLE = 'Việt Phục Remix';

/**
 * Sets document.title for the current page.
 * Restores the base title on unmount.
 */
export function useDocumentTitle(subtitle?: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = subtitle ? `${subtitle} — ${BASE_TITLE}` : BASE_TITLE;
    return () => { document.title = prev; };
  }, [subtitle]);
}
