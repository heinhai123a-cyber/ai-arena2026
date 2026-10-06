// ============================================================
// OUTFIT PARTS — Mix-and-match outfit assembly system
// Data extracted from:
//   - nemshop.vn/collections/ao-dai (NEM Fashion)
//   - vanhoavn.blog/trang-phuc-truyen-thong/
//   - trangphucduyenha.com/phu-kien-mac-ao-dai
// ============================================================

import type { GarmentId, EventId } from '../types';

export interface OutfitPart {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  imageUrl?: string;
  colors: string[];
  hexColors: string[];
}

export interface OutfitTop extends OutfitPart {
  garmentType: GarmentId | 'ao-nhat-binh' | 'ao-tac';
  style: 'truyen-thong' | 'cach-tan' | 'remix';
  collarType: string;
  sleeveType: string;
  material: string;
}

export interface OutfitBottom extends OutfitPart {
  type: 'quan-suong' | 'vay-dup' | 'quan-la-toa' | 'quan-dai' | 'vay-dai' | 'jeans' | 'chan-vay';
}

export interface OutfitHeadwear extends OutfitPart {
  type: 'non-la' | 'non-quai-thao' | 'khan-dong' | 'khan-van' | 'khan-mo-qua' | 'man' | 'khan-xep' | 'mu-cach-tan';
}

export interface OutfitFootwear extends OutfitPart {
  type: 'guoc' | 'giay-cao-got' | 'dep-sandal' | 'giay-oxford' | 'sneaker' | 'dep-beo';
}

export interface OutfitAccessory extends OutfitPart {
  type: 'tui' | 'trang-suc' | 'khan' | 'quat' | 'tram' | 'day-chuyen' | 'vong';
}

