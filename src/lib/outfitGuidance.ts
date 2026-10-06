import type { CulturalStatus, EventId, Garment, GarmentId, WeatherId } from '../types';
import { events } from '../content/catalog';
import { garments } from '../content/garments';

export const weatherOptions: Array<{ id: WeatherId; label: string; icon: string }> = [
  { id: 'unspecified', label: 'Chưa rõ', icon: '◌' },
  { id: 'hot', label: 'Nóng', icon: '☀' },
  { id: 'rainy', label: 'Mưa', icon: '☂' },
  { id: 'cool', label: 'Mát', icon: '◒' },
  { id: 'cold', label: 'Lạnh', icon: '❄' },
];

const weatherAdvice: Record<WeatherId, string> = {
  unspecified: 'Chọn thời tiết dự kiến để nhận gợi ý tiện nghi; đây không phải dự báo thời tiết trực tiếp.',
  hot: 'Trời nóng: ưu tiên chất liệu thoáng, lớp mặc gọn và phụ kiện nhẹ. Đây là gợi ý tiện nghi, không phải khẳng định chất liệu lịch sử.',
  rainy: 'Trời mưa: cân nhắc lớp che mưa tháo rời, giày bám tốt và cách giữ tà áo khô; không gắn áo mưa vào mô tả trang phục truyền thống.',
  cool: 'Trời mát: có thể thêm lớp khoác mỏng, dễ tháo; giữ áo khoác tách biệt với phần trang phục truyền thống khi mô tả.',
  cold: 'Trời lạnh: thêm lớp giữ nhiệt bên trong và áo khoác ngoài; tránh sửa cổ, khuy hoặc cấu trúc áo gốc chỉ để giữ ấm.',
};

export function getWeatherAdvice(weather: WeatherId | undefined): string {
  return weatherAdvice[weather || 'unspecified'];
}

export function getWeatherLabel(weather: WeatherId | undefined): string {
  return weatherOptions.find(option => option.id === weather)?.label || 'Chưa rõ';
}

export function getSuggestedGarmentsForEvent(eventId: EventId | null): Garment[] {
  const event = events.find(candidate => candidate.id === eventId);
  if (!event) return [];
  return event.suggestedGarments
    .map(garmentId => garments.find(garment => garment.id === garmentId))
    .filter((garment): garment is Garment => Boolean(garment));
}

export function getCulturalPresentationGuidance(
  garmentId: GarmentId,
  status: CulturalStatus,
  remixLevel: number
): string[] {
  const garment = garments.find(candidate => candidate.id === garmentId) || garments[0];
  const guidance = [
    `Nêu rõ tên ${garment.name}, vùng miền và dịp sử dụng; đừng suy rộng một biến thể thành đại diện cho mọi trang phục Việt.`,
    'Ghi chú văn hóa của mục này vẫn là bản nháp; trình bày như thông tin cần đối chiếu, không như kết luận lịch sử đã được chuyên gia xác nhận.',
  ];

  if (remixLevel > 33) {
    guidance.push('Gắn nhãn Cách tân hoặc Remix khi giới thiệu; tránh gọi bản phối này là nguyên bản.');
  }

  if (status === 'red') {
    guidance.push('Có cảnh báo về tổ hợp đang chọn: đổi phụ kiện/bối cảnh hoặc trình bày rõ đây là thử nghiệm đương đại liên vùng.');
  } else if (status === 'yellow') {
    guidance.push('Nêu điểm cần cân nhắc và lý do; để người xem hiểu đây là gợi ý ngữ cảnh, không phải phán quyết đúng/sai.');
  } else {
    guidance.push('Đèn xanh chỉ có nghĩa là chưa kích hoạt quy tắc cảnh báo hiện có; không đồng nghĩa nội dung đã được thẩm định.');
  }

  return guidance;
}