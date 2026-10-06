#!/usr/bin/env tsx
/**
 * CONTENT VALIDATOR — Việt Phục Remix Phase 4
 * ============================================================
 * npm run validate:content
 *
 * Kiểm tra:
 * - Schema integrity
 * - Duplicate IDs
 * - Invalid review status (reviewed without reviewer/date/sources)
 * - Missing viewsNote when certainty !== consensus
 * - Story word limits
 * - Forbidden absolute language
 * - Source reference integrity
 * - Draft safety (no content auto-promoted to reviewed)
 *
 * EXIT CODES:
 *   0 = Pass (may have warnings)
 *   1 = Errors found
 */

import { garments } from '../src/content/garments.ts';
import { events, regions, styles } from '../src/content/catalog.ts';
import { researchSourceCandidates } from '../src/content/researchSources.ts';

// ============================================================
// Types
// ============================================================
interface ValidationResult {
  errors: string[];
  warnings: string[];
}

// ============================================================
// Forbidden absolute language patterns (Vietnamese)
// ============================================================
const FORBIDDEN_ABSOLUTE_PATTERNS = [
  /\bchắc chắn\b/i,
  /\bluôn luôn\b/i,
  /\btuyệt đối\b/i,
  /\bcấm\b/i,
  /\bsai hoàn toàn\b/i,
  /\bchuẩn nhất\b/i,
  /\bduy nhất\b/i,
];

// Patterns that are more acceptable (hedge phrases) — reference only, not used in checks
const _HEDGE_PHRASES = [
  'theo nhiều tài liệu',
  'thường được nhắc tới',
  'phổ biến ở',
  'có nhiều cách lý giải',
  'có thể cân nhắc',
  'tùy bối cảnh',
  'thường',
  'thường gắn',
  'theo một số',
];

