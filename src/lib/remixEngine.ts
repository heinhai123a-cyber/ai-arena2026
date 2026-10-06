import type {
  RemixPreferences,
  OutfitResult,
  OutfitItem,
  PaletteColor,
  RemixLabel,
  ColorId,
  AccessoryId,
} from '../types';
import { garments } from '../content/garments';
import { DEFAULT_CHARACTER_ID, getRepresentativeCharacter } from '../content/characters';
import { events, regions, styles, colorOptions, accessories } from '../content/catalog';
import { validateCulturalContext } from './culturalValidation';
import { getWeatherAdvice } from './outfitGuidance';

// ============================================================
// REMIX ENGINE — Deterministic outfit generation
// ============================================================

function getRemixLabel(level: number): RemixLabel {
  if (level <= 33) return 'Nguyên bản';
  if (level <= 66) return 'Cách tân';
  return 'Remix mạnh';
}

function generateTitle(prefs: RemixPreferences): string {
  const event = events.find(e => e.id === prefs.event);
  const style = styles.find(s => s.id === prefs.style);
  const label = getRemixLabel(prefs.remixLevel);

  if (label === 'Remix mạnh') {
    return `${style?.name || 'Modern'} ${event?.name || 'Look'}`;
  }
  if (label === 'Cách tân') {
    return `${event?.name || 'Contemporary'} — ${style?.name || 'Style'}`;
  }
  return `${event?.name || 'Truyền thống'} — Nguyên bản`;
}

function getPalette(selectedColors: ColorId[], remixLevel: number): PaletteColor[] {
  const palette: PaletteColor[] = [];
  const colors = selectedColors.length > 0 ? selectedColors : ['ivory', 'burgundy'] as ColorId[];

  colors.forEach((colorId, index) => {
    const color = colorOptions.find(c => c.id === colorId);
    if (color) {
      palette.push({
        name: color.name,
        hex: color.hex,
        role: index === 0 ? 'primary' : index === 1 ? 'secondary' : 'accent',
      });
    }
  });

  // Add accent if we have less than 3 colors and remix level is moderate+
  if (palette.length < 3 && remixLevel > 30) {
    const goldAccent: PaletteColor = { name: 'Warm Gold', hex: '#C5A55A', role: 'accent' };
    palette.push(goldAccent);
  }

  return palette;
}

