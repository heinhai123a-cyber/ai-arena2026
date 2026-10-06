# Việt Phục Remix — Kế hoạch & Hệ thống Thiết kế (Design Plan)

## 1. Định hướng sáng tạo: "Bàn thợ may của Gen Z" (Digital Cutting Table)
Sản phẩm mang diện mạo của một bàn làm việc thủ công may mặc đương đại:
- Nhân vật đứng trên bàn cắt vải giấy can có vạch kẻ đo centimet.
- Bảng màu chọn đồ mang hình hài các mẫu vải (swatches) có thớ dệt và mép cắt may.
- Mảnh rập chọn trang phục có đường nét đứt như đường phấn vẽ rập may.
- Thước Remix là một cuộn thước dây thợ may với vạch chia chuẩn xác và con trượt kẹp thước caliper.
- Thẻ treo thông tin (HangTag) có lỗ xỏ dây truyền thống.

---

## 2. Hệ thống Màu sắc & Nguyên tắc phân cấp 60/30/10

Mỗi màu mang đúng một vai trò duy nhất, không sử dụng tùy tiện:

| Vai trò | Tỉ lệ diện tích | Token & Giá trị Hex | Dùng cho | Tuyệt đối không dùng cho |
|---|---|---|---|---|
| **Nền (Giấy can)** | ~60% | `--color-paper` (`#E9EEF2`), `--color-paper-soft` (`#F1F4F7`), `--color-paper-warm` (`#FAF8F5`), `--color-cream` (`#F6F4EE`) | Nền toàn trang, nền bàn cắt vải, nền thẻ sản phẩm | Không dùng trắng thuần xen kẽ dạng sọc (zebra striping) gây đứt gãy cảm giác tấm vải/bàn may liền mạch |
| **Chữ & Nét vẽ (Mực chàm)** | ~30% | `--color-ink` (`#1D2F4A`), `--color-ink-secondary` (`#364A68`), `--color-slate` (`#5A6878`) | Toàn bộ chữ, tiêu đề, viền chia, icon, nét vẽ SVG nhân vật | Không dùng đen thuần `#000` hay xám hệ thống mặc định |
| **Nhấn Hero (Vàng thước)** | ~5–10% | `--color-tape` (`#F2C230`), `--color-tape-dark` (`#B8860B`) | **CHỈ**: Con trượt kẹp thước Remix, nút hành động chính duy nhất trên mỗi màn hình (`.btn-primary`), và trạng thái active/đang chọn | Không rắc màu vàng vào viền card phụ hay chi tiết trang trí lặp lại, tránh làm loãng vai trò Hero duy nhất |
| **Truyền tin (Xanh rêu & Son phấn)** | Nhỏ, chỉ khi cần | `--color-moss` (`#3F7A52`), `--color-vermillion` (`#D6402F`) | **CHỈ** trong ngữ cảnh đèn giao thông văn hóa (xanh, vàng, đỏ) và phản hồi thành công/cảnh báo | Không dùng làm màu trang trí ở nơi khác để tránh gây hiểu nhầm về văn hóa |
| **Nhấn phụ (Hồng đào)** | Rất nhỏ | `--color-peach` (`#F4A8A0`) | Badge phụ, chi tiết điểm xuyết mềm mại | Không thay thế cho Vàng thước |

### Độ tương phản khả năng tiếp cận (Accessibility WCAG):
- Nút Vàng thước (`#F2C230`) với chữ Mực chàm (`#1D2F4A`): tỉ lệ tương phản **8.1:1** (vượt xa chuẩn WCAG AAA 4.5:1).
- Chữ Mực chàm (`#1D2F4A`) trên nền Giấy can (`#E9EEF2` / `#F6F4EE`): tỉ lệ tương phản **9.8:1** (WCAG AAA).
- Nút phụ Mực chàm trên nền trong suốt / viền bạc: tỉ lệ tương phản $\ge$ **7:1**.

---

## 3. Chữ & Phân cấp thông tin (Typography)

- **Họ phông**: `'Be Vietnam Pro'` với đầy đủ bộ ký tự tiếng Việt có dấu hoàn chỉnh.
- **Line-height an toàn**: 1.25 cho tiêu đề display/heading lớn, 1.6 cho body text — bảo đảm dấu thanh tiếng Việt không bị cắt cụt ở mọi kích thước màn hình.
- **Sentence case**: Chuyển toàn bộ các nhãn từ viết hoa toàn bộ (ALL CAPS) về sentence case tự nhiên.
- **Loại bỏ "AI Design Chrome"**:
  - Không ngắt màu 1 từ trong tiêu đề (h1 thuần nhất một màu Mực chàm, trang nghiêm và đồng bộ).
  - Loại bỏ các nhãn "eyebrow" sáo rỗng (`Bắt đầu từ đâu?`, `Văn hóa`, `Xu hướng`, `Khám phá`).
  - Loại bỏ số thứ tự giả `01 — `, `02 — ` ở các mục nội dung không tuần tự.
  - Loại bỏ mũi tên trailing `→` và glyph arrow ở cuối các nút bấm và liên kết.