// ═══════════════════════════════════════════
// TOPS — Áo truyền thống Việt Nam
// ═══════════════════════════════════════════
export const outfitTops: OutfitTop[] = [
  // ── Áo Dài variations (from NEM Fashion + vanhoavn.blog) ──
  {
    id: 'ao-dai-truyen-thong-do',
    name: 'Traditional Red Ao Dai',
    nameVi: 'Áo dài truyền thống đỏ',
    description: 'Áo dài cổ cao truyền thống, chất liệu lụa tơ tằm, họa tiết hoa mai vàng, tay dài. Phom dáng ôm sát tôn đường cong.',
    garmentType: 'ao-dai',
    style: 'truyen-thong',
    collarType: 'Cổ cao đứng',
    sleeveType: 'Tay dài',
    material: 'Lụa tơ tằm',
    colors: ['Đỏ tươi', 'Vàng gold'],
    hexColors: ['#C0392B', '#C5972C'],
  },
  {
    id: 'ao-dai-gam-xanh',
    name: 'Blue Brocade Ao Dai',
    nameVi: 'Áo dài gấm xanh cổ phục',
    description: 'Áo dài gấm xanh ngọc với hoa văn truyền thống dệt nổi, cổ cao cứng, tà dài chạm mắt cá. Phù hợp lễ Tết, cưới hỏi.',
    garmentType: 'ao-dai',
    style: 'truyen-thong',
    collarType: 'Cổ cao cứng',
    sleeveType: 'Tay dài',
    material: 'Gấm dệt',
    colors: ['Xanh ngọc', 'Vàng nhạt'],
    hexColors: ['#1A5276', '#F7DC6F'],
  },
  {
    id: 'ao-dai-cach-tan-pastel',
    name: 'Pastel Modern Ao Dai',
    nameVi: 'Áo dài cách tân pastel',
    description: 'Áo dài cách tân với tông pastel nhẹ nhàng, cổ tròn, tay lỡ. Chất liệu tơ hoa mềm mại, tà ngắn ngang đầu gối. Phối dễ dàng cho đi học, khai giảng.',
    garmentType: 'ao-dai',
    style: 'cach-tan',
    collarType: 'Cổ tròn',
    sleeveType: 'Tay lỡ',
    material: 'Tơ hoa',
    colors: ['Hồng phấn', 'Trắng kem'],
    hexColors: ['#F5B7B1', '#FDEBD0'],
  },
  {
    id: 'ao-dai-cach-tan-trang',
    name: 'White Modern Ao Dai',
    nameVi: 'Áo dài cách tân trắng tinh khôi',
    description: 'Áo dài trắng cách tân, cổ tim, tay ngắn. Chất liệu voan mỏng nhẹ phủ ngoài lớp lót satin. Phù hợp kỷ yếu, tốt nghiệp.',
    garmentType: 'ao-dai',
    style: 'cach-tan',
    collarType: 'Cổ tim',
    sleeveType: 'Tay ngắn',
    material: 'Voan + Satin',
    colors: ['Trắng tinh', 'Kem nhạt'],
    hexColors: ['#FDFEFE', '#F9EBEA'],
  },
  {
    id: 'ao-dai-remix-den',
    name: 'Black Remix Ao Dai',
    nameVi: 'Áo dài remix đen sang trọng',
    description: 'Áo dài phom hiện đại tông đen, xẻ tà cao, cổ cách tân. Phối cùng quần ống đứng hoặc jeans tạo phong cách street-chic.',
    garmentType: 'ao-dai',
    style: 'remix',
    collarType: 'Cổ cách tân chữ V',
    sleeveType: 'Tay dài ôm',
    material: 'Lụa nhân tạo',
    colors: ['Đen', 'Đỏ rượu'],
    hexColors: ['#1A1A2E', '#722F37'],
  },
  {
    id: 'ao-dai-hoa-tiet-viet',
    name: 'Vietnamese Pattern Ao Dai',
    nameVi: 'Áo dài họa tiết Việt',
    description: 'Áo dài in họa tiết trống đồng và hoa văn Đông Sơn, chất liệu lụa Hà Đông, cổ cao, tay raglan.',
    garmentType: 'ao-dai',
    style: 'truyen-thong',
    collarType: 'Cổ cao đứng',
    sleeveType: 'Tay raglan',
    material: 'Lụa Hà Đông',
    colors: ['Vàng đồng', 'Nâu đất'],
    hexColors: ['#D4A843', '#8B6914'],
  },

  // ── Áo Tứ Thân ──
  {
    id: 'ao-tu-than-nau-do',
    name: 'Traditional Ao Tu Than',
    nameVi: 'Áo tứ thân nâu đỏ truyền thống',
    description: 'Áo tứ thân 4 vạt truyền thống Bắc Bộ, nhuộm màu nâu đỏ đặc trưng. Mặc kèm yếm đào, váy đụp đen, thắt lưng lụa xanh.',
    garmentType: 'ao-tu-than',
    style: 'truyen-thong',
    collarType: 'Cổ chéo mở',
    sleeveType: 'Tay dài rộng',
    material: 'Vải the Bắc',
    colors: ['Nâu đỏ', 'Đen'],
    hexColors: ['#8B4513', '#2C1A0F'],
  },
  {
    id: 'ao-tu-than-xanh-lam',
    name: 'Blue Ao Tu Than',
    nameVi: 'Áo tứ thân xanh lam',
    description: 'Áo tứ thân xanh lam, vải lụa mỏng. Thường mặc trong lễ hội Quan Họ, hội Lim. Phối yếm trắng, thắt lưng xanh lá.',
    garmentType: 'ao-tu-than',
    style: 'truyen-thong',
    collarType: 'Cổ chéo',
    sleeveType: 'Tay dài',
    material: 'Lụa mỏng',
    colors: ['Xanh lam', 'Trắng'],
    hexColors: ['#2E86C1', '#FDFEFE'],
  },

  // ── Áo Bà Ba ──
  {
    id: 'ao-ba-ba-den-truyen-thong',
    name: 'Traditional Black Ao Ba Ba',
    nameVi: 'Áo bà ba đen truyền thống',
    description: 'Áo bà ba đen truyền thống miền Nam, phom suông, cài khuy giữa, xẻ hông. Chất liệu vải gai mát, mặc kèm khăn rằn.',
    garmentType: 'ao-ba-ba',
    style: 'truyen-thong',
    collarType: 'Cổ tròn',
    sleeveType: 'Tay ngắn',
    material: 'Vải gai',
    colors: ['Đen', 'Trắng sọc'],
    hexColors: ['#1A1A1A', '#F0E6D3'],
  },
  {
    id: 'ao-ba-ba-hoa-cach-tan',
    name: 'Floral Ao Ba Ba',
    nameVi: 'Áo bà ba hoa cách tân',
    description: 'Áo bà ba cách tân với họa tiết hoa nhỏ, chất liệu cotton mềm. Phom ôm nhẹ, tay lỡ. Phù hợp đi chơi, check-in miền Tây.',
    garmentType: 'ao-ba-ba',
    style: 'cach-tan',
    collarType: 'Cổ tim nhỏ',
    sleeveType: 'Tay lỡ',
    material: 'Cotton',
    colors: ['Xanh pastel', 'Hoa trắng'],
    hexColors: ['#A3D9F5', '#FFFFFF'],
  },

  // ── Áo Ngũ Thân ──
  {
    id: 'ao-ngu-than-nam-xanh',
    name: 'Blue Ao Ngu Than',
    nameVi: 'Áo ngũ thân xanh đen nam',
    description: 'Áo ngũ thân 5 vạt truyền thống, cài cúc bên phải. Chất liệu gấm dày, trang trọng. Mặc kèm quần dài đen, đội khăn đóng.',
    garmentType: 'ao-ngu-than',
    style: 'truyen-thong',
    collarType: 'Cổ đứng cài phải',
    sleeveType: 'Tay rộng',
    material: 'Gấm',
    colors: ['Xanh đen', 'Vàng'],
    hexColors: ['#1B2631', '#F4D03F'],
  },
  {
    id: 'ao-ngu-than-do-le',
    name: 'Ceremonial Red Ao Ngu Than',
    nameVi: 'Áo ngũ thân đỏ lễ nghi',
    description: 'Áo ngũ thân đỏ trang trọng dùng trong nghi lễ, cưới hỏi, Tết cổ truyền. Thêu rồng phượng tinh xảo. Đai lưng vải vàng.',
    garmentType: 'ao-ngu-than',
    style: 'truyen-thong',
    collarType: 'Cổ đứng',
    sleeveType: 'Tay rộng dài',
    material: 'Lụa thêu tay',
    colors: ['Đỏ thắm', 'Vàng kim'],
    hexColors: ['#C0392B', '#DAA520'],
  },
];

