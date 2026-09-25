# QUICK START — VIỆT PHỤC REMIX

Chào mừng bạn đến với **Việt Phục Remix** — Bàn thợ may Gen Z phối trang phục truyền thống theo dịp.

---

## 1. Cài đặt (Installation)

Yêu cầu môi trường: **Node.js 18+** và **npm**.

```bash
# Cài đặt dependencies (khoảng 15-30 giây)
npm install
```

---

## 2. Khởi chạy cục bộ (Run locally)

```bash
# Chạy server phát triển
npm run dev
```

Mở trình duyệt tại: **http://localhost:5173/**

---

## 3. Thử nghiệm Demo nhanh (Quick Demo)

1. Từ **Trang chủ** (`#/`), nhấn **"Bắt đầu phối outfit"**.
2. Chọn **Áo dài** → Dịp **Tết** → Phong cách **Tối giản** → Bảng màu **Ivory & Burgundy**.
3. Rê thanh **Thước Remix** đến mức **Cách tân (50%)** → Nhấn **"Xem kết quả outfit"**.
4. Khám phá **Cultural Light** (Đèn văn hóa), điểm **Hài hòa màu sắc**, đọc **Chuyện chiếc áo**, và nhấn **"Xuất thẻ outfit"** (chọn tỷ lệ 4:5 hoặc 9:16).

---

## 4. Kiểm thử & Thẩm định (Verification Commands)

```bash
npm run validate:content   # Kiểm tra schema văn hóa & tính nhất quán dữ liệu
npm run typecheck          # Kiểm tra kiểu TypeScript (0 lỗi)
npm run lint               # Linter siêu tốc oxlint (0 cảnh báo)
npm test                   # Chạy toàn bộ 19 bài test tự động
```

---

## 5. Đóng gói sản phẩm (Production Build)

```bash
# Đóng gói tối ưu hóa cho static hosting
npm run build

# Xem thử bản đóng gói thành phẩm
npm run preview
```

Trang xem trước thành phẩm chạy tại: **http://localhost:4173/**
