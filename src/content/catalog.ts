import type { VietEvent, Region, Style, ColorOption, Accessory } from '../types';

export const events: VietEvent[] = [
  {
    id: 'khai-giang',
    name: 'Khai giảng',
    description: 'Lễ khai giảng năm học mới — dịp trang trọng nhưng trẻ trung, thường vào đầu tháng 9.',
    icon: '🎓',
    suggestedGarments: ['ao-dai', 'ao-ngu-than'],
    season: 'Thu',
  },
  {
    id: 'ky-yeu',
    name: 'Kỷ yếu / Tốt nghiệp',
    description: 'Chụp ảnh kỷ yếu, lễ tốt nghiệp — dịp đáng nhớ, thường muốn nổi bật và cá tính.',
    icon: '📸',
    suggestedGarments: ['ao-dai', 'ao-tu-than', 'ao-ba-ba'],
  },
  {
    id: 'tet',
    name: 'Tết / Họp mặt gia đình',
    description: 'Tết Nguyên đán, họp mặt gia đình — dịp quan trọng nhất, trang trọng nhưng ấm cúng.',
    icon: '🧧',
    suggestedGarments: ['ao-dai', 'ao-ngu-than', 'ao-ba-ba'],
    season: 'Xuân',
  },
  {
    id: 'le-hoi',
    name: 'Lễ hội / Đình chùa',
    description: 'Tham dự lễ hội truyền thống, viếng đình chùa — cần phù hợp không gian tâm linh.',
    icon: '🏮',
    suggestedGarments: ['ao-dai', 'ao-ngu-than', 'ao-tu-than'],
  },
  {
    id: 'di-san',
    name: 'Check-in di sản',
    description: 'Tham quan di tích, bảo tàng, phố cổ — muốn hòa hợp với không gian lịch sử.',
    icon: '🏛️',
    suggestedGarments: ['ao-dai', 'ao-ngu-than', 'ao-tu-than', 'ao-ba-ba'],
  },
  {
    id: 'van-nghe',
    name: 'Văn nghệ / CLB',
    description: 'Biểu diễn văn nghệ, hoạt động câu lạc bộ — dịp sáng tạo, cho phép nhiều biến tấu.',
    icon: '🎭',
    suggestedGarments: ['ao-dai', 'ao-tu-than', 'ao-ba-ba'],
  },
];

export const regions: Region[] = [
  {
    id: 'bac-bo',
    name: 'Bắc Bộ',
    description: 'Vùng đồng bằng sông Hồng và phía Bắc — trang phục thường trang trọng, nhiều lớp, gắn với lễ nghi.',
    suggestedGarments: ['ao-dai', 'ao-ngu-than', 'ao-tu-than'],
  },
  {
    id: 'trung-bo',
    name: 'Trung Bộ — Huế',
    description: 'Miền Trung, đặc biệt Huế — trang phục mang ảnh hưởng cung đình, tinh tế, trang nhã.',
    suggestedGarments: ['ao-dai', 'ao-ngu-than'],
  },
  {
    id: 'nam-bo',
    name: 'Nam Bộ',
    description: 'Miền Nam — trang phục thường đơn giản, thoải mái, phản ánh lối sống cởi mở.',
    suggestedGarments: ['ao-dai', 'ao-ba-ba'],
  },
];

export const styles: Style[] = [
  {
    id: 'thanh-lich',
    name: 'Thanh lịch',
    description: 'Trang nhã, tinh tế, phù hợp dịp trang trọng.',
    keywords: ['elegant', 'refined', 'classic', 'polished'],
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    description: 'Phong cách đường phố, năng động, pha trộn hiện đại.',
    keywords: ['urban', 'bold', 'casual', 'edgy'],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Hoài cổ, lãng mạn, lấy cảm hứng từ những thập niên trước.',
    keywords: ['retro', 'nostalgic', 'romantic', 'classic'],
  },
  {
    id: 'toi-gian',
    name: 'Tối giản',
    description: 'Ít chi tiết, tập trung vào form dáng và chất liệu, hiện đại.',
    keywords: ['minimal', 'clean', 'modern', 'simple'],
  },
];

export const colorOptions: ColorOption[] = [
  { id: 'ivory', name: 'Ivory', hex: '#FFFFF0', description: 'Trắng ngà — thanh lịch, tinh khôi' },
  { id: 'burgundy', name: 'Burgundy', hex: '#722F37', description: 'Đỏ rượu — sang trọng, sâu lắng' },
  { id: 'navy', name: 'Navy', hex: '#1B2A4A', description: 'Xanh navy — chững chạc, hiện đại' },
  { id: 'cream', name: 'Cream', hex: '#F5E6D3', description: 'Kem — ấm áp, mềm mại' },
  { id: 'earth-tone', name: 'Earth tone', hex: '#8B7355', description: 'Tông đất — tự nhiên, ấm' },
  { id: 'pastel', name: 'Pastel', hex: '#E8D5E0', description: 'Pastel — nhẹ nhàng, trẻ trung' },
  { id: 'black', name: 'Black', hex: '#1A1A1A', description: 'Đen — mạnh mẽ, cá tính' },
];