function generateItems(prefs: RemixPreferences): OutfitItem[] {
  const items: OutfitItem[] = [];
  const garment = garments.find(g => g.id === prefs.garment);
  const remixLabel = getRemixLabel(prefs.remixLevel);
  const primaryColor = prefs.colors[0] ? colorOptions.find(c => c.id === prefs.colors[0])?.name || 'Ivory' : 'Ivory';
  const secondaryColor = prefs.colors[1] ? colorOptions.find(c => c.id === prefs.colors[1])?.name || 'Burgundy' : 'Burgundy';

  if (!garment) return items;

  // Main garment
  const garmentDescriptions: Record<string, Record<RemixLabel, string>> = {
    'ao-dai': {
      'Nguyên bản': 'Áo dài truyền thống với cổ cao, tay dài, tà dài chạm mắt cá chân.',
      'Cách tân': 'Áo dài cách tân — giữ phom dáng chính, cổ có thể thay đổi, tà ngắn hơn một chút.',
      'Remix mạnh': 'Áo dài remix — giữ cấu trúc hai tà nhưng phom hiện đại, có thể kết hợp phụ kiện đương đại.',
    },
    'ao-ngu-than': {
      'Nguyên bản': 'Áo ngũ thân truyền thống 5 vạt, cài khuy bên phải, tay rộng.',
      'Cách tân': 'Áo ngũ thân cách tân — giữ cấu trúc 5 thân, chất liệu và màu sắc hiện đại hơn.',
      'Remix mạnh': 'Áo ngũ thân remix — lấy cảm hứng từ cấu trúc ngũ thân, phối hiện đại.',
    },
    'ao-tu-than': {
      'Nguyên bản': 'Áo tứ thân truyền thống 4 vạt, mặc cùng yếm và váy đụp.',
      'Cách tân': 'Áo tứ thân cách tân — giữ 4 vạt, kết hợp linh hoạt hơn với phụ kiện.',
      'Remix mạnh': 'Áo tứ thân remix — lấy cảm hứng từ cấu trúc 4 vạt, phối tự do hơn.',
    },
    'ao-ba-ba': {
      'Nguyên bản': 'Áo bà ba truyền thống, phom suông, xẻ hông, chất liệu mộc.',
      'Cách tân': 'Áo bà ba cách tân — giữ phom suông, chất liệu và chi tiết hiện đại hơn.',
      'Remix mạnh': 'Áo bà ba remix — giữ đặc trưng xẻ hông, phối phong cách đương đại.',
    },
  };

  items.push({
    category: 'garment',
    name: garment.name,
    description: garmentDescriptions[garment.id]?.[remixLabel] || garment.shortDescription,
    color: primaryColor,
  });

  // Bottom
  const bottomMap: Record<string, Record<RemixLabel, { name: string; description: string }>> = {
    'ao-dai': {
      'Nguyên bản': { name: 'Quần suông trắng', description: 'Quần suông truyền thống, vải mềm.' },
      'Cách tân': { name: 'Quần suông', description: 'Quần suông phom hiện đại, màu hài hòa.' },
      'Remix mạnh': { name: 'Quần suông / Jeans', description: 'Quần suông hoặc quần jeans phối cùng áo dài.' },
    },
    'ao-ngu-than': {
      'Nguyên bản': { name: 'Quần dài', description: 'Quần dài truyền thống, màu tối.' },
      'Cách tân': { name: 'Quần dài', description: 'Quần dài phom hiện đại.' },
      'Remix mạnh': { name: 'Quần dài phom rộng', description: 'Quần ống rộng phối hiện đại.' },
    },
    'ao-tu-than': {
      'Nguyên bản': { name: 'Váy đụp', description: 'Váy đụp truyền thống Bắc Bộ.' },
      'Cách tân': { name: 'Váy dài', description: 'Váy dài cách tân, giữ phom truyền thống.' },
      'Remix mạnh': { name: 'Váy midi', description: 'Váy midi phong cách hiện đại.' },
    },
    'ao-ba-ba': {
      'Nguyên bản': { name: 'Quần lá tọa', description: 'Quần đen rộng truyền thống miền Nam.' },
      'Cách tân': { name: 'Quần lá tọa cách tân', description: 'Quần rộng chất liệu hiện đại.' },
      'Remix mạnh': { name: 'Quần ống rộng', description: 'Quần ống rộng phối phong cách đương đại.' },
    },
  };

  const bottom = bottomMap[garment.id]?.[remixLabel];
  if (bottom) {
    items.push({
      category: 'bottom',
      name: bottom.name,
      description: bottom.description,
      color: secondaryColor,
    });
  }

  // Accessories based on selection and remix level
  prefs.accessories.forEach(accId => {
    const acc = accessories.find(a => a.id === accId);
    if (!acc) return;

    // Pick the most appropriate variant based on remix level and garment compatibility
    const compatibleVariants = acc.variants.filter(v =>
      v.compatibleGarments.includes(prefs.garment!) &&
      prefs.remixLevel >= v.remixRange[0] &&
      prefs.remixLevel <= v.remixRange[1]
    );

    const requestedVariantId = prefs.accessoryVariants?.find(variantId => acc.variants.some(variant => variant.id === variantId));
    const variant = requestedVariantId
      ? acc.variants.find(candidate => candidate.id === requestedVariantId)
      : compatibleVariants[0] || acc.variants[0];
    if (variant) {
      let category: OutfitItem['category'] = 'accessory';
      if (accId === 'giay') category = 'footwear';
      if (accId === 'tui') category = 'bag';
      if (accId === 'non' || accId === 'khan' || accId === 'phu-kien-toc') category = 'headwear';

      items.push({
        category,
        name: variant.name,
        description: variant.description,
        color: '',
      });
    }
  });

  return items;
}