// ═══════════════════════════════════════════
// BOTTOMS — Quần / Váy
// ═══════════════════════════════════════════
export const outfitBottoms: OutfitBottom[] = [
  {
    id: 'quan-suong-trang',
    name: 'White Straight Pants',
    nameVi: 'Quần suông trắng',
    description: 'Quần suông trắng lụa, ống rộng vừa, lưng thun. Đi kèm áo dài truyền thống.',
    type: 'quan-suong',
    colors: ['Trắng'],
    hexColors: ['#FDFEFE'],
  },
  {
    id: 'quan-suong-kem',
    name: 'Cream Straight Pants',
    nameVi: 'Quần suông kem',
    description: 'Quần suông kem, chất liệu satin mềm. Tone ấm phối hài hòa với áo dài pastel.',
    type: 'quan-suong',
    colors: ['Kem'],
    hexColors: ['#F5E6D3'],
  },
  {
    id: 'vay-dup-den',
    name: 'Black Vay Dup',
    nameVi: 'Váy đụp đen',
    description: 'Váy đụp đen truyền thống Bắc Bộ, vải the, buộc dây lưng. Mặc kèm áo tứ thân.',
    type: 'vay-dup',
    colors: ['Đen'],
    hexColors: ['#1A1A1A'],
  },
  {
    id: 'quan-la-toa-den',
    name: 'Black La Toa Pants',
    nameVi: 'Quần lá tọa đen',
    description: 'Quần đen rộng truyền thống miền Nam, lưng rộng. Mặc kèm áo bà ba.',
    type: 'quan-la-toa',
    colors: ['Đen'],
    hexColors: ['#1A1A1A'],
  },
  {
    id: 'quan-dai-trang-trong',
    name: 'Formal Dark Pants',
    nameVi: 'Quần dài trang trọng',
    description: 'Quần tây tối trang trọng, phom đứng. Mặc kèm áo ngũ thân.',
    type: 'quan-dai',
    colors: ['Đen sẫm'],
    hexColors: ['#17202A'],
  },
  {
    id: 'chan-vay-midi',
    name: 'Midi Skirt',
    nameVi: 'Chân váy midi',
    description: 'Chân váy midi phom xòe nhẹ, chất liệu voan. Phối cùng áo dài cách tân tạo nét hiện đại.',
    type: 'chan-vay',
    colors: ['Kem', 'Pastel'],
    hexColors: ['#FDEBD0', '#E8D5E0'],
  },
  {
    id: 'jeans-xanh',
    name: 'Blue Jeans',
    nameVi: 'Quần jeans xanh',
    description: 'Quần jeans ống đứng wash nhẹ, phối remix cùng áo dài cho phong cách street-chic.',
    type: 'jeans',
    colors: ['Xanh jeans'],
    hexColors: ['#2E86C1'],
  },
];

