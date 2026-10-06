# Việt Phục Remix

**Bàn thợ may Gen Z — Phối trang phục Việt theo dịp**

> Ứng dụng tương tác giúp người trẻ phối trang phục truyền thống Việt Nam theo dịp, vùng miền và phong cách cá nhân; kết hợp **Thước Remix**, **Cultural Light** và **Chuyện chiếc áo** để tự tin sáng tạo mà luôn tôn trọng bối cảnh văn hóa.

- **Demo:** `[DEPLOY DEMO URL]`
- **Repository:** `[REPOSITORY URL]`
- **Trạng thái:** Hoàn thiện Phase 1–7 (Sẵn sàng kiểm thử, demo & thẩm định)

> Tính năng **Thử đồ AI** là tùy chọn, cần Node.js server và Cloudflare Workers AI credentials. Không chạy được trên static hosting thuần như GitHub Pages.

---

## 1. Vấn đề (Problem)
Nhiều bạn trẻ Gen Z rất yêu thích và muốn diện Việt phục trong các dịp đặc biệt (Tết Nguyên đán, khai giảng, chụp kỷ yếu, lễ hội, check-in di sản). Tuy nhiên, người trẻ thường gặp rào cản tâm lý:
- Không biết dáng áo nào phù hợp với dịp và không gian cụ thể.
- Lúng túng khi phối màu sắc và phụ kiện đương đại (giày, mấn, túi, nón).
- E ngại bị cộng đồng chỉ trích là "làm biến tướng" hoặc "sai lệch văn hóa" khi muốn cách tân theo cá tính riêng.
- Thiếu nguồn tư liệu đáng tin cậy giải thích bối cảnh lịch sử một cách dễ hiểu, gần gũi.

---

## 2. Giải pháp (Solution)
**Việt Phục Remix** đóng vai trò như một chiếc *Bàn thợ may kỹ thuật số*, tạo ra không gian thử nghiệm an toàn, trực quan và văn minh:
1. **Phối đồ tương tác:** Chọn dáng áo, dịp mặc, phong cách và bảng màu thuần Việt.
2. **Định lượng mức độ sáng tạo:** Điều chỉnh linh hoạt từ truyền thống nguyên bản đến biến tấu đương đại.
3. **Phản hồi văn hóa tức thì:** Nhận giải thích khách quan (WHAT / WHY / HOW) thay vì phán xét đúng/sai cứng nhắc.
4. **Lưu giữ & Xuất thẻ Lookbook:** Xuất thẻ outfit chuẩn tỉ lệ 4:5 hoặc 9:16 trên nền họa tiết giấy dó để lưu giữ hoặc chia sẻ.

---

## 3. Ba điểm khác biệt cốt lõi (Core Differentiators)

### ① Thước Remix (RemixTape)
Signature component độc bản lấy cảm hứng từ thước đo bàn may:
- **Nguyên bản (0–33%):** Giữ nguyên cấu trúc cổ, tà, vạt và phụ kiện truyền thống.
- **Cách tân (34–66%):** Giữ phom dáng nhận diện chính, cho phép phụ kiện linh hoạt.
- **Remix mạnh (67–100%):** Biến tấu hiện đại, giao thoa thời trang đường phố và tinh thần đương đại.

### ② Cultural Light (Đèn văn hóa)
Hệ thống phản hồi ngữ cảnh 3 trạng thái:
- 🟢 **Xanh (Phù hợp):** Lựa chọn chuẩn mực theo bối cảnh truyền thống.
- 🟡 **Vàng (Cần cân nhắc):** Giao thoa mới mẻ, cung cấp thêm thông tin ngữ cảnh để người mặc tự quyết định.
- 🔴 **Đỏ (Cảnh báo văn hóa):** Phát hiện xung đột văn hóa nghiêm trọng (ví dụ: *Áo bà ba + Nón quai thao ở mức Nguyên bản*, hoặc *Áo tứ thân + Khăn rằn ở mức Nguyên bản*). Cung cấp nút **"Sửa giúp mình"** và **tự động khóa xuất thẻ nhãn Nguyên bản** để bảo vệ tính xác thực của di sản.

### ③ Chuyện chiếc áo (Story & Context)
Panel lược sử và tri thức văn hóa ngắn gọn, trình bày đa góc nhìn học thuật (`multiple_views`), nói rõ xuất xứ và ý nghĩa biểu tượng của từng thành phần trang phục.