---

## 4. Hình thái thành phần mang ngôn ngữ thợ may

1. **Thước Remix (RemixTape)**:
   - Thước dây kỹ thuật số với vạch khắc centimet (vạch lớn 12px, vạch nhỏ 6px).
   - Ba phân đoạn màu mang thông điệp rõ ràng: Xanh rêu (Nguyên bản), Vàng thước (Cách tân), Son phấn (Remix mạnh).
   - Con trượt kẹp caliper với kim chỉ vạch và vân may chỉ vàng, có độ nhạy điều khiển chính xác.

2. **Mảnh rập chọn trang phục (SelectionCard)**:
   - Viền nét đứt (`1.5px dashed var(--color-silver)`) mô phỏng đường cắt rập vải.
   - Khi chọn, viền chuyển nét liền mực chàm kèm dải chỉ Vàng thước (`inset 3px 0 0 var(--color-tape)`).

3. **Mẫu vải chọn màu (ColorSwatch)**:
   - Mép mẫu vải nét đứt răng cưa (`1px dashed rgba(29, 47, 74, 0.25)`).
   - Vân dệt chéo 45° mô phỏng thớ vải thật.
   - Hover phóng nhẹ 1.04x không nảy giật; khi chọn có viền kép Vàng thước sắc nét.

4. **Thẻ treo trạng thái (HangTag / Badge)**:
   - Lỗ xỏ dây mắt cáo (`.badge::before` eyelet) tạo cảm giác thẻ bài quần áo thực thụ.

5. **Bàn làm việc Studio (Studio Workbench)**:
   - Bố cục 2 cột trên máy tính: cột trái là nhân vật đứng trên bàn cắt vải lớn với dải mẫu vải; cột phải là bảng điều khiển Thước Remix và phản hồi văn hóa theo thời gian thực.
   - Thanh điều khiển dính đáy (Sticky action bar) sử dụng nền giấy can vững chãi, nút chính "Tiếp tục" / "Tạo outfit" dùng đúng Vàng thước duy nhất.

6. **Huy hiệu Thước Remix (RemixTapeBadge)**:
   - Thay thế toàn bộ các chip tròn/bo % bằng hình ảnh thước dây đo may thật (khung vàng thước `#F2C230`, viền mực chàm `#1D2F4A`, 8 vạch chia đo đạc vật lý ở mép trên và chữ hiển thị `[Mức Remix] · [Điểm]%` ở nửa dưới).

7. **Đèn giao thông văn hóa**:
   - Biểu tượng + nhãn chữ + nền màu phân biệt, không chỉ dựa vào màu sắc (đảm bảo cho người khiếm thị màu).
   - Kèm nút "Sửa giúp mình" thực hiện ngay gợi ý điều chỉnh.

---

## 5. Nguyên tắc chuyển động (Motion Discipline)

- **Loại bỏ generic animation**: Tắt bỏ toàn bộ hiệu ứng `animate-fadeInUp` và các lớp trễ `stagger-*` làm giao diện rung lắc khi cuộn trang.
- **Loại bỏ hover jump**: Bỏ toàn bộ `transform: translateY(-2px)` trên mọi card, thay bằng hiệu ứng chuyển màu viền êm dịu (`transition: border-color 150ms`).
- **Tôn trọng `prefers-reduced-motion`**: Toàn bộ chuyển động tắt ngay lập tức khi người dùng bật chế độ giảm chuyển động trong hệ điều hành.

---

## 6. Nhật ký thay đổi lớn (Rationale Log)

1. **Đổi nút `.btn-primary` sang Vàng thước (`--color-tape`) và chữ Mực chàm**:
   - *Lý do*: Trước đây nút chính dùng mực chàm tối, trùng với màu chữ tiêu đề và viền khiến màn hình thiếu điểm nhấn thị giác Hero. Chuyển sang Vàng thước giúp màn hình có đúng 1 điểm sáng hành động rõ rệt, tương phản 8.1:1 đạt chuẩn AAA.
2. **Đổi nút `.btn-secondary` sang nền trong suốt kèm viền bạc mảnh**:
   - *Lý do*: Giảm bớt cạnh tranh thị giác với nút chính, tạo phân cấp hành động 1-2 rõ ràng.
