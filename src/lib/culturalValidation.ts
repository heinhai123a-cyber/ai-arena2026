import type {
  CulturalContextResult,
  CulturalReason,
  CulturalStatus,
  GarmentId,
  EventId,
  RegionId,
  StyleId,
  AccessoryId,
} from '../types';
import { accessories } from '../content/catalog';

// ============================================================
// CULTURAL VALIDATION ENGINE
// Provides context-based validation — NOT cultural scoring
// ============================================================

interface ValidationInput {
  garment: GarmentId;
  event: EventId;
  region: RegionId;
  style: StyleId;
  remixLevel: number;
  accessories: AccessoryId[];
  accessoryVariants?: string[];
}

// Rules for cultural context validation
interface ValidationRule {
  id: string;
  check: (input: ValidationInput) => boolean;
  status: CulturalStatus;
  reason: CulturalReason;
}

const accessoryVariantsById = new Map(
  accessories.flatMap(accessory => accessory.variants).map(variant => [variant.id, variant])
);

function getSelectedAccessoryVariants(input: ValidationInput) {
  if (input.accessoryVariants?.length) {
    return input.accessoryVariants
      .map(variantId => accessoryVariantsById.get(variantId))
      .filter(variant => Boolean(variant));
  }

  return input.accessories.flatMap(accessoryId => {
    const accessory = accessories.find(candidate => candidate.id === accessoryId);
    if (!accessory) return [];
    const selected = accessory.variants.find(variant =>
      variant.compatibleGarments.includes(input.garment) &&
      input.remixLevel >= variant.remixRange[0] &&
      input.remixLevel <= variant.remixRange[1]
    ) || accessory.variants[0];
    return selected ? [selected] : [];
  });
}

function hasAccessoryVariant(input: ValidationInput, variantId: string): boolean {
  return getSelectedAccessoryVariants(input).some(variant => variant?.id === variantId);
}