export const accessories: Accessory[] = [
  {
    id: 'khan',
    name: 'Khăn',
    category: 'Phụ kiện đầu / cổ',
    variants: [
      { id: 'khan-mo-qua', name: 'Khăn mỏ quạ', description: 'Khăn đội đầu truyền thống Bắc Bộ', compatibleGarments: ['ao-tu-than'], remixRange: [0, 50] },
      { id: 'khan-ran', name: 'Khăn rằn', description: 'Khăn kẻ đặc trưng miền Nam', compatibleGarments: ['ao-ba-ba'], remixRange: [0, 80] },
      { id: 'khan-lua', name: 'Khăn lụa', description: 'Khăn lụa mỏng, đa năng', compatibleGarments: ['ao-dai', 'ao-ngu-than'], remixRange: [0, 100] },
    ],
  },
  {
    id: 'non',
    name: 'Nón',
    category: 'Phụ kiện đầu',
    variants: [
      { id: 'non-quai-thao', name: 'Nón quai thao', description: 'Nón truyền thống Bắc Bộ', compatibleGarments: ['ao-tu-than', 'ao-dai'], remixRange: [0, 40] },
      { id: 'non-la', name: 'Nón lá', description: 'Nón lá Việt Nam', compatibleGarments: ['ao-dai', 'ao-ba-ba', 'ao-tu-than'], remixRange: [0, 70] },
      { id: 'mu-beret', name: 'Mũ beret', description: 'Mũ beret phong cách Pháp-Việt', compatibleGarments: ['ao-dai', 'ao-ba-ba'], remixRange: [50, 100] },
    ],
  },
  {
    id: 'tui',
    name: 'Túi',
    category: 'Phụ kiện tay',
    variants: [
      { id: 'tui-theu', name: 'Túi thêu', description: 'Túi nhỏ thêu tay truyền thống', compatibleGarments: ['ao-dai', 'ao-tu-than', 'ao-ngu-than'], remixRange: [0, 60] },
      { id: 'tui-xach-nho', name: 'Túi xách nhỏ', description: 'Clutch hoặc túi xách nhỏ hiện đại', compatibleGarments: ['ao-dai', 'ao-ba-ba'], remixRange: [30, 100] },
      { id: 'tui-vai', name: 'Túi vải', description: 'Tote bag chất liệu tự nhiên', compatibleGarments: ['ao-ba-ba', 'ao-dai'], remixRange: [40, 100] },
    ],
  },
  {
    id: 'giay',
    name: 'Giày',
    category: 'Giày dép',
    variants: [
      { id: 'guoc', name: 'Guốc', description: 'Guốc gỗ truyền thống', compatibleGarments: ['ao-dai', 'ao-tu-than', 'ao-ba-ba'], remixRange: [0, 40] },
      { id: 'dep-co', name: 'Dép cổ điển', description: 'Dép quai ngang đơn giản', compatibleGarments: ['ao-ba-ba', 'ao-dai'], remixRange: [0, 60] },
      { id: 'giay-cao-got', name: 'Giày cao gót', description: 'Giày cao gót thanh lịch', compatibleGarments: ['ao-dai', 'ao-ngu-than'], remixRange: [30, 100] },
      { id: 'sneaker', name: 'Sneaker', description: 'Giày thể thao hiện đại', compatibleGarments: ['ao-dai', 'ao-ba-ba'], remixRange: [60, 100] },
    ],
  },
  {
    id: 'trang-suc',
    name: 'Trang sức',
    category: 'Trang sức',
    variants: [
      { id: 'vong-ngoc', name: 'Vòng ngọc', description: 'Vòng tay ngọc truyền thống', compatibleGarments: ['ao-dai', 'ao-ngu-than', 'ao-tu-than', 'ao-ba-ba'], remixRange: [0, 70] },
      { id: 'bong-tai-don-gian', name: 'Bông tai đơn giản', description: 'Bông tai nhỏ, tinh tế', compatibleGarments: ['ao-dai', 'ao-ngu-than', 'ao-tu-than', 'ao-ba-ba'], remixRange: [0, 100] },
      { id: 'day-chuyen', name: 'Dây chuyền', description: 'Dây chuyền mảnh, thanh lịch', compatibleGarments: ['ao-dai', 'ao-ba-ba'], remixRange: [20, 100] },
    ],
  },
  {
    id: 'quat',
    name: 'Quạt',
    category: 'Phụ kiện tay',
    variants: [
      { id: 'quat-giay', name: 'Quạt giấy', description: 'Quạt giấy truyền thống', compatibleGarments: ['ao-dai', 'ao-tu-than', 'ao-ngu-than'], remixRange: [0, 50] },
      { id: 'quat-lua', name: 'Quạt lụa', description: 'Quạt lụa trang trí', compatibleGarments: ['ao-dai', 'ao-tu-than', 'ao-ngu-than'], remixRange: [0, 60] },
    ],
  },
  {
    id: 'phu-kien-toc',
    name: 'Phụ kiện tóc',
    category: 'Phụ kiện tóc',
    variants: [
      { id: 'tram-cai', name: 'Trâm cài', description: 'Trâm cài tóc truyền thống', compatibleGarments: ['ao-dai', 'ao-tu-than', 'ao-ngu-than'], remixRange: [0, 60] },
      { id: 'kep-toc-hoa', name: 'Kẹp tóc hoa', description: 'Kẹp tóc trang trí hoa', compatibleGarments: ['ao-dai', 'ao-tu-than', 'ao-ba-ba'], remixRange: [0, 80] },
      { id: 'bang-do', name: 'Băng đô', description: 'Băng đô đơn giản', compatibleGarments: ['ao-dai', 'ao-ba-ba'], remixRange: [30, 100] },
    ],
  },
];

export const getEvent = (id: string) => events.find(e => e.id === id);
export const getRegion = (id: string) => regions.find(r => r.id === id);
export const getStyle = (id: string) => styles.find(s => s.id === id);
export const getColor = (id: string) => colorOptions.find(c => c.id === id);
export const getAccessory = (id: string) => accessories.find(a => a.id === id);