3. **Bỏ màu Vàng thước ở viền card và các chi tiết trang trí phụ**:
   - *Lý do*: Giữ Vàng thước thành màu Hero độc quyền cho Thước Remix và nút CTA chính. Nếu rắc vàng thước khắp nơi, Thước Remix sẽ mất đi tính biểu tượng đặc trưng.
4. **Loại bỏ nền trắng thuần `#FFFFFF` xen kẽ (Zebra Striping) giữa các section trang chủ**:
   - *Lý do*: Phá vỡ cảm giác không gian bàn thợ may / tấm giấy can liền mạch. Toàn trang nay sử dụng tông giấy can ấm áp thống nhất với các đường phân cách mảnh.
5. **Bỏ số thứ tự giả `01 — `, `02 — ` trong `GarmentDetailPage` và `HomePage`**:
   - *Lý do*: Các mục thông tin nhận diện không phải là quy trình 5 bước bắt buộc; đặt số tạo cảm giác máy móc và khuôn mẫu SaaS AI.
6. **Bỏ chia đôi màu trong tiêu đề chính `HomePage`**:
   - *Lý do*: Tiêu đề ngắt màu làm giảm tính trang trọng và cổ điển của chủ đề Việt phục; đưa về một tông Mực chàm đồng nhất giúp tiêu đề có trọng lượng thị giác vững chãi.
7. **Bỏ mũi tên trailing `→` và `<ArrowRight>` trên tất cả nút bấm và link**:
   - *Lý do*: Loại bỏ dấu hiệu thiết kế mặc định kiểu AI mẫu web SaaS; giúp typography và bố cục nút gọn gàng, tinh tế theo phong cách tạp chí thời trang/thủ công.
8. **Thêm mắt cáo treo dây vào `.badge` và mép nét đứt vào `.color-swatch`**:
   - *Lý do*: Tạo xúc cảm thủ công đặc thù cho chủ đề "Bàn thợ may", biến các khối giao diện trừu tượng thành vật thể may mặc có câu chuyện.
9. **Nền giấy can có kết cấu lưới chấm 22px (`radial-gradient`)**:
   - *Lý do*: Thay thế màu nền phẳng bằng `background-color: #E9EEF2; background-image: radial-gradient(circle, #C9D2DB 1px, transparent 1px); background-size: 22px 22px;` tạo độ sâu và cảm giác trang giấy kẻ/bàn cắt vải kỹ thuật số thực tế.
10. **Thay huy hiệu % tròn bằng Huy hiệu Thước Remix (RemixTapeBadge)**:
     - *Lý do*: Thay toàn bộ các chip tròn/bo % generic bằng thước dây SVG thật (nền vàng thước `#F2C230`, viền và vạch chia đo đạc mực chàm `#1D2F4A`, hiển thị dữ liệu động `[Mức Remix] · [Điểm]%`).
11. **Thêm Heritage Layer với token `--color-heritage-red` (`#7B2D2D`) riêng biệt**:
     - *Lý do*: Bổ sung chiều sâu văn hóa cổ điển (poster Việt phục, đình chùa, họa tiết thời Lê) mà không xâm phạm hệ màu 60/30/10 hiện tại. Token Heritage Red tách biệt hoàn toàn khỏi dải Vàng thước Hero, giữ nguyên bài học Rationale Log #3 — Vàng thước không bị pha loãng. Heritage Layer được giam trong `.heritage-zone` và chỉ xuất hiện ở 5 vị trí xác định, ngăn hiệu ứng "rải khắp nơi".

---

## 7. Lớp trang trí di sản (Heritage Layer)

