# PROPOSED RULES

> File này ghi lại các quy tắc VĂN HÓA ĐỀ XUẤT nhưng CHƯA được đưa vào rules.json.
> Mọi rule trong file này đều ở trạng thái CHỜ CON NGƯỜI DUYỆT.
> AI KHÔNG được tự thêm vào hệ thống validation mà không qua review.

---

## PR-01: Áo ngũ thân không phù hợp cho check-in du lịch thông thường

**Rule đề xuất:**
Áo ngũ thân nguyên bản (mức remix <= 33) ở dịp "Check-in di sản" nên được đánh yellow.

**Điều kiện:**
- garment: ao-ngu-than
- event: di-san
- remixLevel: <= 33

**Vấn đề:**
Hiện tại rule `ngu-than-casual` đã bao gồm `di-san`, nhưng giải thích chưa đủ rõ tại sao áo ngũ thân nguyên bản có thể trang trọng quá mức cho một buổi tham quan thông thường.

**Lý do cần xem xét:**
Áo ngũ thân thường gắn với nghi lễ. Mặc khi tham quan di tích thông thường là chấp nhận được nhưng cần thêm ngữ cảnh.

**Nguồn cần tìm:**
Quy định trang phục tại các điểm di sản Việt Nam; Tài liệu về áo ngũ thân trong bối cảnh hiện đại.

**Trạng thái:** CHỜ CON NGƯỜI DUYỆT

---

## PR-02: Khăn rằn với áo tứ thân

**Rule đề xuất:**
Khăn rằn (đặc trưng miền Nam) kết hợp với áo tứ thân (đặc trưng miền Bắc) ở mức Nguyên bản nên được đánh yellow.

**Điều kiện:**
- garment: ao-tu-than
- accessories: includes 'khan' (variant: khan-ran)
- remixLevel: <= 33

**Vấn đề:**
Hệ thống hiện tại không phân biệt loại khăn (mỏ quạ vs rằn). Phối khăn rằn với áo tứ thân nguyên bản có thể gây nhầm lẫn vùng miền.

**Lý do cần xem xét:**
Khăn rằn đặc trưng miền Nam, khăn mỏ quạ đặc trưng miền Bắc. Hệ thống hiện chỉ check có/không có `khan`, chưa phân loại variant.

**Nguồn cần tìm:**
Phân biệt phụ kiện trang phục Bắc — Nam; Tài liệu về khăn rằn trong văn hóa Nam Bộ.

**Trạng thái:** CHỜ CON NGƯỜI DUYỆT

---

## PR-03: Áo dài với giày sneaker ở dịp lễ hội / đình chùa

**Rule đề xuất:**
Áo dài kết hợp sneaker ở dịp lễ hội/đình chùa (mức remix <= 50) có thể cần thêm ghi chú văn hóa.

**Điều kiện:**
- garment: ao-dai
- accessories: includes 'giay' (variant: sneaker)
- event: le-hoi
- remixLevel: <= 50

**Vấn đề:**
Tùy bối cảnh (đình chùa tâm linh vs lễ hội giải trí), sneaker có thể phù hợp hoặc không. Hệ thống chưa phân biệt.

**Lý do cần xem xét:**
Một số không gian tâm linh có yêu cầu riêng về trang phục mà hệ thống hiện tại không xử lý được.

**Nguồn cần tìm:**
Quy định trang phục tại đình, chùa, miếu; Phân biệt lễ hội tâm linh và lễ hội văn hóa.

**Trạng thái:** CHỜ CON NGƯỜI DUYỆT
