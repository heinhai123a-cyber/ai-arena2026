import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Copy,
  Check,
  Trophy,
  Sparkles,
  Star,
  X,
  Heart,
  Send,
  GraduationCap,
  Compass,
  Shirt,
} from 'lucide-react';
import { LotusLogo } from './LotusLogo';
import { HeritageOrnament } from './heritage/HeritageOrnament';
import { HeritagePattern } from './heritage/HeritagePattern';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Feedback form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('ui_ux');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const contactEmail = '25020855@vnu.edu.vn';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFeedbackOpen) {
        setIsFeedbackOpen(false);
      }
    };
    if (isFeedbackOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFeedbackOpen]);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('trinova_feedbacks') || '[]');
        const newFeedback = {
          id: Date.now().toString(),
          name: name.trim() || 'Người dùng ẩn danh',
          email: email.trim(),
          category,
          rating,
          comment: comment.trim(),
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('trinova_feedbacks', JSON.stringify([newFeedback, ...existing]));
      } catch (err) {
        console.warn('Could not save feedback to localStorage:', err);
      }
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const resetFeedbackForm = () => {
    setName('');
    setEmail('');
    setCategory('ui_ux');
    setRating(5);
    setComment('');
    setSubmitted(false);
  };

  const categories = [
    { id: 'ui_ux', label: 'Trải nghiệm & Giao diện' },
    { id: 'cultural', label: 'Độ chuẩn xác văn hóa' },
    { id: 'ai_try_on', label: 'Tính năng AI Try-On' },
    { id: 'features', label: 'Đề xuất tính năng mới' },
    { id: 'other', label: 'Góp ý khác' },
  ];

  return (
    <>
      <footer className="footer-heritage" role="contentinfo">
        {/* Ambient Heritage Pattern Layer */}
        <HeritagePattern opacity={0.07} className="footer-pattern-ambient" />

        {/* Top Skyline / Arch Ornament Transition */}
        <div className="footer-top-transition" aria-hidden="true">
          <HeritageOrnament variant="divider" className="footer-skyline-ornament" />
          <div className="footer-top-glow-line" />
        </div>

        <div className="container footer-content-wrapper">
          {/* ── Top Bar: Brand, Team & Compact Action ── */}
          <div className="footer-top-bar">
            <div className="footer-brand-group">
              <LotusLogo size={28} />
              <div className="footer-brand-info">
                <div className="footer-brand-title-row">
                  <span className="footer-brand-name">Việt Phục Remix</span>
                  <span className="footer-arena-pill">
                    <Trophy size={11} className="champ-trophy-icon" />
                    BẢN CHÍNH THỨC AI ARENA 2026
                  </span>
                </div>
                <p className="footer-brand-tagline">
                  Giao Thoa Cổ Phục Hoàng Triều & Trí Tuệ Nhân Tạo Gen Z
                </p>
              </div>
            </div>

            <div className="footer-team-quick">
              <div className="footer-team-capsule">
                <span className="footer-team-lbl">Đội thi:</span>
                <strong className="footer-team-val">TriNova</strong>
                <span className="footer-school-mini">
                  <GraduationCap size={13} />
                  <span>UET — VNU Hà Nội</span>
                </span>
              </div>

              <button
                type="button"
                className="footer-feedback-btn-compact"
                onClick={() => {
                  resetFeedbackForm();
                  setIsFeedbackOpen(true);
                }}
                title="Gửi ý kiến đóng góp cho đội thi TriNova"
              >
                <Sparkles size={13} />
                <span>Góp ý cùng TriNova</span>
              </button>
            </div>
          </div>

          {/* ── Main Content: 4 Compact Columns ── */}
          <div className="footer-main-grid">
            {/* Col 1: Giới thiệu & Sứ mệnh */}
            <div className="footer-col">
              <h4 className="footer-col-title">Về Dự Án & Sứ Mệnh</h4>
              <p className="footer-col-desc">
                Sáng tạo công nghệ AI tôn vinh và làm sống dậy nét đẹp trang phục truyền thống Việt Nam, kết nối di sản ngàn năm với nhịp sống hiện đại.
              </p>
              <p className="footer-col-subdesc">
                Mỗi góc nhìn từ bạn là viên ngọc quý giúp đội thi TriNova tiếp tục hoàn thiện sản phẩm tại đấu trường AI ARENA 2026.
              </p>
            </div>

            {/* Col 2: Bốn Dáng Cổ Phục */}
            <div className="footer-col">
              <h4 className="footer-col-title">
                <Shirt size={14} />
                Bốn Dáng Cổ Phục
              </h4>
              <ul className="footer-link-list">
                <li>
                  <Link to="/garments/ao-dai">
                    <span className="link-bullet">✦</span>
                    <span>Áo Dài Hoàng Cung</span>
                  </Link>
                </li>
                <li>
                  <Link to="/garments/ao-ngu-than">
                    <span className="link-bullet">✦</span>
                    <span>Áo Ngũ Thân Lập Lĩnh</span>
                  </Link>
                </li>
                <li>
                  <Link to="/garments/ao-tu-than">
                    <span className="link-bullet">✦</span>
                    <span>Áo Tứ Thân Kinh Bắc</span>
                  </Link>
                </li>
                <li>
                  <Link to="/garments/ao-ba-ba">
                    <span className="link-bullet">✦</span>
                    <span>Áo Bà Ba Nam Bộ</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Tính Năng & Khảo Cứu */}
            <div className="footer-col">
              <h4 className="footer-col-title">
                <Compass size={14} />
                Tính Năng & Khảo Cứu
              </h4>
              <ul className="footer-link-list">
                <li>
                  <Link to="/remix">
                    <span className="link-bullet">✦</span>
                    <span>Xưởng may Remix Studio</span>
                  </Link>
                </li>
                <li>
                  <Link to="/ai-try-on">
                    <span className="link-bullet">✦</span>
                    <span>Thử đồ thông minh AI</span>
                  </Link>
                </li>
                <li>
                  <Link to="/culture">
                    <span className="link-bullet">✦</span>
                    <span>Chuyện chiếc áo di sản</span>
                  </Link>
                </li>
                <li>
                  <Link to="/lookbook">
                    <span className="link-bullet">✦</span>
                    <span>Lookbook phong cách đã lưu</span>
                  </Link>
                </li>
                <li>
                  <Link to="/sources">
                    <span className="link-bullet">✦</span>
                    <span>Nguồn khảo cứu & Đối chiếu</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Liên Hệ & Trao Đổi */}
            <div className="footer-col">
              <h4 className="footer-col-title">
                <Mail size={14} />
                Thông Tin Liên Hệ
              </h4>
              <p className="footer-col-desc">
                Sẵn sàng trao đổi chuyên môn, hợp tác và lắng nghe phản hồi từ ban giám khảo cùng quý khán giả:
              </p>

              <div className="footer-email-box">
                <a
                  href={`mailto:${contactEmail}`}
                  className="footer-email-text"
                  title="Gửi email tới đội thi TriNova"
                >
                  <span>{contactEmail}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="footer-copy-btn"
                  title="Sao chép địa chỉ email"
                  aria-label="Sao chép địa chỉ email"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-gold-bright" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>

              <div className="footer-school-text">
                <GraduationCap size={13} />
                <span>Trường Đại học Công nghệ (UET) — ĐHQGHN</span>
              </div>
            </div>
          </div>

          {/* ── Bottom Royal Bar ── */}
          <div className="footer-bottom-royal">
            <div className="bottom-royal-left">
              <span>© 2026 <strong>TriNova</strong> · Bản chính thức <strong>AI ARENA 2026</strong>.</span>
            </div>

            <div className="bottom-royal-center">
              <span className="royal-motto">✦ HÀO KHÍ DI SẢN · SÁNG TẠO TƯƠNG LAI ✦</span>
            </div>

            <div className="bottom-royal-right">
              <span>
                Liên hệ: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════
          FEEDBACK MODAL DIALOG — ROYAL SILK EDITION
          ══════════════════════════════════════════════ */}
      {isFeedbackOpen && (
        <div
          className="feedback-modal-overlay"
          onClick={() => setIsFeedbackOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-dialog-title"
        >
          <div
            className="feedback-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="feedback-modal-header">
              <div className="feedback-modal-header-left">
                <div className="feedback-icon-badge">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 id="feedback-dialog-title" className="feedback-modal-title">
                    Gửi Ý Kiến Đóng Góp
                  </h3>
                  <p className="feedback-modal-subtitle">
                    Dành cho đội thi <strong>TriNova</strong> — Cuộc thi <strong>AI ARENA 2026</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="feedback-modal-close"
                onClick={() => setIsFeedbackOpen(false)}
                aria-label="Đóng biểu mẫu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            {submitted ? (
              <div className="feedback-success-state">
                <div className="feedback-success-icon">
                  <Heart size={36} />
                </div>
                <h4 className="feedback-success-title">
                  Cảm Ơn Bạn Rất Nhiều!
                </h4>
                <p className="feedback-success-desc">
                  Ý kiến đóng góp quý báu của bạn đã được ghi nhận thành công. Đội thi <strong>TriNova</strong> sẽ nghiêm túc nghiên cứu và hoàn thiện sản phẩm tốt hơn cho đấu trường <strong>AI ARENA 2026</strong>!
                </p>
                <div className="feedback-success-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetFeedbackForm}
                  >
                    Gửi thêm góp ý khác
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setIsFeedbackOpen(false)}
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="feedback-form">
                {/* Chủ đề góp ý */}
                <div className="feedback-field">
                  <label className="feedback-label">Chủ đề đóng góp:</label>
                  <div className="feedback-categories-wrap">
                    {categories.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        className={`feedback-category-chip ${category === c.id ? 'active' : ''}`}
                        onClick={() => setCategory(c.id)}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Đánh giá sao */}
                <div className="feedback-field">
                  <label className="feedback-label">Mức độ hài lòng / Đánh giá trải nghiệm:</label>
                  <div className="feedback-rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className="feedback-star-btn"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        aria-label={`${star} sao`}
                      >
                        <Star
                          size={24}
                          className={
                            star <= (hoverRating || rating)
                              ? 'star-filled'
                              : 'star-empty'
                          }
                        />
                      </button>
                    ))}
                    <span className="feedback-rating-hint">
                      {rating === 5 && 'Tuyệt vời & Rất ấn tượng!'}
                      {rating === 4 && 'Rất tốt & Hài hòa'}
                      {rating === 3 && 'Tương đối tốt, cần thêm điểm nhấn'}
                      {rating === 2 && 'Cần cải thiện'}
                      {rating === 1 && 'Chưa ưng ý'}
                    </span>
                  </div>
                </div>

                {/* Họ tên & Email */}
                <div className="feedback-form-row">
                  <div className="feedback-field">
                    <label htmlFor="fb-name" className="feedback-label">
                      Họ và tên / Biệt danh <span className="text-muted">(tùy chọn)</span>:
                    </label>
                    <input
                      id="fb-name"
                      type="text"
                      className="feedback-input"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="feedback-field">
                    <label htmlFor="fb-email" className="feedback-label">
                      Email của bạn <span className="text-muted">(tùy chọn)</span>:
                    </label>
                    <input
                      id="fb-email"
                      type="email"
                      className="feedback-input"
                      placeholder="Để TriNova gửi lời cảm ơn/phản hồi"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Nội dung ý kiến */}
                <div className="feedback-field">
                  <label htmlFor="fb-comment" className="feedback-label">
                    Nội dung ý kiến đóng góp <span className="required-mark">*</span>:
                  </label>
                  <textarea
                    id="fb-comment"
                    className="feedback-textarea"
                    rows={4}
                    required
                    placeholder="Hãy chia sẻ cảm nhận của bạn, tính năng bạn muốn thấy thêm hoặc góc nhìn văn hóa bạn muốn TriNova bổ sung..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                {/* Direct mail hint */}
                <div className="feedback-direct-note">
                  <span>Bạn cũng có thể gửi thư trực tiếp tới hòm thư của đội thi: </span>
                  <a href={`mailto:${contactEmail}`} className="feedback-direct-link">
                    {contactEmail}
                  </a>
                </div>

                {/* Actions */}
                <div className="feedback-modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsFeedbackOpen(false)}
                    disabled={submitting}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary feedback-submit-btn"
                    disabled={submitting || !comment.trim()}
                  >
                    {submitting ? (
                      <span>Đang gửi...</span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Gửi ý kiến đóng góp</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