// ═══════════════════════════════════════════
// HEADWEAR — Khăn / Nón
// ═══════════════════════════════════════════
export const outfitHeadwear: OutfitHeadwear[] = [
  {
    id: 'non-la-truyen-thong',
    name: 'Traditional Non La',
    nameVi: 'Nón lá truyền thống',
    description: 'Nón lá Việt Nam, đan thủ công từ lá cọ. Biểu tượng văn hóa đặc trưng, che nắng mưa.',
    type: 'non-la',
    colors: ['Nâu nhạt tự nhiên'],
    hexColors: ['#D9C18E'],
  },
  {
    id: 'non-quai-thao-bac-bo',
    name: 'Quai Thao Hat',
    nameVi: 'Nón quai thao Bắc Bộ',
    description: 'Nón quai thao truyền thống miền Bắc, quai lụa dài. Phụ kiện đặc trưng mặc cùng áo tứ thân trong lễ hội, hát Quan Họ.',
    type: 'non-quai-thao',
    colors: ['Nâu', 'Vàng lụa'],
    hexColors: ['#60402D', '#C9A66B'],
  },
  {
    id: 'khan-dong-nam',
    name: 'Men Head Wrap',
    nameVi: 'Khăn đóng nam',
    description: 'Khăn đóng đen truyền thống dành cho nam, vấn đầu trang trọng. Đi kèm áo ngũ thân.',
    type: 'khan-dong',
    colors: ['Đen'],
    hexColors: ['#1A1A1A'],
  },
  {
    id: 'khan-van-nu',
    name: 'Women Head Scarf',
    nameVi: 'Khăn vấn tóc nữ',
    description: 'Khăn vấn nhung đen, dùng búi tóc truyền thống phụ nữ miền Bắc.',
    type: 'khan-van',
    colors: ['Đen nhung'],
    hexColors: ['#2C2C2C'],
  },
  {
    id: 'khan-mo-qua',
    name: 'Mo Qua Headscarf',
    nameVi: 'Khăn mỏ quạ',
    description: 'Khăn mỏ quạ Bắc Bộ, đội đầu đặc trưng. Phối cùng áo tứ thân trong hội làng.',
    type: 'khan-mo-qua',
    colors: ['Đen'],
    hexColors: ['#1D1A19'],
  },
  {
    id: 'man-co-trang',
    name: 'Bridal Man Headpiece',
    nameVi: 'Mấn cô dâu / lễ phục',
    description: 'Mấn đính kim sa, hạt cườm. Phụ kiện sang trọng kết hợp áo dài trong cưới hỏi, sự kiện trang trọng.',
    type: 'man',
    colors: ['Vàng kim', 'Đỏ thắm'],
    hexColors: ['#DAA520', '#C0392B'],
  },
  {
    id: 'khan-xep-nam',
    name: 'Men Folded Turban',
    nameVi: 'Khăn xếp nam',
    description: 'Khăn xếp đen truyền thống nam, vấn đầu trong dịp lễ trang trọng. Thể hiện sự chỉn chu.',
    type: 'khan-xep',
    colors: ['Đen'],
    hexColors: ['#1A1A1A'],
  },
];

