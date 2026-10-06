import type { ColorHarmonyResult } from '../types';
import { colorOptions } from '../content/catalog';
import type { ColorId } from '../types';

// ============================================================
// COLOR HARMONY — Visual harmony calculation only
// NOT a cultural, beauty, or quality score
// ============================================================

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hueDiff(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2);
  return Math.min(diff, 360 - diff);
}

export function calculateColorHarmony(selectedColors: ColorId[]): ColorHarmonyResult {
  if (selectedColors.length < 2) {
    return {
      score: 100,
      label: 'Đơn sắc',
      description: 'Một màu duy nhất — luôn hài hòa.',
    };
  }

  const hexes = selectedColors
    .map(id => colorOptions.find(c => c.id === id)?.hex)
    .filter(Boolean) as string[];

  const hsls = hexes.map(hex => hexToHSL(hex));
  let totalScore = 0;
  let comparisons = 0;

  for (let i = 0; i < hsls.length; i++) {
    for (let j = i + 1; j < hsls.length; j++) {
      const hDiff = hueDiff(hsls[i].h, hsls[j].h);
      const sDiff = Math.abs(hsls[i].s - hsls[j].s);
      const lDiff = Math.abs(hsls[i].l - hsls[j].l);

      let pairScore = 0;

      // Complementary (opposite) colors = good harmony
      if (hDiff > 150 && hDiff < 210) pairScore += 40;
      // Analogous (nearby) colors = good harmony
      else if (hDiff < 40) pairScore += 45;
      // Triadic
      else if (hDiff > 110 && hDiff < 130) pairScore += 35;
      // Split-complementary
      else if (hDiff > 130 && hDiff < 170) pairScore += 30;
      // Others
      else pairScore += 20;

      // Similar saturation = bonus
      if (sDiff < 20) pairScore += 25;
      else if (sDiff < 40) pairScore += 15;
      else pairScore += 5;

      // Moderate lightness contrast = bonus
      if (lDiff > 15 && lDiff < 50) pairScore += 30;
      else if (lDiff <= 15) pairScore += 20;
      else pairScore += 10;

      // Neutrals/near-neutrals get bonus (ivory, cream, black, earth-tone)
      const isNeutral = (hsl: { s: number; l: number }) => hsl.s < 15 || hsl.l > 90 || hsl.l < 10;
      if (isNeutral(hsls[i]) || isNeutral(hsls[j])) pairScore += 10;

      totalScore += Math.min(pairScore, 100);
      comparisons++;
    }
  }

  const score = Math.round(comparisons > 0 ? totalScore / comparisons : 50);
  const clampedScore = Math.min(100, Math.max(0, score));

  let label: string;
  let description: string;

  if (clampedScore >= 80) {
    label = 'Rất hài hòa';
    description = 'Các màu kết hợp tốt với nhau, tạo cảm giác cân đối và dễ chịu.';
  } else if (clampedScore >= 60) {
    label = 'Hài hòa';
    description = 'Các màu tương đối cân bằng. Có thể tinh chỉnh để tối ưu hơn.';
  } else if (clampedScore >= 40) {
    label = 'Tạm ổn';
    description = 'Các màu có thể chưa phối tối ưu nhưng vẫn chấp nhận được.';
  } else {
    label = 'Cần cân nhắc';
    description = 'Sự kết hợp màu này có thể chưa lý tưởng về mặt thị giác. Thử thay đổi một trong các màu.';
  }

  return { score: clampedScore, label, description };
}
