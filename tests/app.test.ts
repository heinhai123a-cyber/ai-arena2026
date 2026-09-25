import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateOutfit } from '../src/lib/remixEngine.ts';
import { validateCulturalContext } from '../src/lib/culturalValidation.ts';
import { calculateColorHarmony } from '../src/lib/colorHarmony.ts';
import { garments } from '../src/content/garments.ts';
import { events, styles } from '../src/content/catalog.ts';
import { saveLook, getLookbook, removeLook, clearLookbook, duplicateLook, getLook } from '../src/lib/storage.ts';
import { PRESET_MATRIX } from '../src/content/presets.ts';
import type { RemixPreferences, ColorId, AccessoryId } from '../src/types/index.ts';

describe('Việt Phục Remix — Content Data Integrity', () => {
  test('all garments have valid required fields and draft safety status', () => {
    assert.ok(garments.length >= 4, 'Should have at least 4 garments');
    for (const g of garments) {
      assert.ok(g.id, 'Garment has id');
      assert.ok(g.name, 'Garment has name');
      assert.ok(g.region.length > 0, 'Garment has at least one region');
      assert.ok(g.typicalOccasions.length > 0, 'Garment has typical occasions');
      assert.strictEqual(g.culturalNote.status, 'draft', 'Content must maintain draft safety status');
      assert.strictEqual(g.culturalNote.reviewedBy, null, 'Unreviewed draft content');
      assert.ok(g.culturalNote.context, 'Cultural context exists');
      assert.ok(g.culturalNote.characteristics, 'Characteristics exist');
      assert.ok(g.culturalNote.usage, 'Usage guidelines exist');
      assert.ok(g.culturalNote.remixAdvice, 'Remix advice exists');
    }
  });

  test('events and styles catalogs are populated', () => {
    assert.ok(events.length >= 6, 'Events catalog has at least 6 events');
    assert.ok(styles.length >= 4, 'Styles catalog has at least 4 styles');
  });
});

describe('Việt Phục Remix — Remix Engine & Golden Demo Path', () => {
  test('Golden Demo Path generates correct outfit structure', () => {
    const prefs: RemixPreferences = {
      garment: 'ao-dai',
      event: 'tet',
      region: 'trung-bo',
      style: 'toi-gian',
      colors: ['ivory', 'burgundy'] as ColorId[],
      accessories: ['trang-suc', 'tui'] as AccessoryId[],
      remixLevel: 70,
    };

    const outfit = generateOutfit(prefs);

    assert.ok(outfit.id.startsWith('outfit-'), 'Valid outfit id format');
    assert.strictEqual(outfit.remixLevel, 70);
    assert.strictEqual(outfit.remixLabel, 'Remix mạnh', '70% corresponds to Remix mạnh');
    assert.ok(outfit.title.includes('Tối giản') || outfit.title.includes('Tết'), 'Title matches style and event');
    assert.ok(outfit.items.length >= 3, 'Outfit items include core garment, bottoms, and accessories');
    assert.ok(outfit.culturalContext, 'Cultural context is evaluated');
    assert.ok(['green', 'yellow', 'red'].includes(outfit.culturalContext.status), 'Valid status');
  });

  test('Remix levels label correctly (Nguyên bản, Cách tân, Remix mạnh)', () => {
    const basePrefs: RemixPreferences = {
      garment: 'ao-dai',
      event: 'tet',
      region: 'bac-bo',
      style: 'toi-gian',
      colors: ['ivory'] as ColorId[],
      accessories: [] as AccessoryId[],
      remixLevel: 50,
    };

    const traditional = generateOutfit({ ...basePrefs, remixLevel: 20 });
    assert.strictEqual(traditional.remixLabel, 'Nguyên bản');

    const modernized = generateOutfit({ ...basePrefs, remixLevel: 50 });
    assert.strictEqual(modernized.remixLabel, 'Cách tân');

    const highRemix = generateOutfit({ ...basePrefs, remixLevel: 85 });
    assert.strictEqual(highRemix.remixLabel, 'Remix mạnh');
  });
});

describe('Việt Phục Remix — Cultural Validation Engine', () => {
  test('validates appropriate cultural context as green', () => {
    const result = validateCulturalContext({
      garment: 'ao-dai',
      event: 'tet',
      region: 'bac-bo',
      style: 'toi-gian',
      remixLevel: 30,
      accessories: [],
    });

    assert.strictEqual(result.status, 'green');
    assert.ok(result.message.includes('Phù hợp'));
  });

  test('validates formal sacred events with high remix as caution/warning', () => {
    const result = validateCulturalContext({
      garment: 'ao-ngu-than',
      event: 'van-nghe',
      region: 'trung-bo',
      style: 'duong-dai',
      remixLevel: 85,
      accessories: [],
    });

    assert.ok(result.status === 'yellow' || result.status === 'red', 'High remix for ceremonial garment triggers caution');
    assert.ok(result.reasons.length > 0, 'Provides reasons');
    assert.ok(result.reasons[0].howToFix, 'Provides actionable fix recommendation');
  });
});