// ═══════════════════════════════════════════
// FOOTWEAR — Giày dép
// ═══════════════════════════════════════════
export const outfitFootwear: OutfitFootwear[] = [
  {
    id: 'guoc-go-truyen-thong',
    name: 'Traditional Wooden Clogs',
    nameVi: 'Guốc gỗ truyền thống',
    description: 'Guốc gỗ sơn mài, quai ngang, trạm trổ hoa văn. Phụ kiện đặc trưng phối áo dài, áo tứ thân.',
    type: 'guoc',
    colors: ['Nâu gỗ', 'Đỏ sơn mài'],
    hexColors: ['#9A7149', '#8B1A1A'],
  },
  {
    id: 'giay-cao-got-thanh-lich',
    name: 'Elegant High Heels',
    nameVi: 'Giày cao gót thanh lịch',
    description: 'Giày cao gót mũi nhọn, gót 5-7cm. Phối cùng áo dài cách tân tạo dáng thanh thoát.',
    type: 'giay-cao-got',
    colors: ['Nude', 'Đen'],
    hexColors: ['#D5B895', '#1A1A1A'],
  },
  {
    id: 'dep-sandal-nhe-nhang',
    name: 'Light Sandals',
    nameVi: 'Dép sandal nhẹ nhàng',
    description: 'Sandal quai ngang thanh mảnh, đế bệt hoặc xuồng thấp. Thoải mái cho các dịp bán trang trọng.',
    type: 'dep-sandal',
    colors: ['Nâu', 'Kem'],
    hexColors: ['#8B7355', '#F5E6D3'],
  },
  {
    id: 'sneaker-trang-doi-moi',
    name: 'White Sneakers',
    nameVi: 'Sneaker trắng đổi mới',
    description: 'Sneaker trắng sạch sẽ, phối cùng áo dài remix hoặc áo bà ba cách tân tạo phong cách trẻ trung.',
    type: 'sneaker',
    colors: ['Trắng'],
    hexColors: ['#F4F0E8'],
  },
  {
    id: 'dep-beo-mien-nam',
    name: 'Southern Rubber Sandals',
    nameVi: 'Dép bèo miền Nam',
    description: 'Dép nhựa bèo đặc trưng miền Nam, thoải mái, dân dã. Phối cùng áo bà ba.',
    type: 'dep-beo',
    colors: ['Đen', 'Nâu'],
    hexColors: ['#3D3D3D', '#8B7355'],
  },
];