Lớp trang trí thị giác lấy cảm hứng từ poster Việt phục cổ điển, kiến trúc đình chùa Bắc Bộ, và họa tiết rồng mây thời Lê. Heritage Layer hoạt động như một **lớp phủ trang trí biệt lập**, không chạm vào hệ màu 60/30/10 hiện tại và không làm loãng vai trò Hero-Vàng-thước-độc-quyền (xem Rationale Log #3).

### 7.1 Token màu di sản

| Token | Giá trị Hex | Vai trò | Tuyệt đối không dùng cho |
|---|---|---|---|
| `--color-heritage-red` | `#7B2D2D` | Nền riêng cho các vùng trang trí Heritage (hero banner, khung thẻ xuất, trang CulturePage) | Không dùng làm nền trang chung, nền card chức năng, hay thay thế bất kỳ tông nào trong hệ 60/30/10. Không dùng cho trạng thái lỗi/cảnh báo. |
| `--color-heritage-red-deep` | `#5A1F1F` | Gradient tối ở rìa vùng Heritage, tạo chiều sâu | Không dùng độc lập, chỉ dùng trong `linear-gradient` cùng `--color-heritage-red` |
| `--color-heritage-line` | `#F6F4EE` (alias `--color-cream`) | Nét monoline của toàn bộ motif SVG trên nền Heritage | Đã là alias của `--color-cream` — không tạo thêm biến thể |

#### Độ tương phản trên nền `--color-heritage-red` (`#7B2D2D`):
- Nét / chữ `--color-heritage-line` (`#F6F4EE`): **7.2 : 1** → WCAG AAA ✅
- Nét `--color-tape` (`#F2C230`): **5.1 : 1** → WCAG AA cho text ≥ 18px / nét trang trí ✅
- Chữ `--color-ink` (`#1D2F4A`): **1.8 : 1** → ❌ CẤM — không đặt chữ mực chàm lên nền Heritage Red

### 7.2 Bộ motif SVG

Tất cả motif vẽ kiểu monoline (nét đơn đều, không fill), stroke mặc định `--color-heritage-line`, `pointer-events: none`.

| # | Tên motif | File SVG | Kích thước viewBox | Dùng cho |
|---|---|---|---|---|
| 1 | Khung góc hoa văn (Corner Ornament) | `heritage-corner.svg` | `80 × 80` | Khung 4 góc của hero section, khung thẻ xuất lookbook/result |
| 2 | Họa tiết mây-rồng viền mảnh (Dragon Frieze) | `heritage-dragon-frieze.svg` | `320 × 48` | Dải viền ngang mép dưới hero, divider trang trí trên CulturePage |
| 3 | Con dấu tròn di sản (Heritage Emblem) | `heritage-emblem.svg` | `64 × 64` | Dấu triện đóng góc thẻ xuất, header CulturePage |
| 4 | Đường viền mái đình chấm phá (Pagoda Divider) | `heritage-pagoda-divider.svg` | `600 × 40` | Thay `<hr>` giữa phần lịch sử trên GarmentDetailPage và CulturePage |
| 5 | Hoa văn nền lặp (Seamless Pattern) | `heritage-pattern-tile.svg` | `64 × 64` | Background texture cho vùng Heritage, opacity 0.12–0.18 |

### 7.3 Quy tắc phân bổ theo trang

| Trang | Motif được phép | Vùng cụ thể | Ghi chú |
|---|---|---|---|
| `HomePage` | Corner, Frieze, Pattern | **Chỉ** hero banner | Dưới hero → giấy can gốc, không Heritage |
| `CulturePage` | Corner, Emblem, Pagoda Divider, Pattern | Toàn trang (trang văn hóa chuyên sâu) | Trang được phép dùng Heritage rộng nhất |
| `LookbookPage` | Corner, Emblem | **Chỉ** khung thẻ xuất (export/share card) | Grid duyệt → không Heritage |
| `ResultPage` | Corner, Emblem | **Chỉ** khung outfit cuối cùng | Bảng điểm, Thước Remix → không Heritage |
| `GarmentDetailPage` | Pagoda Divider | **Chỉ** divider phần lịch sử | Giữ trang sạch nội dung |
| `RemixStudioPage` | ❌ | — | Không gian chức năng thuần bàn thợ may |
| `ExplorePage` | ❌ | — | Giao diện duyệt tìm chức năng |
| `Navigation` / Footer | ❌ | — | Luôn trung tính |

### 7.4 Nguyên tắc kỹ thuật

1. **Cách ly khỏi 60/30/10**: Heritage Layer có class riêng `.heritage-zone`. Bên ngoài `.heritage-zone`, không element nào được dùng `--color-heritage-*` hay bất kỳ motif SVG Heritage nào.
2. **Không tranh Hero Vàng thước**: Trong `.heritage-zone`, nếu có nút CTA thì nút vẫn dùng `--color-tape` + chữ `--color-ink` như bình thường — Vàng thước vẫn là điểm sáng hành động duy nhất, nổi bật trên nền đỏ mận.
3. **Accessibility**: Motif SVG đều có `role="presentation"` và `aria-hidden="true"`. Chữ trên nền Heritage Red chỉ dùng `--color-heritage-line` hoặc `--color-tape` (tương phản ≥ 5.1:1).
4. **Responsive**: Corner Ornament co bằng `clamp(48px, 6vw, 96px)`. Dragon Frieze và Pagoda Divider ẩn chi tiết nhỏ dưới 640px viewport bằng `@media` hoặc giảm `opacity` về `0.5`.
5. **`prefers-reduced-motion`**: Nếu Heritage motif có animation (ví dụ fade-in khi scroll), tắt ngay khi `prefers-reduced-motion: reduce`.
