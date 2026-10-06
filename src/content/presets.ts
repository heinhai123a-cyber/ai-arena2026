import type { RemixPreferences } from '../types';

export interface PresetDefinition {
  id: string;
  name: string;
  description: string;
  prefs: RemixPreferences;
}

export const PRESET_MATRIX: Record<string, PresetDefinition> = {
  tet_gia_dinh__ao_dai_truyen_thong: {
    id: 'tet_gia_dinh__ao_dai_truyen_thong',
    name: 'Tết Gia Đình — Áo Dài Truyền Thống',
    description: 'Áo dài trang trọng đón Tết cùng gia đình, mức nguyên bản.',
    prefs: {
      garment: 'ao-dai',
      event: 'tet',
      region: 'bac-bo',
      style: 'thanh-lich',
      colors: ['ivory', 'burgundy'],
      accessories: ['trang-suc'],
      remixLevel: 20,
    },
  },
  van_nghe_clb__ao_dai_cach_tan: {
    id: 'van_nghe_clb__ao_dai_cach_tan',
    name: 'Văn Nghệ CLB — Áo Dài Cách Tân',
    description: 'Áo dài cách tân trẻ trung biểu diễn văn nghệ câu lạc bộ.',
    prefs: {
      garment: 'ao-dai',
      event: 'van-nghe',
      region: 'trung-bo',
      style: 'toi-gian',
      colors: ['cream', 'pastel'],
      accessories: ['khan'],
      remixLevel: 50,
    },
  },
  streetwear_saigon__ao_ba_ba: {
    id: 'streetwear_saigon__ao_ba_ba',
    name: 'Streetwear Sài Gòn — Áo Bà Ba',
    description: 'Áo bà ba phối phong cách đường phố đương đại.',
    prefs: {
      garment: 'ao-ba-ba',
      event: 'di-san',
      region: 'nam-bo',
      style: 'streetwear',
      colors: ['black', 'earth-tone'],
      accessories: ['tui'],
      remixLevel: 80,
    },
  },
  bac_bo_le_hoi__ao_tu_than: {
    id: 'bac_bo_le_hoi__ao_tu_than',
    name: 'Bắc Bộ Lễ Hội — Áo Tứ Thân',
    description: 'Áo tứ thân thanh lịch trong không khí lễ hội truyền thống.',
    prefs: {
      garment: 'ao-tu-than',
      event: 'le-hoi',
      region: 'bac-bo',
      style: 'thanh-lich',
      colors: ['burgundy', 'cream'],
      accessories: ['khan'],
      remixLevel: 25,
    },
  },
};