// ═══════════════════════════════════════════
// ACCESSORIES — Phụ kiện
// ═══════════════════════════════════════════
export const outfitAccessories: OutfitAccessory[] = [
  {
    id: 'khan-ran-nam-bo',
    name: 'Southern Checkered Scarf',
    nameVi: 'Khăn rằn Nam Bộ',
    description: 'Khăn rằn sọc ca-rô đen trắng, biểu tượng miền Nam. Vắt vai, quàng cổ, hoặc buộc đầu.',
    type: 'khan',
    colors: ['Đen', 'Trắng'],
    hexColors: ['#1A1A1A', '#F0E6D3'],
  },
  {
    id: 'khan-lua-choang-co',
    name: 'Silk Neck Scarf',
    nameVi: 'Khăn lụa choàng cổ',
    description: 'Khăn lụa mỏng, choàng nhẹ qua cổ hoặc vai. Tạo điểm nhấn thanh lịch cho áo dài.',
    type: 'khan',
    colors: ['Hồng pastel', 'Vàng nhạt'],
    hexColors: ['#F5B7B1', '#F7DC6F'],
  },
  {
    id: 'tui-theu-tay',
    name: 'Hand-embroidered Bag',
    nameVi: 'Túi thêu tay nhỏ',
    description: 'Túi thêu hoa sen thủ công, nhỏ gọn. Phụ kiện truyền thống phối áo dài, áo tứ thân.',
    type: 'tui',
    colors: ['Đỏ', 'Vàng'],
    hexColors: ['#C0392B', '#C5972C'],
  },
  {
    id: 'clutch-hien-dai',
    name: 'Modern Clutch',
    nameVi: 'Clutch nhỏ hiện đại',
    description: 'Ví cầm tay nhỏ, chất liệu da hoặc satin. Phối cùng áo dài cách tân trong sự kiện.',
    type: 'tui',
    colors: ['Vàng gold', 'Đen'],
    hexColors: ['#DAA520', '#1A1A1A'],
  },
  {
    id: 'tram-cai-toc-truyen-thong',
    name: 'Traditional Hair Pin',
    nameVi: 'Trâm cài tóc truyền thống',
    description: 'Trâm cài bạc hoặc vàng, hình hoa sen, phượng hoàng. Búi tóc truyền thống.',
    type: 'tram',
    colors: ['Vàng cổ', 'Bạc'],
    hexColors: ['#C5972C', '#BDC3C7'],
  },
  {
    id: 'vong-ngoc-tay',
    name: 'Jade Bracelet',
    nameVi: 'Vòng ngọc cẩm thạch',
    description: 'Vòng tay ngọc cẩm thạch xanh, trang sức truyền thống Việt Nam. Mang ý nghĩa may mắn, bình an.',
    type: 'vong',
    colors: ['Xanh ngọc'],
    hexColors: ['#2D6B4F'],
  },
  {
    id: 'day-chuyen-bac',
    name: 'Silver Necklace',
    nameVi: 'Dây chuyền bạc mảnh',
    description: 'Dây chuyền bạc mảnh, mặt hình hoa sen hoặc chữ Phúc. Điểm nhấn tinh tế khi mặc áo dài.',
    type: 'day-chuyen',
    colors: ['Bạc'],
    hexColors: ['#BDC3C7'],
  },
  {
    id: 'quat-lua-trang-tri',
    name: 'Decorative Silk Fan',
    nameVi: 'Quạt lụa trang trí',
    description: 'Quạt lụa vẽ hoa, cảnh sơn thủy. Phụ kiện đặc trưng trong biểu diễn văn nghệ, chụp ảnh nghệ thuật.',
    type: 'quat',
    colors: ['Đỏ', 'Trắng'],
    hexColors: ['#C0392B', '#FDFEFE'],
  },
  {
    id: 'bong-tai-ngoc-trai',
    name: 'Pearl Earrings',
    nameVi: 'Bông tai ngọc trai',
    description: 'Bông tai ngọc trai nước ngọt, kiểu dáng cổ điển. Tôn vẻ đẹp thanh lịch khi mặc áo dài.',
    type: 'trang-suc',
    colors: ['Trắng ngọc trai'],
    hexColors: ['#FDF2E9'],
  },
];

// ═══════════════════════════════════════════
// OCCASION-BASED OUTFIT RULES
// Quy tắc phối đồ theo dịp
// ═══════════════════════════════════════════
export interface OccasionRule {
  eventId: EventId;
  name: string;
  icon: string;
  description: string;
  validTops: string[];
  validBottoms: string[];
  validHeadwear: string[];
  validFootwear: string[];
  validAccessories: string[];
  mustHaveAccessories: string[]; // phải có ít nhất 1
  colorMood: string;
}