---

## 4. Phạm vi sản phẩm (Current Scope)

### Đã triển khai hoàn chỉnh:
- **4 dáng áo truyền thống:** Áo dài, Áo ngũ thân (tay chẽn), Áo tứ thân, Áo bà ba.
- **6 nhân vật đại diện:** Hạ, Đông, Xuân, Thu, Việt, Hằng; profile giữ theo outfit, lookbook và hình minh họa SVG.
- **6 dịp mặc thực tế:** Tết / Họp mặt gia đình, Khai giảng, Kỷ yếu / Tốt nghiệp, Lễ hội / Đình chùa, Check-in di sản, Văn nghệ / CLB.
- **3 vùng miền văn hóa:** Bắc Bộ, Trung Bộ — Huế, Nam Bộ.
- **4 phong cách phối:** Thanh lịch, Streetwear, Vintage, Tối giản.
- **Gợi ý theo dịp & thời tiết:** Lọc trang phục theo sự kiện, chọn thời tiết dự kiến và nhận điều chỉnh tiện nghi thủ công; không gọi dịch vụ định vị/dự báo thời tiết.
- **Minh bạch văn hóa:** Cultural Light cảnh báo theo biến thể phụ kiện cụ thể; kết quả nêu cách gắn nhãn bản remix và nhắc nội dung nào còn ở trạng thái bản nháp.
- **Hệ thống màu sắc:** Bảng màu Việt phục truyền thống kết hợp công cụ chấm điểm hài hòa thị giác riêng biệt (0–100).
- **Tập Lookbook:** Quản lý tối đa 12 bộ outfit, hỗ trợ nhân bản và hoàn tác xóa trong 5 giây.

### Phạm vi loại trừ (Exclusions):
- Không bao gồm trang phục của 53 dân tộc thiểu số Việt Nam (tránh giản lược hóa thiếu thận trọng).
- Không bao gồm lễ phục cung đình phức tạp ngoài phạm vi (nhật bình, áo tấc đại triều).
- Không có tài khoản người dùng hoặc cơ sở dữ liệu người dùng.
- Không tích hợp tính năng thương mại, bán hàng, tiếp thị liên kết (affiliate).
- Luồng phối đồ cốt lõi không cần API AI; tính năng Thử đồ AI là tùy chọn và gửi ảnh đến Cloudflare Workers AI sau khi người dùng đồng ý.

---

## 5. Minh bạch văn hóa & Đạo đức dữ liệu (Cultural Honesty)

> ⚠️ **LƯU Ý MINH BẠCH NỘI DUNG:**  
> Toàn bộ nội dung văn hóa trong phiên bản này hiện ở trạng thái **BẢN NHÁP (Draft)**. Chúng tôi KHÔNG bịa đặt nguồn học thuật và KHÔNG tạo reviewer giả mạo. Danh mục 16 tư liệu cần khảo cứu thực địa được lưu trữ công khai tại `content/TODO_SOURCES.csv` để sẵn sàng cho các nhà nghiên cứu, bảo tàng và nghệ nhân cùng tham gia thẩm định.

---

## 6. Công nghệ sử dụng (Tech Stack)

Theo đúng hiện trạng mã nguồn thực tế:
- **Ngôn ngữ & Nền tảng:** React 19.2, TypeScript 6.0 (Strict mode, ES2022).
- **Bộ công cụ xây dựng:** Vite 8.3 (`base: './'`).
- **Định tuyến:** React Router DOM 7.18 (`HashRouter` tối ưu hóa cho static hosting).
- **Biểu tượng:** Lucide React.
- **Phông chữ:** Be Vietnam Pro (Google Fonts, SIL Open Font License).
- **Công cụ kiểm thử & Lint:** Oxlint (linter siêu tốc), Node.js native test runner (`tsx --test`).
- **Lưu trữ:** Web Storage API (`localStorage`) cục bộ với bộ đệm in-memory an toàn.
- **AI thử đồ tùy chọn:** Node.js 22.9+, Express, Cloudflare Workers AI `FLUX.2 [klein]`, Sharp để kiểm tra/resize ảnh trong RAM.

---