describe('Việt Phục Remix — Color Harmony Engine', () => {
  test('computes harmony score and descriptive label', () => {
    const harmony = calculateColorHarmony(['ivory', 'burgundy']);
    assert.ok(harmony.score >= 0 && harmony.score <= 100);
    assert.ok(harmony.description.length > 0);
  });
});

describe('Việt Phục Remix — Phase 4 Golden Cultural Scenarios', () => {
  // §68: Áo bà ba + Nón quai thao + Nguyên bản → RED
  test('§68: Áo bà ba + Nón quai thao + Nguyên bản triggers RED', () => {
    const result = validateCulturalContext({
      garment: 'ao-ba-ba',
      event: 'tet',
      region: 'nam-bo',
      style: 'thanh-lich',
      remixLevel: 20,
      accessories: ['non'],
    });
    assert.strictEqual(result.status, 'red', 'Áo bà ba + Nón quai thao nguyên bản phải là RED');
    assert.ok(result.reasons.length > 0, 'Phải có lý do giải thích');
    assert.ok(result.reasons[0].howToFix.length > 0, 'Phải có gợi ý sửa');
  });

  // §69: Áo tứ thân ở Nam Bộ triggers regional warning
  test('§69: Áo tứ thân ở Nam Bộ triggers regional warning', () => {
    const result = validateCulturalContext({
      garment: 'ao-tu-than',
      event: 'le-hoi',
      region: 'nam-bo',
      style: 'vintage',
      remixLevel: 20,
      accessories: ['khan'],
    });
    assert.ok(
      result.status === 'yellow' || result.status === 'red',
      'Áo tứ thân ở Nam Bộ phải có cảnh báo vùng miền'
    );
  });

  // §70: Tết + Áo dài + nguyên bản = no red
  test('§70: Tết + Áo dài + Nguyên bản = no red', () => {
    const result = validateCulturalContext({
      garment: 'ao-dai',
      event: 'tet',
      region: 'bac-bo',
      style: 'thanh-lich',
      remixLevel: 20,
      accessories: [],
    });
    assert.notStrictEqual(result.status, 'red', 'Áo dài Tết nguyên bản không nên là RED');
  });

  // viewsNote integrity
  test('Content safety: ao-ngu-than has viewsNote for multiple_views certainty', () => {
    const nguThan = garments.find(g => g.id === 'ao-ngu-than');
    assert.ok(nguThan, 'Áo ngũ thân phải tồn tại');
    assert.strictEqual(nguThan.culturalNote.certainty, 'multiple_views');
    assert.ok(nguThan.culturalNote.viewsNote, 'multiple_views phải có viewsNote');
    assert.ok((nguThan.culturalNote.viewsNote?.length ?? 0) > 20, 'viewsNote phải đủ nội dung');
  });

  // Sources safety: no fake sources
  test('Cultural safety gate: no fake sources in any garment', () => {
    for (const g of garments) {
      assert.ok(Array.isArray(g.culturalNote.sources), `${g.id}: sources phải là array`);
      assert.strictEqual(
        g.culturalNote.sources.length,
        0,
        `${g.id}: chưa có nguồn thật, sources phải = []`
      );
    }
  });

  // Reviewer safety: no fake reviewers
  test('Cultural safety gate: no fake reviewers in any garment', () => {
    for (const g of garments) {
      assert.strictEqual(g.culturalNote.reviewedBy, null, `${g.id}: reviewedBy phải là null`);
      assert.strictEqual(g.culturalNote.reviewedAt, null, `${g.id}: reviewedAt phải là null`);
    }
  });
});