export const occasionRules: OccasionRule[] = [
  {
    eventId: 'tet',
    name: 'Tết Nguyên Đán / Họp mặt gia đình',
    icon: '🧧',
    description: 'Dịp trang trọng nhất trong năm. Ưu tiên tông đỏ, vàng, hồng — tượng trưng may mắn, phú quý.',
    validTops: ['ao-dai-truyen-thong-do', 'ao-dai-gam-xanh', 'ao-dai-hoa-tiet-viet', 'ao-ngu-than-do-le', 'ao-ngu-than-nam-xanh', 'ao-ba-ba-hoa-cach-tan'],
    validBottoms: ['quan-suong-trang', 'quan-suong-kem', 'quan-dai-trang-trong', 'quan-la-toa-den'],
    validHeadwear: ['khan-dong-nam', 'khan-xep-nam', 'man-co-trang'],
    validFootwear: ['guoc-go-truyen-thong', 'giay-cao-got-thanh-lich'],
    validAccessories: ['khan-lua-choang-co', 'tui-theu-tay', 'vong-ngoc-tay', 'bong-tai-ngoc-trai', 'tram-cai-toc-truyen-thong', 'day-chuyen-bac'],
    mustHaveAccessories: ['trang-suc'],
    colorMood: 'Đỏ · Vàng · Hồng — May mắn & Phú quý',
  },
  {
    eventId: 'khai-giang',
    name: 'Khai giảng / Sự kiện học đường',
    icon: '🎓',
    description: 'Trang trọng nhưng trẻ trung, thanh lịch. Ưu tiên áo dài trắng hoặc pastel nhẹ nhàng.',
    validTops: ['ao-dai-cach-tan-trang', 'ao-dai-cach-tan-pastel', 'ao-dai-truyen-thong-do'],
    validBottoms: ['quan-suong-trang', 'quan-suong-kem'],
    validHeadwear: [],
    validFootwear: ['giay-cao-got-thanh-lich', 'dep-sandal-nhe-nhang'],
    validAccessories: ['bong-tai-ngoc-trai', 'day-chuyen-bac', 'clutch-hien-dai'],
    mustHaveAccessories: [],
    colorMood: 'Trắng · Pastel · Kem — Tinh khôi & Thanh lịch',
  },
  {
    eventId: 'ky-yeu',
    name: 'Kỷ yếu / Tốt nghiệp',
    icon: '📸',
    description: 'Cá tính, đáng nhớ, nổi bật. Cho phép sáng tạo, phối tự do hơn.',
    validTops: ['ao-dai-cach-tan-trang', 'ao-dai-cach-tan-pastel', 'ao-dai-remix-den', 'ao-ba-ba-hoa-cach-tan', 'ao-tu-than-xanh-lam'],
    validBottoms: ['quan-suong-trang', 'quan-suong-kem', 'chan-vay-midi', 'jeans-xanh', 'vay-dup-den'],
    validHeadwear: ['non-la-truyen-thong'],
    validFootwear: ['giay-cao-got-thanh-lich', 'sneaker-trang-doi-moi', 'dep-sandal-nhe-nhang'],
    validAccessories: ['khan-lua-choang-co', 'clutch-hien-dai', 'bong-tai-ngoc-trai', 'quat-lua-trang-tri', 'vong-ngoc-tay'],
    mustHaveAccessories: [],
    colorMood: 'Tự do · Pastel · Remix — Sáng tạo & Cá tính',
  },
  {
    eventId: 'le-hoi',
    name: 'Lễ hội / Đình chùa',
    icon: '🏮',
    description: 'Tôn trọng không gian tâm linh, trang phục truyền thống, kín đáo. Ưu tiên tông ấm, chất liệu tự nhiên.',
    validTops: ['ao-dai-truyen-thong-do', 'ao-dai-gam-xanh', 'ao-tu-than-nau-do', 'ao-tu-than-xanh-lam', 'ao-ngu-than-do-le', 'ao-ngu-than-nam-xanh', 'ao-dai-hoa-tiet-viet'],
    validBottoms: ['quan-suong-trang', 'vay-dup-den', 'quan-dai-trang-trong'],
    validHeadwear: ['non-la-truyen-thong', 'non-quai-thao-bac-bo', 'khan-mo-qua', 'khan-dong-nam', 'khan-xep-nam'],
    validFootwear: ['guoc-go-truyen-thong', 'dep-sandal-nhe-nhang'],
    validAccessories: ['khan-lua-choang-co', 'tui-theu-tay', 'quat-lua-trang-tri', 'vong-ngoc-tay', 'tram-cai-toc-truyen-thong'],
    mustHaveAccessories: [],
    colorMood: 'Đỏ · Nâu · Xanh đậm — Truyền thống & Tâm linh',
  },
  {
    eventId: 'di-san',
    name: 'Check-in di sản / Phố cổ',
    icon: '🏛️',
    description: 'Hòa hợp với không gian lịch sử. Phối linh hoạt, có thể truyền thống hoặc cách tân.',
    validTops: ['ao-dai-truyen-thong-do', 'ao-dai-cach-tan-pastel', 'ao-dai-hoa-tiet-viet', 'ao-tu-than-nau-do', 'ao-ba-ba-den-truyen-thong', 'ao-ba-ba-hoa-cach-tan', 'ao-ngu-than-nam-xanh'],
    validBottoms: ['quan-suong-trang', 'quan-suong-kem', 'vay-dup-den', 'quan-la-toa-den', 'chan-vay-midi'],
    validHeadwear: ['non-la-truyen-thong', 'non-quai-thao-bac-bo', 'khan-mo-qua'],
    validFootwear: ['guoc-go-truyen-thong', 'dep-sandal-nhe-nhang', 'sneaker-trang-doi-moi'],
    validAccessories: ['khan-ran-nam-bo', 'khan-lua-choang-co', 'tui-theu-tay', 'quat-lua-trang-tri', 'vong-ngoc-tay'],
    mustHaveAccessories: [],
    colorMood: 'Tông đất · Nâu · Kem — Hoài cổ & Hài hòa',
  },
  {
    eventId: 'van-nghe',
    name: 'Văn nghệ / Biểu diễn CLB',
    icon: '🎭',
    description: 'Tự do sáng tạo, nhiều biến tấu. Ưu tiên phục trang sặc sỡ, ấn tượng sân khấu.',
    validTops: ['ao-dai-truyen-thong-do', 'ao-dai-cach-tan-pastel', 'ao-dai-remix-den', 'ao-tu-than-xanh-lam', 'ao-tu-than-nau-do', 'ao-ba-ba-hoa-cach-tan', 'ao-dai-hoa-tiet-viet'],
    validBottoms: ['quan-suong-trang', 'quan-suong-kem', 'vay-dup-den', 'chan-vay-midi', 'quan-la-toa-den'],
    validHeadwear: ['non-la-truyen-thong', 'non-quai-thao-bac-bo', 'khan-mo-qua', 'man-co-trang'],
    validFootwear: ['guoc-go-truyen-thong', 'giay-cao-got-thanh-lich', 'dep-sandal-nhe-nhang'],
    validAccessories: ['khan-lua-choang-co', 'tui-theu-tay', 'quat-lua-trang-tri', 'tram-cai-toc-truyen-thong', 'vong-ngoc-tay', 'bong-tai-ngoc-trai'],
    mustHaveAccessories: [],
    colorMood: 'Đa sắc · Rực rỡ — Sân khấu & Ấn tượng',
  },
];