function checkAbsoluteLanguage(text: string, label: string, result: ValidationResult) {
  for (const pattern of FORBIDDEN_ABSOLUTE_PATTERNS) {
    if (pattern.test(text)) {
      result.warnings.push(
        `[HEDGE] ${label}: Phát hiện ngôn ngữ tuyệt đối: "${text.match(pattern)?.[0]}" — cân nhắc diễn đạt mềm hơn`
      );
    }
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ============================================================
// Validate garments
// ============================================================
function validateGarments(result: ValidationResult) {
  const VALID_CERTAINTY = ['consensus', 'multiple_views', 'reconstruction'];
  const VALID_STATUS = ['draft', 'in_review', 'reviewed'];
  const seenIds = new Set<string>();

  for (const g of garments) {
    const label = `garment[${g.id}]`;

    // Duplicate ID check
    if (seenIds.has(g.id)) {
      result.errors.push(`[DUPLICATE_ID] ${label}: ID trùng lặp`);
    }
    seenIds.add(g.id);

    // Required fields
    if (!g.id) result.errors.push(`[SCHEMA] ${label}: Thiếu id`);
    if (!g.name) result.errors.push(`[SCHEMA] ${label}: Thiếu name`);
    if (!g.shortDescription) result.errors.push(`[SCHEMA] ${label}: Thiếu shortDescription`);
    if (!g.description) result.errors.push(`[SCHEMA] ${label}: Thiếu description`);
    if (!g.region || g.region.length === 0) result.errors.push(`[SCHEMA] ${label}: Thiếu region`);
    if (!g.culturalNote) {
      result.errors.push(`[SCHEMA] ${label}: Thiếu culturalNote`);
      continue;
    }

    const cn = g.culturalNote;

    // Certainty check
    if (!VALID_CERTAINTY.includes(cn.certainty)) {
      result.errors.push(`[SCHEMA] ${label}.culturalNote: certainty không hợp lệ: "${cn.certainty}"`);
    }

    // Status check
    if (!VALID_STATUS.includes(cn.status)) {
      result.errors.push(`[SCHEMA] ${label}.culturalNote: status không hợp lệ: "${cn.status}"`);
    }

    // viewsNote required when certainty !== consensus
    if (cn.certainty !== 'consensus' && !cn.viewsNote) {
      result.errors.push(
        `[MISSING_VIEWS_NOTE] ${label}: certainty="${cn.certainty}" nhưng thiếu viewsNote (bắt buộc)`
      );
    }

    // Review status integrity
    if (cn.status === 'reviewed') {
      if (!cn.reviewedBy) {
        result.errors.push(`[INVALID_REVIEWED] ${label}: status=reviewed nhưng reviewedBy=null`);
      }
      if (!cn.reviewedAt) {
        result.errors.push(`[INVALID_REVIEWED] ${label}: status=reviewed nhưng reviewedAt=null`);
      }
      if (cn.sources.length === 0) {
        result.errors.push(`[INVALID_REVIEWED] ${label}: status=reviewed nhưng sources=[]`);
      }
    }

    if (cn.status === 'in_review') {
      if (cn.sources.length < 2) {
        result.errors.push(
          `[INVALID_IN_REVIEW] ${label}: status=in_review cần >= 2 nguồn độc lập, hiện có ${cn.sources.length}`
        );
      }
    }

    // Draft safety — no null reviewer for non-draft content
    if (cn.status !== 'draft' && cn.status !== 'in_review') {
      if (!cn.reviewedBy || !cn.reviewedAt) {
        result.errors.push(
          `[REVIEW_SAFETY] ${label}: status="${cn.status}" nhưng thiếu reviewer hoặc reviewedAt`
        );
      }
    }

    // Source count consistency
    if (cn.sources.length > 0) {
      // No fake source check — at minimum warn if source has no sourceId
      for (const src of cn.sources) {
        if (!src.sourceId) {
          result.errors.push(`[SOURCE_REF] ${label}: SourceRef thiếu sourceId`);
        }
      }
    }

    // Content field checks
    if (!cn.context) result.warnings.push(`[CONTENT] ${label}: context trống`);
    if (!cn.characteristics) result.warnings.push(`[CONTENT] ${label}: characteristics trống`);
    if (!cn.usage) result.warnings.push(`[CONTENT] ${label}: usage trống`);
    if (!cn.remixAdvice) result.warnings.push(`[CONTENT] ${label}: remixAdvice trống`);

    // Absolute language audit
    checkAbsoluteLanguage(cn.context, `${label}.context`, result);
    checkAbsoluteLanguage(cn.characteristics, `${label}.characteristics`, result);
    checkAbsoluteLanguage(cn.usage, `${label}.usage`, result);
    checkAbsoluteLanguage(cn.remixAdvice, `${label}.remixAdvice`, result);

    // Word count for description fields (spec: 60-120 words per section)
    const sections: Array<{ field: string; text: string; min: number; max: number }> = [
      { field: 'context', text: cn.context, min: 20, max: 150 },
      { field: 'characteristics', text: cn.characteristics, min: 20, max: 150 },
      { field: 'usage', text: cn.usage, min: 20, max: 150 },
      { field: 'remixAdvice', text: cn.remixAdvice, min: 20, max: 150 },
    ];

    for (const s of sections) {
      const wc = countWords(s.text);
      if (wc > s.max) {
        result.warnings.push(
          `[WORD_COUNT] ${label}.${s.field}: ${wc} từ (khuyến nghị <= ${s.max})`
        );
      }
      if (wc < s.min) {
        result.warnings.push(
          `[WORD_COUNT] ${label}.${s.field}: ${wc} từ (quá ngắn, khuyến nghị >= ${s.min})`
        );
      }
    }

    // Research leads should say "Hướng tra cứu"
    for (const lead of cn.researchLeads) {
      if (!lead.toLowerCase().includes('hướng tra cứu') && !lead.toLowerCase().includes('tra cứu')) {
        result.warnings.push(
          `[RESEARCH_LEAD] ${label}: Lead chưa ghi rõ là hướng tra cứu: "${lead.substring(0, 60)}"`
        );
      }
    }
  }

  // Minimum garment count
  if (garments.length < 4) {
    result.errors.push(`[SCHEMA] Thiếu garment: cần ít nhất 4, hiện có ${garments.length}`);
  }
}

// ============================================================
// Validate catalog
// ============================================================
function validateCatalog(result: ValidationResult) {
  if (events.length < 6) {
    result.errors.push(`[SCHEMA] Catalog: events cần ít nhất 6, hiện có ${events.length}`);
  }
  if (regions.length < 3) {
    result.errors.push(`[SCHEMA] Catalog: regions cần ít nhất 3, hiện có ${regions.length}`);
  }
  if (styles.length < 4) {
    result.errors.push(`[SCHEMA] Catalog: styles cần ít nhất 4, hiện có ${styles.length}`);
  }

  // Check garment references in events
  const validGarmentIds = new Set(garments.map(g => g.id));
  for (const event of events) {
    for (const gId of event.suggestedGarments) {
      if (!validGarmentIds.has(gId)) {
        result.errors.push(`[BROKEN_REF] event[${event.id}].suggestedGarments: "${gId}" không tồn tại`);
      }
    }
  }
  for (const region of regions) {
    for (const gId of region.suggestedGarments) {
      if (!validGarmentIds.has(gId)) {
        result.errors.push(`[BROKEN_REF] region[${region.id}].suggestedGarments: "${gId}" không tồn tại`);
      }
    }
  }
}

function validateResearchSources(result: ValidationResult) {
  const validGarmentIds = new Set(garments.map(garment => garment.id));
  const seenIds = new Set<string>();

  for (const source of researchSourceCandidates) {
    if (seenIds.has(source.id)) {
      result.errors.push(`[DUPLICATE_SOURCE_ID] ${source.id}: ID nguồn bị trùng`);
    }
    seenIds.add(source.id);

    if (!source.title || !source.researchScope || source.verificationTasks.length === 0) {
      result.errors.push(`[SOURCE_CANDIDATE] ${source.id}: thiếu tên, phạm vi tra cứu hoặc việc cần xác minh`);
    }
    if (source.relatedGarments.length === 0) {
      result.errors.push(`[SOURCE_CANDIDATE] ${source.id}: chưa liên kết trang phục cần tra cứu`);
    }
    for (const garmentId of source.relatedGarments) {
      if (!validGarmentIds.has(garmentId)) {
        result.errors.push(`[BROKEN_SOURCE_REF] ${source.id}: garment "${garmentId}" không tồn tại`);
      }
    }
  }
}

// ============================================================
// Validate ID naming convention (snake_case ASCII — adjusted for kebab-case)
// ============================================================
function validateIds(result: ValidationResult) {
  const VALID_ID_PATTERN = /^[a-z0-9-]+$/;
  for (const g of garments) {
    if (!VALID_ID_PATTERN.test(g.id)) {
      result.warnings.push(`[ID_FORMAT] garment id "${g.id}" nên dùng lowercase ASCII kebab-case`);
    }
  }
  for (const e of events) {
    if (!VALID_ID_PATTERN.test(e.id)) {
      result.warnings.push(`[ID_FORMAT] event id "${e.id}" nên dùng lowercase ASCII kebab-case`);
    }
  }
  for (const r of regions) {
    if (!VALID_ID_PATTERN.test(r.id)) {
      result.warnings.push(`[ID_FORMAT] region id "${r.id}" nên dùng lowercase ASCII kebab-case`);
    }
  }
}

// ============================================================
// Main
// ============================================================
const result: ValidationResult = { errors: [], warnings: [] };

console.log('\n🔍 Việt Phục Remix — Content Validator\n' + '='.repeat(50));
console.log(`Ngày chạy: ${new Date().toISOString()}\n`);

validateGarments(result);
validateCatalog(result);
validateResearchSources(result);
validateIds(result);

// Report
if (result.errors.length > 0) {
  console.log(`\n❌ ERRORS (${result.errors.length}):\n`);
  for (const e of result.errors) console.log(`  ${e}`);
}

if (result.warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS (${result.warnings.length}):\n`);
  for (const w of result.warnings) console.log(`  ${w}`);
}

if (result.errors.length === 0 && result.warnings.length === 0) {
  console.log('✅ Tất cả kiểm tra đều pass. Không có lỗi hoặc cảnh báo.\n');
} else if (result.errors.length === 0) {
  console.log(`\n✅ Pass (có ${result.warnings.length} warnings — không phải lỗi nghiêm trọng)\n`);
} else {
  console.log(`\n❌ Fail: ${result.errors.length} lỗi, ${result.warnings.length} warnings\n`);
}

console.log('='.repeat(50));
console.log('Ghi chú: Warnings không làm build fail.\n');
console.log('Để xem chi tiết nguồn cần tìm: content/TODO_SOURCES.csv\n');
console.log('Để xem quy tắc đề xuất chưa duyệt: content/PROPOSED_RULES.md\n');

// Exit with error code if errors found
if (result.errors.length > 0) {
  process.exit(1);
}
