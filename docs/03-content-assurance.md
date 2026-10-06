# 03 — Content Assurance

> Tài liệu này mô tả hệ thống đảm bảo chất lượng nội dung văn hóa của Việt Phục Remix.
> Phản ánh implementation thực tế tính đến Phase 4 (2026-09-25).

---

## Tổng quan

Việt Phục Remix áp dụng 4 lớp đảm bảo nội dung:

1. **Schema layer** — kiểm tra cấu trúc dữ liệu tự động
2. **Status layer** — trạng thái rõ ràng, không tự nâng cấp
3. **Transparency layer** — UI hiển thị rõ draft / in_review / reviewed
4. **Human review layer** — chuyên gia duyệt trước khi đổi sang reviewed

---

## Lớp 1: Schema

Mỗi cultural note phải có:

| Field | Type | Rule |
|-------|------|------|
| `certainty` | consensus / multiple_views / reconstruction | Bắt buộc |
| `status` | draft / in_review / reviewed | Bắt buộc |
| `viewsNote` | string | Bắt buộc khi certainty ≠ consensus |
| `reviewedBy` | string / null | null nếu chưa review |
| `reviewedAt` | string / null | null nếu chưa review |
| `sources` | SourceRef[] | [] nếu chưa có nguồn thật |
| `researchLeads` | string[] | Hướng tra cứu, không phải trích dẫn |

Validator: `npm run validate:content`

---

## Lớp 2: Review Status Rules

### DRAFT

Luôn hợp lệ. Tất cả content hiện tại là draft.

### IN_REVIEW

Chỉ hợp lệ khi:
- >= 2 nguồn độc lập
- Ít nhất 1 nguồn hạng A hoặc B

### REVIEWED

Chỉ hợp lệ khi:
- Điều kiện IN_REVIEW đã đạt
- `reviewedBy` ≠ null (tên người thật)
- `reviewedAt` ≠ null (ngày thật)
- Reviewer là người khác người soạn

AI KHÔNG được tự chuyển status lên REVIEWED.

---

## Lớp 3: Source Grading

| Grade | Loại |
|-------|------|
| A | Bảo tàng, trung tâm bảo tồn, viện nghiên cứu, sách chuyên khảo |
| B | Nghệ nhân, nhà nghiên cứu, CLB phục dựng có dẫn tư liệu |
| C | Báo chí, nguồn bổ trợ |

Không nâng hạng nguồn chỉ vì trông đáng tin.

---

## Lớp 4: Certainty

| Level | Dùng khi |
|-------|----------|
| consensus | Nội dung có cơ sở thống nhất rộng rãi |
| multiple_views | Tồn tại nhiều cách lý giải |
| reconstruction | Có yếu tố phục dựng / diễn giải lại |

Khi certainty ≠ consensus: bắt buộc có `viewsNote`.

viewsNote phải:
- Nói rằng có nhiều cách hiểu
- Không chọn phe
- Không bịa tên trường phái hoặc học giả

---

## Review Workflow

```
DRAFT
  ↓ (tìm được >= 2 nguồn)
IN_REVIEW
  ↓ (chuyên gia đọc và duyệt)
REVIEWED
```

---

## Cultural Language Rules

**Preferred:**
- "có thể cân nhắc"
- "nên biết"
- "thường được nhắc tới"
- "phổ biến ở"
- "tùy bối cảnh"
- "theo nhiều tài liệu"

**Avoid:**
- "sai"
- "cấm"
- "không được"
- "duy nhất"
- "chắc chắn"
- "luôn luôn"

---

## Cultural vs Style vs Status — Phân biệt rõ ràng

| Khái niệm | Giá trị | Ý nghĩa |
|-----------|---------|---------|
| Cultural Light | green / yellow / red | Bối cảnh phù hợp của outfit |
| Review Status | draft / in_review / reviewed | Trạng thái thẩm định nội dung |
| Certainty | consensus / multiple_views / reconstruction | Độ chắc chắn học thuật |
| Remix Label | Nguyên bản / Cách tân / Remix mạnh | Mức độ remix |

Không được gộp các khái niệm này lại.

---

## Content Validator

Chạy: `npm run validate:content`

Kiểm tra:
- Duplicate IDs
- Schema integrity
- viewsNote presence
- Invalid review status (reviewed without reviewer)
- Absolute language (cảnh báo)
- Word count (cảnh báo)
- Broken garment references

EXIT 0 = pass, EXIT 1 = errors.

---

## Known Limitations (Phase 4)

- Tất cả 4 garment cultural notes là draft, sources = []
- Không có reviewer thật
- researchLeads là hướng tra cứu, không phải citation
- SVG visualization đơn giản
- Chưa test với người dùng thật

---

## Issue Reporting

UI "Báo sai sót" trong app:
- Lưu draft vào localStorage
- Cho phép copy text
- Không gửi network request
- Email placeholder: [EMAIL NHÓM] (chưa điền)

Sau khi có email thật: điền vào form "Báo sai sót".
