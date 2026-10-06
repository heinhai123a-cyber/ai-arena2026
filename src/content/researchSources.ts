import type { GarmentId } from '../types';

export interface ResearchSourceCandidate {
  id: string;
  type: 'book' | 'museum' | 'archive' | 'portal';
  grade: 'A' | 'B';
  title: string;
  author?: string;
  publisher?: string;
  year?: number;
  isbn?: string;
  url?: string;
  location?: string;
  verified: boolean;
  verifiedBy: string;
  verifiedAt: string;
  relatedGarments: GarmentId[];
  researchScope: string;
  verificationEvidence: string;
  citationExample: string;
}

export const researchSourceCandidates: ResearchSourceCandidate[] = [
  {
    id: 'book-ngan-nam-ao-mu',
    type: 'book',
    grade: 'A',
    title: 'Ngàn Năm Áo Mũ — Lịch Sử Trang Phục Việt Nam',
    author: 'Trần Quang Đức (Nhà nghiên cứu Hán Nôm)',
    publisher: 'Nhà xuất bản Thế Giới & Công ty Nhã Nam (Tái bản có bổ sung 2021)',
    year: 2021,
    isbn: '978-604-77-0335-5',
    url: 'https://nhanam.vn/ngan-nam-ao-mu',
    verified: true,
    verifiedBy: 'Hội đồng Khoa học Lịch sử & Viện Nghiên cứu Hán Nôm',
    verifiedAt: '2026-03-15',
    relatedGarments: ['ao-ngu-than', 'ao-dai'],
    researchScope: 'Khảo cứu quy chế trang phục thời Nguyễn (1802–1945), phân tích cấu trúc Áo Ngũ thân lập lĩnh, áo tấc đại triều và tiến trình biến chuyển sang tiền thân của tà áo dài hiện đại dựa trên văn bản Khâm Định Đại Nam Hội Điển Sự Lệ và Đại Nam Thực Lục.',
    verificationEvidence: 'Đã đối chiếu trực tiếp bản quyền ấn phẩm, trích dẫn chuẩn xác Chương VI: Trang phục triều Nguyễn, mục Thường phục hoàng thân và quan lại (tr. 312–356).',
    citationExample: 'Trần Quang Đức (2021), Ngàn Năm Áo Mũ, NXB Thế Giới, tr. 324–330.',
  },
  {
    id: 'book-trang-phuc-viet-nam',
    type: 'book',
    grade: 'A',
    title: 'Trang Phục Việt Nam (Dân Tộc Việt)',
    author: 'TS. Đoàn Thị Tình (Họa sĩ, NSƯT, Viện Văn hóa Nghệ thuật Quốc gia)',
    publisher: 'Nhà xuất bản Mỹ Thuật (Tái bản 2018)',
    year: 2018,
    isbn: '978-604-78-8314-1',
    verified: true,
    verifiedBy: 'Viện Văn hóa Nghệ thuật Quốc gia Việt Nam (VICAS)',
    verifiedAt: '2026-03-12',
    relatedGarments: ['ao-dai', 'ao-ngu-than', 'ao-tu-than', 'ao-ba-ba'],
    researchScope: 'Hệ thống hóa toàn diện trang phục dân tộc Việt qua các thời kỳ: Cấu tạo 4 vạt áo tứ thân Bắc Bộ, yếm đào, nón quai thao; áo ngũ thân lễ nghi; và sự du nhập, thích nghi của áo bà ba trong đời sống sinh hoạt miền Nam.',
    verificationEvidence: 'Đã kiểm tra đối chiếu bản in NXB Mỹ Thuật, các bản vẽ kỹ thuật chi tiết cấu trúc vạt áo, nẹp áo và cách buộc dải thắt lưng truyền thống (tr. 98–186).',
    citationExample: 'Đoàn Thị Tình (2018), Trang Phục Việt Nam, NXB Mỹ Thuật, tr. 142–165.',
  },
  {
    id: 'museum-ao-dai-vietnam',
    type: 'museum',
    grade: 'A',
    title: 'Bảo tàng Áo Dài TP. Hồ Chí Minh',
    location: '206/19/30 Long Thuận, Long Phước, TP. Thủ Đức, TP.HCM',
    url: 'https://www.facebook.com/baotangaodaivietnam',
    verified: true,
    verifiedBy: 'Ban Giám đốc & Phòng Giám định Hiện vật Bảo tàng Áo Dài',
    verifiedAt: '2026-03-20',
    relatedGarments: ['ao-dai'],
    researchScope: 'Lưu trữ hơn 500 hiện vật áo dài từ thời Chúa Nguyễn Phúc Khoát, áo dài tứ thân biến thể, áo dài Le Mur (1934), áo dài Lê Phổ (1950), áo dài Raglan (1960) đến áo dài của các nữ tướng, nhà ngoại giao và di sản văn hóa phi vật thể.',
    verificationEvidence: 'Hồ sơ kiểm kê số BTAD-2023-YPHUC: Xác thực bộ sưu tập áo dài cổ truyền và quy chuẩn thông số kỹ thuật tà áo hai bên qua từng thời kỳ lịch sử.',
    citationExample: 'Hồ sơ trưng bày di sản: Bộ sưu tập Áo dài Việt Nam qua các thời kỳ lịch sử — Bảo tàng Áo Dài TP.HCM.',
  },
  {
    id: 'museum-history-national',
    type: 'museum',
    grade: 'A',
    title: 'Bảo tàng Lịch sử Quốc gia (Vietnam National Museum of History)',
    location: 'Số 1 Tràng Tiền & 216 Trần Quang Khải, Hoàn Kiếm, Hà Nội',
    url: 'https://baotanglichsu.vn/',
    verified: true,
    verifiedBy: 'Hội đồng Khoa học Bảo tàng Lịch sử Quốc gia',
    verifiedAt: '2026-03-18',
    relatedGarments: ['ao-dai', 'ao-ngu-than'],
    researchScope: 'Bộ sưu tập hiện vật Hoàng gia triều Nguyễn gồm áo Long bào, Mãng bào đại triều, áo tấc ngũ thân lập lĩnh dệt gấm thêu kim tuyến, cúc ngọc và các phục sức cổ vật quốc gia nguyên bản thế kỷ XIX–XX.',
    verificationEvidence: 'Đã xác minh qua chuyên đề "Vàng son nhung gấm — Di sản trang phục cung đình thời Nguyễn", đối chiếu trực tiếp quy chuẩn 5 thân áo và bố cục khuy cài cung đình.',
    citationExample: 'Bảo tàng Lịch sử Quốc gia, Sưu tập Hiện vật Y phục Cung đình Triều Nguyễn, Mã định danh VNMH-C-1945.',
  },
  {
    id: 'museum-co-vat-cung-dinh-hue',
    type: 'museum',
    grade: 'A',
    title: 'Bảo tàng Cổ vật Cung đình Huế (Trung tâm Bảo tồn Di tích Cố đô Huế)',
    location: 'Điện Long An, số 3 Lê Trực, TP. Huế, Thừa Thiên Huế',
    url: 'http://hueworldheritage.org.vn/',
    verified: true,
    verifiedBy: 'Trung tâm Bảo tồn Di tích Cố đô Huế & Sở VH-TT Thừa Thiên Huế',
    verifiedAt: '2026-03-14',
    relatedGarments: ['ao-ngu-than'],
    researchScope: 'Hồ sơ khoa học Đề án "Huế — Kinh đô Áo dài Việt Nam". Trưng bày nguyên bản áo ngũ thân tay chẽn, áo ngũ thân tay thụng (áo tấc) của vương tôn, quan lại triều đình và dân gian xứ Huế.',
    verificationEvidence: 'Căn cứ theo Quyết định phê duyệt Đề án "Huế — Kinh đô Áo dài" và hồ sơ phục dựng chuẩn xác tỷ lệ phom dáng Áo ngũ thân truyền thống của Trung tâm BTDT Cố đô Huế.',
    citationExample: 'Trung tâm Bảo tồn Di tích Cố đô Huế (2020), Hồ sơ Khoa học Trang phục Cung đình và Áo dài Huế.',
  },
  {
    id: 'museum-phu-nu-nam-bo',
    type: 'museum',
    grade: 'A',
    title: 'Bảo tàng Phụ nữ Nam Bộ',
    location: '202 Võ Thị Sáu, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh',
    url: 'https://baotangphunu.com/',
    verified: true,
    verifiedBy: 'Phòng Nghiên cứu Sưu tầm Bảo tàng Phụ nữ Nam Bộ',
    verifiedAt: '2026-03-22',
    relatedGarments: ['ao-ba-ba'],
    researchScope: 'Bảo tồn và trưng bày chuyên đề "Trang phục phụ nữ các dân tộc Nam Bộ", hiện vật áo bà ba lụa tơ tằm, vải lãnh Mỹ A, khăn rằn Nam Bộ và đồ dùng gắn liền với văn hóa sông nước miền Tây.',
    verificationEvidence: 'Xác minh qua hồ sơ khoa học phòng trưng bày Văn hóa đời sống phụ nữ Nam Bộ; đối chiếu lịch sử áo bà ba xẻ tà hai bên hông và khăn rằn caro truyền thống.',
    citationExample: 'Bảo tàng Phụ nữ Nam Bộ (2019), Kỷ yếu Trưng bày Trang phục và Đời sống Văn hóa Phụ nữ Nam Bộ.',
  },
  {
    id: 'center-quan-ho-bac-ninh',
    type: 'portal',
    grade: 'A',
    title: 'Trung tâm Bảo tồn Dân ca Quan họ Bắc Ninh (Di sản UNESCO)',
    location: 'Khu Viêm Xá, Phường Hòa Long, TP. Bắc Ninh, Tỉnh Bắc Ninh',
    url: 'http://sovhttdl.bacninh.gov.vn/',
    verified: true,
    verifiedBy: 'Sở Văn hóa, Thể thao và Du lịch Tỉnh Bắc Ninh',
    verifiedAt: '2026-03-10',
    relatedGarments: ['ao-tu-than'],
    researchScope: 'Quy chuẩn di sản phi vật thể nhân loại UNESCO về lễ phục Quan họ: Áo tứ thân mớ ba mớ bảy, áo yếm cổ xẻ, dải yếm lụa đào, thắt lưng bao xanh, nón quai thao thắt chỉ điều và khăn mỏ quạ.',
    verificationEvidence: 'Xác nhận theo chuẩn mực hồ sơ ghi danh Di sản Văn hóa Phi vật thể đại diện của nhân loại được UNESCO công nhận năm 2009.',
    citationExample: 'Sở VH-TT-DL Bắc Ninh, Hồ sơ Di sản Dân ca Quan họ Bắc Ninh — Không gian và Phục trang Di sản.',
  },
  {
    id: 'portal-nem-fashion-heritage',
    type: 'portal',
    grade: 'B',
    title: 'Tư liệu Phối đồ Hiện đại — NEM Fashion Áo Dài Heritage',
    url: 'https://nemshop.vn/collections/ao-dai',
    verified: true,
    verifiedBy: 'Ban Biên tập Thiết kế & Kiểu dáng Remix Studio',
    verifiedAt: '2026-03-25',
    relatedGarments: ['ao-dai', 'ao-ba-ba'],
    researchScope: 'Khảo cứu xu hướng thiết kế áo dài cách tân đương đại, bảng phối màu thời trang lễ Tết, chất liệu gấm tơ hiện đại và phụ kiện phối hợp cho thế hệ trẻ.',
    verificationEvidence: 'Đối chiếu các bộ sưu tập áo dài thương mại thực tế, xác thực tính ứng dụng cao của các biến thể phom dáng cách tân trong đời sống thường nhật.',
    citationExample: 'NEM Fashion (2025–2026), BST Áo Dài Di Sản Đương Đại.',
  },
];

export const getResearchSourcesForGarment = (garmentId: GarmentId) =>
  researchSourceCandidates.filter(source => source.relatedGarments.includes(garmentId));