// ═══════════════════════════════════════════
// RANDOM OUTFIT GENERATOR
// Sinh ngẫu nhiên bộ trang phục hợp lí theo dịp
// ═══════════════════════════════════════════
export interface GeneratedOutfitSet {
  occasion: OccasionRule;
  top: OutfitTop;
  bottom: OutfitBottom;
  headwear: OutfitHeadwear | null;
  footwear: OutfitFootwear;
  accessories: OutfitAccessory[];
  colorMood: string;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomOutfitForOccasion(eventId?: EventId): GeneratedOutfitSet {
  const rule = eventId
    ? occasionRules.find(r => r.eventId === eventId) || pickRandom(occasionRules)
    : pickRandom(occasionRules);

  const top = pickRandom(rule.validTops.map(id => outfitTops.find(t => t.id === id)).filter(Boolean) as OutfitTop[]);
  const bottom = pickRandom(rule.validBottoms.map(id => outfitBottoms.find(b => b.id === id)).filter(Boolean) as OutfitBottom[]);
  const headwear = rule.validHeadwear.length > 0
    ? (Math.random() > 0.3 ? pickRandom(rule.validHeadwear.map(id => outfitHeadwear.find(h => h.id === id)).filter(Boolean) as OutfitHeadwear[]) : null)
    : null;
  const footwear = pickRandom(rule.validFootwear.map(id => outfitFootwear.find(f => f.id === id)).filter(Boolean) as OutfitFootwear[]);

  // Pick 2-3 random accessories
  const availableAccessories = rule.validAccessories
    .map(id => outfitAccessories.find(a => a.id === id))
    .filter(Boolean) as OutfitAccessory[];
  const numAccessories = Math.min(availableAccessories.length, 2 + Math.floor(Math.random() * 2));
  const shuffled = [...availableAccessories].sort(() => Math.random() - 0.5);
  const selectedAccessories = shuffled.slice(0, numAccessories);

  return {
    occasion: rule,
    top,
    bottom,
    headwear,
    footwear,
    accessories: selectedAccessories,
    colorMood: rule.colorMood,
  };
}

export function generateRandomOutfitAll(): GeneratedOutfitSet {
  return generateRandomOutfitForOccasion();
}