## 7. Khởi chạy cục bộ (Run Locally)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy dev server
npm run dev

# Mở trình duyệt tại: http://localhost:5173/
```

### Cấu hình Thử đồ AI

1. Tạo Cloudflare account miễn phí và vào mục Workers AI → Use REST API để lấy Account ID và Workers AI API Token có quyền cần thiết.
2. Sao chép `.env.example` thành `.env`, điền `CLOUDFLARE_ACCOUNT_ID` và `CLOUDFLARE_API_TOKEN` trong file local. Không gửi token vào chat, không commit `.env`.
3. Giữ account ở Workers Free plan nếu không muốn phát sinh usage charge; free allocation là 10,000 neurons/ngày, sau đó request bị từ chối. Chạy `npm run dev`; mở `#/ai-try-on`.

Ảnh được kiểm tra/resize trong RAM, không ghi vào database hoặc đĩa của app. Khi submit, ảnh và prompt được gửi tới Cloudflare Workers AI. Server giới hạn 10 request/ngày trên một tiến trình; Cloudflare cũng áp free allocation theo account. `FLUX.2 [klein]` có thể thay đổi khuôn mặt hoặc chi tiết trang phục, không phải công cụ phục dựng lịch sử chính xác.

---

## 8. Lệnh kiểm thử & Đóng gói (Verification Commands)

Tất cả lệnh đều phải đạt kết quả **PASS**:

```bash
# Kiểm tra schema văn hóa & tính nhất quán dữ liệu
npm run validate:content

# Kiểm tra kiểu dữ liệu TypeScript
npm run typecheck

# Kiểm tra cú pháp và quy chuẩn code
npm run lint

# Chạy toàn bộ 34 bài kiểm thử đơn vị và tích hợp
npm test

# Đóng gói sản phẩm production
npm run build

# Xem trước bản đóng gói thành phẩm
npm run preview

# Chạy API Node phục vụ bản production sau khi build
npm start
```

---

## 9. Hướng dẫn triển khai (Deployment)

Dự án vẫn dùng `HashRouter`, nhưng Thử đồ AI cần deploy cả `dist/` và Node server trên cùng origin. Static hosting thuần chỉ chạy được các luồng cốt lõi, không có endpoint AI.

- Dùng Node host hỗ trợ chạy server liên tục (ví dụ Cloud Run, Render hoặc Fly.io).
- Cấu hình `CLOUDFLARE_ACCOUNT_ID` và `CLOUDFLARE_API_TOKEN` bằng secret/environment variable của host; không đưa credentials vào build frontend.
- Start command: `npm start`; build command: `npm run build`.
- GitHub Pages chỉ phù hợp nếu tắt/ẩn tính năng AI và chỉ deploy phần frontend tĩnh.

---

## 10. Giới hạn hiện tại & Việc con người cần làm (Human Actions)

Xem chi tiết tại [docs/TODO_FOR_HUMANS.md](docs/TODO_FOR_HUMANS.md) và [docs/P2_STATUS.md](docs/P2_STATUS.md):
- **Xác thực nguồn:** Kết nối với các chuyên gia, bảo tàng (Bảo tàng Áo dài, Viện VHNT) để thẩm định 16 mục trong `content/TODO_SOURCES.csv`.
- **Khảo sát thực địa:** Thực hiện khảo sát 20–30 bạn trẻ và phỏng vấn sâu 5 người dùng theo kịch bản tại [docs/02-research-toolkit.md](docs/02-research-toolkit.md).
- **Tính năng P2 tương lai:** Chế độ so sánh đối chiếu hai bộ đồ song song (Compare View) và xuất ảnh trực tiếp qua canvas rasterizer.

---

## 11. Thông tin liên hệ & Đóng góp
- **Tổ chức / Nhóm phụ trách:** `TriNova`
- **Mã đội:** `TEAM-KNRNZF`
- **Thành viên:**
  - `tranvuthuyminh030407@gmail.com`
  - `haimoc2109a@gmail.com`
  - `vantruong272007@gmail.com`
- **Email tiếp nhận phản hồi & báo lỗi:** `haimoc2109a@gmail.com`
- **Báo sai sót văn hóa:** Mở mục "Nguồn & Trạng thái" (`#/sources`) trực tiếp trong ứng dụng để gửi thông tin đóng góp.
