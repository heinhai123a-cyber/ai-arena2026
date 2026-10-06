# 01 — Concept

> Tài liệu này mô tả định hướng sản phẩm Việt Phục Remix.
> Mọi giả thuyết về người dùng chưa được kiểm chứng bằng khảo sát thực tế.

---

## User Problem (Giả thuyết)

Nhiều bạn trẻ Việt Nam muốn mặc trang phục truyền thống cho các dịp quan trọng (Tết, khai giảng, kỷ yếu), nhưng gặp khó khăn khi:

- Không biết trang phục nào phù hợp với dịp gì
- Không biết cách phối phụ kiện
- Không tự tin về mức độ "cách tân" có thể áp dụng
- Thiếu thông tin ngữ cảnh văn hóa để hiểu ý nghĩa trang phục

*Đây là giả thuyết của nhóm — chưa được xác nhận bằng khảo sát.*

---

## JTBD (Jobs To Be Done)

Khi có một sự kiện sắp tới, tôi muốn biết nên mặc gì và phối thế nào để hợp dịp, có cá tính, tự tin đăng ảnh, mà không bị hiểu lầm là làm sai lệch văn hóa.

---

## Personas (Giả thuyết — chưa được khảo sát)

### P1 — Học sinh THPT

- Chuẩn bị chụp kỷ yếu, muốn mặc áo dài hoặc áo tứ thân
- Không chắc nên remix đến mức nào
- Muốn trang phục vừa truyền thống, vừa "chụp ảnh đẹp"

### P2 — Sinh viên đại học

- Quan tâm đến Việt phục, muốn tìm hiểu thêm
- Thích kết hợp trang phục truyền thống với phong cách cá nhân
- Cần thông tin để giải thích cho bạn bè

### P3 — Người muốn mặc Tết

- Muốn mặc đẹp, phù hợp ngày Tết
- Không chắc màu sắc nào phù hợp
- Muốn tránh các phối đồ "không ổn" về văn hóa

*Tất cả personas là giả thuyết của nhóm, chưa được xác nhận.*

---

## Scope

### In Scope

- 4 nhóm trang phục: Áo dài, Áo ngũ thân, Áo tứ thân, Áo bà ba
- 6 dịp: Khai giảng, Kỷ yếu, Tết, Lễ hội, Check-in di sản, Văn nghệ
- 3 vùng miền: Bắc Bộ, Trung Bộ — Huế, Nam Bộ
- 4 phong cách: Thanh lịch, Streetwear, Vintage, Tối giản
- Core outfit flow runs client-side with no AI API calls.
- Optional AI Try-On uses a Node API proxy and Cloudflare Workers AI image editing; it requires user consent and internet access.

### Out of Scope (hiện tại)

- Trang phục dân tộc thiểu số
- Trang phục cung đình lịch sử (giao lĩnh, áo tấc, nhật bình)
- User accounts and database
- Social features
- Marketplace

---

## Lộ trình (Dự kiến)

### Y1 — Demo / Validation

- MVP hoàn chỉnh (Phase 1–4)
- User testing đầu tiên
- Tìm nguồn học thuật cho content

### Y2 — Content

- Thẩm định nội dung với chuyên gia
- Mở rộng garment catalog
- So sánh outfit

### Y3 — Platform

- Backend (nếu cần)
- User accounts (nếu cần)
- Mở rộng phạm vi trang phục

### Y4 — Community

- Đóng góp nội dung từ cộng đồng
- Tích hợp với tổ chức văn hóa

---

## Three Differentiators

1. **Cultural transparency**: Rõ ràng về độ chắc chắn, nguồn, trạng thái dữ liệu
2. **Context-aware suggestions**: Gợi ý theo dịp, vùng miền, phong cách — không phải quy tắc cứng nhắc
3. **Remix framing**: Thay vì "đúng / sai", cung cấp ngữ cảnh để người dùng tự quyết định

---

## Limitations

- Tất cả cultural notes là bản nháp (draft), chưa có nguồn học thuật
- Không có reviewer thật
- SVG minh họa đơn giản, chưa phản ánh chính xác chi tiết trang phục
- Outfit generation là heuristic, không phải AI
- Chưa test với người dùng thật