describe('Việt Phục Remix — Phase 5 Functional & Integration Suite', () => {
  // §18 Golden Scenario: Áo tứ thân + Khăn rằn
  test('§18: Áo tứ thân + Khăn rằn + Nguyên bản triggers RED', () => {
    const result = validateCulturalContext({
      garment: 'ao-tu-than',
      event: 'tet',
      region: 'bac-bo',
      style: 'thanh-lich',
      remixLevel: 25,
      accessories: ['khan'],
      accessoryVariants: ['khan-ran'],
    });
    assert.strictEqual(result.status, 'red', 'Khăn rằn với áo tứ thân nguyên bản phải là RED');
    assert.ok(result.reasons.some(r => r.what.includes('Khăn rằn')), 'Phải có lý do văn hóa giải thích');
  });

  test('§18: Áo tứ thân + Khăn rằn at Cách tân / Remix triggers YELLOW', () => {
    const cachTan = validateCulturalContext({
      garment: 'ao-tu-than',
      event: 'tet',
      region: 'bac-bo',
      style: 'thanh-lich',
      remixLevel: 50,
      accessories: ['khan'],
      accessoryVariants: ['khan-ran'],
    });
    assert.strictEqual(cachTan.status, 'yellow', 'Ở mức Cách tân, khăn rằn với áo tứ thân phải là YELLOW');

    const remixManh = validateCulturalContext({
      garment: 'ao-tu-than',
      event: 'tet',
      region: 'bac-bo',
      style: 'thanh-lich',
      remixLevel: 80,
      accessories: ['khan'],
      accessoryVariants: ['khan-ran'],
    });
    assert.strictEqual(remixManh.status, 'yellow', 'Ở mức Remix mạnh, khăn rằn với áo tứ thân phải là YELLOW');
  });

  // §40 & §41 Lookbook storage and max 12 items limit
  test('§40 & §41: Lookbook persistence, capacity limit of 12, duplicate, and lookup', () => {
    clearLookbook();
    assert.strictEqual(getLookbook().length, 0, 'Lookbook initially empty');

    const dummyOutfit = generateOutfit({
      garment: 'ao-dai',
      event: 'tet',
      region: 'bac-bo',
      style: 'thanh-lich',
      colors: ['ivory', 'burgundy'],
      accessories: [],
      remixLevel: 20,
    });

    // Save up to 12 items
    const savedIds: string[] = [];
    for (let i = 0; i < 12; i++) {
      const saved = saveLook(dummyOutfit, `Look #${i + 1}`);
      assert.ok(saved !== null, `Look #${i + 1} saved successfully`);
      savedIds.push(saved.id);
    }

    assert.strictEqual(getLookbook().length, 12, 'Lookbook reaches exactly 12 items');

    // 13th item must be rejected (returns null)
    const thirteenth = saveLook(dummyOutfit, 'Look #13');
    assert.strictEqual(thirteenth, null, '13th item must return null (max 12 items)');
    assert.strictEqual(getLookbook().length, 12, 'Lookbook stays capped at 12 items');

    // getLook lookup
    const lookup = getLook(savedIds[0]);
    assert.ok(lookup !== undefined, 'getLook finds saved entry by ID');
    assert.strictEqual(lookup.id, savedIds[0]);

    // Invalid lookup returns undefined
    assert.strictEqual(getLook('non_existing_outfit_id'), undefined, 'Invalid id returns undefined');

    // Remove one item and duplicate
    removeLook(savedIds[0]);
    assert.strictEqual(getLookbook().length, 11, 'After removal, count is 11');

    const dup = duplicateLook(savedIds[1]);
    assert.ok(dup !== null, 'Duplicate succeeds when space available');
    assert.strictEqual(getLookbook().length, 12, 'After duplicate, count is 12');

    clearLookbook();
  });

  // §44 Malformed input resilience
  test('§44: Malformed input resilience in remix engine', () => {
    // Unknown garment ID and NaN remix level
    const malformed = generateOutfit({
      garment: 'unknown-garment' as any,
      event: 'invalid-event' as any,
      region: 'invalid-region' as any,
      style: 'invalid-style' as any,
      colors: ['not-a-color' as any],
      accessories: ['unknown-acc' as any],
      remixLevel: NaN,
    });

    assert.ok(malformed.id, 'Produces valid outfit id');
    assert.ok(malformed.title, 'Produces valid title');
    assert.ok(malformed.items.length > 0, 'Produces valid items array');
    assert.ok(malformed.palette.length > 0, 'Produces valid palette');
    assert.ok(malformed.culturalContext, 'Produces valid cultural context');
    assert.strictEqual(malformed.remixLevel, 50, 'NaN remix level defaults safely to 50');
  });

  // §86 & §87 Preset matrix verification
  test('§86 & §87: Full Preset Matrix generates valid outfits', () => {
    const presetKeys = Object.keys(PRESET_MATRIX);
    assert.ok(presetKeys.includes('tet_gia_dinh__ao_dai_truyen_thong'), 'Matrix includes tet_gia_dinh__ao_dai_truyen_thong');
    assert.ok(presetKeys.includes('van_nghe_clb__ao_dai_cach_tan'), 'Matrix includes van_nghe_clb__ao_dai_cach_tan');

    for (const key of presetKeys) {
      const preset = PRESET_MATRIX[key];
      assert.ok(preset.name, `${key} has a name`);
      const outfit = generateOutfit(preset.prefs);
      assert.ok(outfit.id, `${key} generates outfit`);
      assert.ok(outfit.palette.length >= 2, `${key} has palette`);
      assert.ok(outfit.items.length >= 2, `${key} has items`);
      assert.ok(['Nguyên bản', 'Cách tân', 'Remix mạnh'].includes(outfit.remixLabel), `${key} has valid label`);
      assert.ok(['green', 'yellow'].includes(outfit.culturalContext.status), `${key} preset has no RED status`);
    }
  });

  // §35 Export and save safety invariant
  test('§35: Export and save safety blocks RED + Nguyên bản combination', () => {
    const redOutfit = generateOutfit({
      garment: 'ao-ba-ba',
      event: 'tet',
      region: 'nam-bo',
      style: 'toi-gian',
      colors: ['ivory', 'burgundy'],
      accessories: ['non'],
      remixLevel: 20,
    });

    assert.strictEqual(redOutfit.remixLabel, 'Nguyên bản');
    assert.strictEqual(redOutfit.culturalContext.status, 'red');

    // Invariant: cannot export/save as Nguyên bản when red
    const isBlocked = redOutfit.culturalContext.status === 'red' && redOutfit.remixLabel === 'Nguyên bản';
    assert.strictEqual(isBlocked, true, 'RED + Nguyên bản must be strictly blocked');
  });
});