const validationRules: ValidationRule[] = [
  // Áo ngũ thân at high remix level
  {
    id: 'ngu-than-high-remix',
    check: (input) => input.garment === 'ao-ngu-than' && input.remixLevel > 70,
    status: 'yellow',
    reason: {
      what: 'Áo ngũ thân ở mức remix cao',
      why: 'Áo ngũ thân mang tính lễ nghi cao. Remix mạnh có thể làm mất đặc trưng quan trọng của trang phục.',
      howToFix: 'Giảm mức Remix về dưới 70 hoặc giữ các yếu tố cấu trúc chính (5 thân, cài khuy bên phải).',
    },
  },
  // Áo tứ thân without key accessories at traditional level
  {
    id: 'tu-than-missing-accessories',
    check: (input) =>
      input.garment === 'ao-tu-than' &&
      input.remixLevel <= 33 &&
      !input.accessories.includes('khan'),
    status: 'yellow',
    reason: {
      what: 'Áo tứ thân nguyên bản thiếu khăn',
      why: 'Bộ áo tứ thân truyền thống thường đi kèm khăn mỏ quạ. Thiếu phụ kiện này ở mức nguyên bản có thể chưa đầy đủ.',
      howToFix: 'Thêm khăn mỏ quạ vào phụ kiện hoặc tăng mức Remix nếu bạn muốn phối tự do hơn.',
    },
  },
  // Áo tứ thân in Nam Bo region
  {
    id: 'tu-than-nam-bo',
    check: (input) => input.garment === 'ao-tu-than' && input.region === 'nam-bo',
    status: 'yellow',
    reason: {
      what: 'Áo tứ thân ở bối cảnh Nam Bộ',
      why: 'Áo tứ thân thường gắn liền với vùng Bắc Bộ. Sử dụng ở bối cảnh Nam Bộ có thể không phù hợp hoàn toàn về mặt vùng miền.',
      howToFix: 'Chuyển sang vùng Bắc Bộ để phù hợp hơn, hoặc giữ nguyên nếu bạn muốn kết hợp sáng tạo (nên gắn nhãn Remix).',
    },
  },
  // Áo bà ba in Bac Bo region
  {
    id: 'ba-ba-bac-bo',
    check: (input) => input.garment === 'ao-ba-ba' && input.region === 'bac-bo',
    status: 'yellow',
    reason: {
      what: 'Áo bà ba ở bối cảnh Bắc Bộ',
      why: 'Áo bà ba đặc trưng cho vùng Nam Bộ. Phối trong bối cảnh Bắc Bộ cần cân nhắc thêm.',
      howToFix: 'Chuyển sang vùng Nam Bộ để phù hợp hơn, hoặc giữ nguyên nếu bạn muốn kết hợp sáng tạo.',
    },
  },
  // High remix with formal event
  {
    id: 'high-remix-formal-event',
    check: (input) =>
      input.remixLevel > 80 &&
      (input.event === 'le-hoi' || input.event === 'tet'),
    status: 'yellow',
    reason: {
      what: 'Mức remix cao cho dịp trang trọng',
      why: 'Dịp lễ hội, Tết thường có bối cảnh trang trọng. Remix mạnh có thể không phù hợp hoàn toàn với không khí sự kiện.',
      howToFix: 'Giảm mức Remix về 50–70 để cân bằng giữa sáng tạo và phù hợp bối cảnh, hoặc giữ nguyên và ghi nhận đây là phong cách cá nhân.',
    },
  },
  // Streetwear with áo ngũ thân
  {
    id: 'streetwear-ngu-than',
    check: (input) => input.style === 'streetwear' && input.garment === 'ao-ngu-than',
    status: 'yellow',
    reason: {
      what: 'Phong cách Streetwear với Áo ngũ thân',
      why: 'Áo ngũ thân có tính lễ nghi cao. Kết hợp với phong cách đường phố là sáng tạo nhưng cần cân nhắc bối cảnh sử dụng.',
      howToFix: 'Chọn phong cách Cách tân hoặc Tối giản, hoặc giữ nguyên và đánh dấu đây là Remix mạnh.',
    },
  },
  // Sneakers with traditional level
  {
    id: 'sneakers-traditional',
    check: (input) =>
      input.remixLevel <= 33 &&
      input.accessories.includes('giay'),
    status: 'green', // This is fine, footwear compatibility handled by variant selection
    reason: {
      what: 'Giày ở mức nguyên bản',
      why: 'Hệ thống sẽ tự chọn loại giày phù hợp với mức remix bạn chọn.',
      howToFix: '',
    },
  },
  {
    id: 'accessory-outside-catalog-match',
    check: (input) => {
      const hasUnlistedPairing = getSelectedAccessoryVariants(input).some(variant =>
        variant && (
          !variant.compatibleGarments.includes(input.garment) ||
          input.remixLevel < variant.remixRange[0] ||
          input.remixLevel > variant.remixRange[1]
        )
      );
      const hasSpecificRule =
        (input.garment === 'ao-ba-ba' && hasAccessoryVariant(input, 'non-quai-thao') && input.remixLevel <= 33) ||
        (input.garment === 'ao-tu-than' && hasAccessoryVariant(input, 'khan-ran'));
      return hasUnlistedPairing && !hasSpecificRule;
    },
    status: 'yellow',
    reason: {
      what: 'Biến thể phụ kiện ngoài tổ hợp gợi ý',
      why: 'Biến thể này nằm ngoài nhóm áo hoặc mức Remix được catalog hiện tại gợi ý. Đây là tín hiệu cần kiểm tra bối cảnh, không phải kết luận lịch sử.',
      howToFix: 'Chọn biến thể được gợi ý cho trang phục, hoặc giữ lại và ghi rõ đây là thử nghiệm cách tân/Remix.',
    },
  },
  // Áo ngũ thân for casual events
  {
    id: 'ngu-than-casual',
    check: (input) =>
      input.garment === 'ao-ngu-than' &&
      (input.event === 'van-nghe' || input.event === 'di-san') &&
      input.remixLevel <= 33,
    status: 'yellow',
    reason: {
      what: 'Áo ngũ thân nguyên bản ở sự kiện đời thường',
      why: 'Áo ngũ thân nguyên bản thường gắn với dịp lễ nghi trang trọng hơn. Theo nhiều tài liệu, mặc ở sự kiện đời thường có thể không phù hợp hoàn toàn.',
      howToFix: 'Tăng mức Remix lên 40–60 để có phiên bản cách tân phù hợp hơn với bối cảnh.',
    },
  },
  // GOLDEN SCENARIO §68: Áo bà ba + Nón quai thao + Nguyên bản → RED
  // Nón quai thao là phụ kiện đặc trưng Bắc Bộ, không phù hợp với áo bà ba nguyên bản Nam Bộ
  {
    id: 'ba-ba-non-quai-thao-nguyen-ban',
    check: (input) =>
      input.garment === 'ao-ba-ba' &&
      hasAccessoryVariant(input, 'non-quai-thao') &&
      input.remixLevel <= 33,
    status: 'red',
    reason: {
      what: 'Nón quai thao với áo bà ba nguyên bản',
      why: 'Nón quai thao thường được nhắc đến trong bối cảnh trang phục Bắc Bộ (áo tứ thân). Kết hợp với áo bà ba nguyên bản Nam Bộ tạo ra sự kết hợp vùng miền không phù hợp ở mức Nguyên bản. Trang phục vì vậy không thể được gắn nhãn Nguyên bản.',
      howToFix: 'Bỏ nón quai thao và thay bằng nón lá nếu muốn giữ nhãn Nguyên bản. Hoặc tăng mức Remix lên Cách tân / Remix để phối tự do hơn.',
    },
  },
  // GOLDEN SCENARIO §18: Áo tứ thân + Khăn rằn + Nguyên bản → RED; Cách tân / Remix → YELLOW
  // Khăn rằn là phụ kiện đặc trưng Nam Bộ, không kết hợp với áo tứ thân nguyên bản Bắc Bộ
  {
    id: 'tu-than-khan-ran-nguyen-ban',
    check: (input) =>
      input.garment === 'ao-tu-than' &&
      hasAccessoryVariant(input, 'khan-ran') &&
      input.remixLevel <= 33,
    status: 'red',
    reason: {
      what: 'Khăn rằn với áo tứ thân nguyên bản',
      why: 'Khăn rằn là phụ kiện đặc trưng văn hóa Nam Bộ, không xuất hiện cùng áo tứ thân nguyên bản Bắc Bộ. Phối hợp này không thể được gắn nhãn Nguyên bản.',
      howToFix: 'Bỏ khăn rằn hoặc thay bằng khăn mỏ quạ nếu muốn giữ nhãn Nguyên bản. Hoặc tăng mức Remix lên Cách tân / Remix để phối tự do.',
    },
  },
  {
    id: 'tu-than-khan-ran-remix',
    check: (input) =>
      input.garment === 'ao-tu-than' &&
      hasAccessoryVariant(input, 'khan-ran') &&
      input.remixLevel > 33,
    status: 'yellow',
    reason: {
      what: 'Phối khăn rằn Nam Bộ với áo tứ thân',
      why: 'Sự kết hợp giữa khăn rằn Nam Bộ và áo tứ thân Bắc Bộ là một thể nghiệm liên vùng ở mức cách tân / remix.',
      howToFix: 'Gắn nhãn Cách tân hoặc Remix mạnh để thể hiện rõ đây là phối đồ sáng tạo liên vùng.',
    },
  },
];

export function validateCulturalContext(input: ValidationInput): CulturalContextResult {
  const triggeredRules = validationRules.filter(rule => rule.check(input));

  // Determine overall status
  const hasRed = triggeredRules.some(r => r.status === 'red');
  const hasYellow = triggeredRules.some(r => r.status === 'yellow');

  let overallStatus: CulturalStatus = 'green';
  if (hasRed) overallStatus = 'red';
  else if (hasYellow) overallStatus = 'yellow';

  // Build messages
  const reasons = triggeredRules
    .filter(r => r.status !== 'green')
    .map(r => r.reason);

  const suggestions = reasons.map(r => r.howToFix).filter(Boolean);

  let message = '';
  if (overallStatus === 'green') {
    message = 'Phù hợp với bối cảnh đã chọn.';
  } else if (overallStatus === 'yellow') {
    message = 'Có một số điểm bạn có thể cân nhắc.';
  } else {
    message = 'Cách phối này cần cân nhắc thêm về bối cảnh văn hóa.';
  }

  return {
    status: overallStatus,
    message,
    reasons,
    suggestions,
    sources: [], // No sources — all AI-generated context
  };
}
