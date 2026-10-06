# TODO FOR HUMANS

Những việc AI không thể thay con người. Đây là danh sách việc cần làm trước khi sản phẩm được coi là đã thẩm định.

---

## WHAT AI DID (Phase 1–7)

- Audit toàn bộ nội dung cultural notes (4 garments)
- Hedge overconfident language (đặc biệt áo ngũ thân có viewsNote cho multiple_views)
- Cập nhật schema types: in_review status, viewsNote field, Source/SourceRef/Reviewer interfaces
- Thêm RED rules & safety gates:
  - Áo bà ba + Nón quai thao + Nguyên bản (§68: RED, chặn lưu/xuất thẻ)
  - Áo tứ thân + Khăn rằn + Nguyên bản (§18: RED, chuyển YELLOW khi ở Cách tân/Remix)
- Tích hợp Preset Matrix (4 looks chuẩn) kết nối từ Home vào Studio
- Lưu trữ Lookbook 12 vị trí với tính năng Hoàn tác (Undo) trong 5 giây
- Xuất thẻ Outfit chuẩn 4:5 và 9:16 với chất liệu giấy dó và dấu rập thợ may
- Redesign Thước Remix (RemixTape) thành signature component chuẩn bàn may Gen Z
- Responsive Lookbook Grid 4 cột trên màn hình lớn (≥1440px)
- Tạo content validator (`npm run validate:content`)
- Tạo `content/TODO_SOURCES.csv` (16 items cần nguồn thực tế)
- Tạo bộ tài liệu submission hoàn chỉnh (`docs/`)
- Test: 34/34 tests tự động pass trên Node test runner
- Lint: 0 errors | Typecheck: 0 errors | Build: ✅ (JS gzip 113 kB, CSS 21 kB)

---

## WHAT HUMAN MUST DO

### 1. Tìm nguồn thật (QUAN TRỌNG NHẤT)

Xem `content/TODO_SOURCES.csv` để biết 16 item cần nguồn.

Ưu tiên nguồn hạng A:
- Bảo tàng Áo dài TP.HCM
- Bảo tàng Lịch sử Quốc gia
- Viện Văn hóa Nghệ thuật Quốc gia Việt Nam
- Sách chuyên khảo trang phục truyền thống

Sau khi có nguồn:
- Không tự add vào code
- Cung cấp cho dev team với format Source schema (xem src/types/index.ts)
- Dev team sẽ add vào sources.json và link SourceRef vào từng garment

### 2. Thẩm định nội dung văn hóa

Quy trình hợp lệ:
1. Tìm được >= 2 nguồn độc lập (ít nhất 1 nguồn hạng A hoặc B)
2. Chuyển status: draft → in_review
3. Nhờ chuyên gia (nhà nghiên cứu, curator, nghệ nhân) đọc và duyệt
4. Ghi nhận: tên reviewer, vai trò, tổ chức, ngày duyệt, scope
5. Chuyển status: in_review → reviewed
6. AI KHÔNG được tự thực hiện bước 3–5

Ai là reviewer hợp lệ:
- Nhà nghiên cứu trang phục lịch sử Việt Nam
- Curator bảo tàng dân tộc học / lịch sử
- Nghệ nhân có chuyên môn xác nhận
- Giảng viên chuyên ngành văn hóa học / dân tộc học

### 3. Đối chiếu visual trang phục

- [ ] So sánh SVG minh họa với hình ảnh thật của trang phục
- [ ] Đảm bảo các thành phần chính (cổ áo, tà áo, vạt áo) được thể hiện đúng
- [ ] Kiểm tra màu sắc gợi ý có phù hợp với trang phục truyền thống
- [ ] Thay SVG đơn giản bằng minh họa chất lượng cao hơn nếu cần

### 4. Test với người dùng thật

- [ ] Test với 20–30 bạn trẻ (khảo sát) và 5 người dùng (phỏng vấn sâu + kiểm thử UX theo docs/02-research-toolkit.md)
- [ ] Test với 1–2 người có kiến thức về trang phục truyền thống
- [ ] Ghi nhận họ hiểu / không hiểu gì
- [ ] Ghi nhận họ thích / không thích gì
- [ ] Điều chỉnh UX theo phản hồi thực tế

### 5. Điền placeholder thông tin thật

- [ ] [TÊN NHÓM] — tên nhóm/tổ chức phụ trách
- [ ] [EMAIL NHÓM] — email liên hệ để nhận báo sai sót
- [ ] [LINK NỘP] / [DEPLOY DEMO URL]
- [ ] Sau khi có email thật: update form "Báo sai sót" trong app

### 6. Duyệt PROPOSED_RULES.md

Xem `content/PROPOSED_RULES.md`:
- PR-01: Áo ngũ thân cho check-in du lịch (CHỜ DUYỆT)
- PR-02: Khăn rằn với áo tứ thân (ĐÃ DUYỆT & ÁP DỤNG ở Phase 5 (§18 Golden Rule))
- PR-03: Áo dài + sneaker ở lễ hội / đình chùa (CHỜ DUYỆT)

### 7. Kiểm tra license

- [ ] Xác nhận license của tất cả dependencies
- [ ] Xác nhận Be Vietnam Pro font license (Google Fonts — OFL, OK)
- [ ] Xác nhận icon library license (Lucide — ISC, OK)
- [ ] Update LICENSES.md với thông tin Be Vietnam Pro

### 8. Chuẩn bị deployment

- [ ] Deploy frontend và Node API lên Node host; static hosting thuần không chạy được tính năng Thử đồ AI
- [ ] Cấu hình `CLOUDFLARE_ACCOUNT_ID` và `CLOUDFLARE_API_TOKEN` bằng secret/environment variable của host; không commit `.env`
- [ ] Chạy thử FLUX.2 [klein] với ảnh được phép sử dụng; xác minh chất lượng khuôn mặt/trang phục và mức dùng free neurons
- [ ] Thêm CAPTCHA hoặc abuse control và hạn mức chi phí trước khi mở endpoint công khai
- [ ] Cấu hình domain và kiểm tra SPA/API cùng origin
- [ ] Test trên nhiều thiết bị thật
- [ ] Performance audit
- [ ] Screenshots cho pitch/demo

### 9. P2 Features còn thiếu

- [ ] Compare view (so sánh 2 outfit)
- [x] Six representative character presets (Hạ, Đông, Xuân, Thu, Việt, Hằng) are selectable; review their silhouettes with users before presenting them as authentic historical depictions
- [x] Manual weather and event suggestions are implemented; live forecast remains optional and needs privacy review before adding location access
- [ ] Export card (1080x1350 / 1080x1920)

---

## LƯU Ý QUAN TRỌNG

- Không được ghi rằng những việc trên đã hoàn thành nếu chưa làm
- Tất cả cultural notes hiện tại là AI-generated draft
- Không có nguồn nào được trích dẫn
- Không có ai đã thẩm định nội dung
- Cultural content chỉ được chuyển sang "reviewed" khi ĐÁP ỨNG ĐỦ điều kiện trong ReviewStatus Rules (xem docs/03-content-assurance.md)