function generateStylingReason(prefs: RemixPreferences): string {
  const style = styles.find(s => s.id === prefs.style);
  const garment = garments.find(g => g.id === prefs.garment);
  const event = events.find(e => e.id === prefs.event);
  const remixLabel = getRemixLabel(prefs.remixLevel);

  const parts: string[] = [];

  if (style && garment) {
    const character = getRepresentativeCharacter(prefs.character || DEFAULT_CHARACTER_ID);
    parts.push(`Trên nhân vật ${character.name}, bạn chọn phong cách ${style.name} với ${garment.name}`);
  }

  if (event) {
    parts.push(`cho dịp ${event.name}`);
  }

  if (remixLabel === 'Nguyên bản') {
    parts.push('— hệ thống giữ nguyên cấu trúc truyền thống và phụ kiện cổ điển phù hợp.');
  } else if (remixLabel === 'Cách tân') {
    parts.push('— hệ thống giữ cấu trúc chính của trang phục và hiện đại hóa một số chi tiết.');
  } else {
    parts.push('— hệ thống giữ những yếu tố nhận diện chính và cho phép nhiều biến tấu hiện đại. Phụ kiện được tiết chế để tạo cảm giác đương đại.');
  }

  if (style?.id === 'toi-gian') {
    parts.push(' Phong cách tối giản giúp tập trung vào form dáng trang phục.');
  } else if (style?.id === 'streetwear') {
    parts.push(' Phong cách đường phố tạo sự tương phản thú vị với trang phục truyền thống.');
  } else if (style?.id === 'vintage') {
    parts.push(' Phong cách hoài cổ tôn vinh vẻ đẹp trường tồn của trang phục.');
  }

  if (prefs.weather && prefs.weather !== 'unspecified') {
    parts.push(` ${getWeatherAdvice(prefs.weather)}`);
  }

  return parts.join(' ');
}

function generateId(): string {
  return `outfit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export function generateOutfit(prefs: RemixPreferences): OutfitResult {
  const garment = garments.find(g => g.id === prefs.garment) || garments[0];
  const event = events.find(e => e.id === prefs.event) || events[0];
  const region = regions.find(r => r.id === prefs.region) || regions[0];
  const style = styles.find(s => s.id === prefs.style) || styles[0];
  const safeRemixLevel = Math.max(0, Math.min(100, isNaN(prefs.remixLevel) ? 50 : prefs.remixLevel));
  const safeColors = (Array.isArray(prefs.colors) && prefs.colors.length > 0 ? prefs.colors : ['ivory', 'burgundy']) as ColorId[];
  const safeAccessories = (Array.isArray(prefs.accessories) ? prefs.accessories : []) as AccessoryId[];

  const safePrefs: RemixPreferences = {
    garment: garment.id,
    character: prefs.character || DEFAULT_CHARACTER_ID,
    event: event.id,
    region: region.id,
    style: style.id,
    colors: safeColors,
    accessories: safeAccessories,
    accessoryVariants: Array.isArray(prefs.accessoryVariants) ? prefs.accessoryVariants : [],
    weather: prefs.weather || 'unspecified',
    remixLevel: safeRemixLevel,
  };

  const remixLabel = getRemixLabel(safeRemixLevel);

  const items = generateItems(safePrefs);
  const palette = getPalette(safePrefs.colors, safeRemixLevel);

  // Extract resolved accessory variants for cultural validation
  const accessoryVariants: string[] = [];
  safeAccessories.forEach(accId => {
    const acc = accessories.find(a => a.id === accId);
    if (acc) {
      const requestedVariantId = safePrefs.accessoryVariants?.find(variantId => acc.variants.some(variant => variant.id === variantId));
      const match = requestedVariantId
        ? acc.variants.find(variant => variant.id === requestedVariantId)
        : acc.variants.find(v =>
        v.compatibleGarments.includes(garment.id) &&
        safeRemixLevel >= v.remixRange[0] &&
        safeRemixLevel <= v.remixRange[1]
        ) || acc.variants[0];
      if (match) accessoryVariants.push(match.id);
    }
  });

  const culturalContext = validateCulturalContext({
    garment: garment.id,
    event: event.id,
    region: region.id,
    style: style.id,
    remixLevel: safeRemixLevel,
    accessories: safeAccessories,
    accessoryVariants,
  });

  const character = getRepresentativeCharacter(safePrefs.character);
  const tags = [character.name, garment.name, style.name, event.name, remixLabel];

  return {
    id: generateId(),
    title: generateTitle(safePrefs),
    outfit: {
      garment: garment.id,
      garmentName: garment.name,
      event: event.id,
      eventName: event.name,
      accessoryVariants,
      weather: safePrefs.weather,
      region: region.id,
      regionName: region.name,
      style: style.id,
      styleName: style.name,
      character: safePrefs.character || DEFAULT_CHARACTER_ID,
    },
    items,
    palette,
    remixLevel: safeRemixLevel,
    remixLabel,
    stylingReason: generateStylingReason(safePrefs),
    culturalContext,
    tags,
    createdAt: new Date().toISOString(),
  };
}
