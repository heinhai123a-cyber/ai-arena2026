import type { LookbookEntry, OutfitResult } from '../types';

// ============================================================
// STORAGE — localStorage persistence for Lookbook
// Falls back to in-memory if localStorage unavailable
// ============================================================

const LOOKBOOK_KEY = 'phoiviet.lookbook.v1';
const LOOKBOOK_KEY_OLD = 'viet-phuc-remix-lookbook'; // legacy — migrate on first read
const LOOKBOOK_MAX = 12;

let memoryFallback: LookbookEntry[] = [];
let useMemory = false;

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function init() {
  if (!isLocalStorageAvailable()) {
    useMemory = true;
    console.warn('localStorage not available, using in-memory fallback');
  }
}

init();

export function getLookbook(): LookbookEntry[] {
  try {
    if (useMemory) return [...memoryFallback];
    // Migrate from legacy key if present
    const legacy = localStorage.getItem(LOOKBOOK_KEY_OLD);
    if (legacy && !localStorage.getItem(LOOKBOOK_KEY)) {
      localStorage.setItem(LOOKBOOK_KEY, legacy);
      localStorage.removeItem(LOOKBOOK_KEY_OLD);
    }
    const data = localStorage.getItem(LOOKBOOK_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getLook(id: string): LookbookEntry | undefined {
  return getLookbook().find(l => l.id === id);
}

export function saveLook(outfit: OutfitResult, note?: string): LookbookEntry | null {
  try {
    const existing = getLookbook();
    if (existing.length >= LOOKBOOK_MAX) {
      // Phase 5 §41: max 12 items — do not silently create item 13
      return null;
    }
  } catch { /* ignore, attempt save anyway */ }

  const entry: LookbookEntry = {
    id: `look-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    outfit,
    savedAt: new Date().toISOString(),
    note,
  };

  try {
    const looks = getLookbook();
    if (looks.length >= LOOKBOOK_MAX) return null;
    looks.unshift(entry);
    if (useMemory) {
      memoryFallback = looks;
    } else {
      localStorage.setItem(LOOKBOOK_KEY, JSON.stringify(looks));
    }
  } catch (err) {
    console.error('Failed to save look:', err);
    // Fall back to memory
    useMemory = true;
    memoryFallback = getLookbook();
    if (memoryFallback.length >= LOOKBOOK_MAX) return null;
    memoryFallback.unshift(entry);
  }

  return entry;
}

export function removeLook(id: string): void {
  try {
    const looks = getLookbook().filter(l => l.id !== id);
    if (useMemory) {
      memoryFallback = looks;
    } else {
      localStorage.setItem(LOOKBOOK_KEY, JSON.stringify(looks));
    }
  } catch (err) {
    console.error('Failed to remove look:', err);
  }
}

export function duplicateLook(id: string): LookbookEntry | null {
  const looks = getLookbook();
  const original = looks.find(l => l.id === id);
  if (!original) return null;

  return saveLook(original.outfit, original.note ? `${original.note} (bản sao)` : 'Bản sao');
}

export function clearLookbook(): void {
  try {
    if (useMemory) {
      memoryFallback = [];
    } else {
      localStorage.removeItem(LOOKBOOK_KEY);
    }
  } catch (err) {
    console.error('Failed to clear lookbook:', err);
  }
}
