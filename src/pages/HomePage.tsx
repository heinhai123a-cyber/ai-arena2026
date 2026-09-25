import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Scissors, BookOpen, Share2, Palette } from 'lucide-react';
import { OutfitMiniVis } from '../components/OutfitVisualization';
import { garments } from '../content/garments';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const HomePage: React.FC = () => {
  useDocumentTitle();
  const navigate = useNavigate();

  const handleTryDemo = () => {
    // Navigate to remix with demo state pre-filled
    navigate('/remix?demo=true');
  };

  return (
    <div className="page">
      {/* ── HERO ── */}
      <section style={{ padding: 'var(--space-16) 0 var(--space-20)', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="two-col" style={{ alignItems: 'center' }}>
            <div className="animate-fadeInUp">
              <span style={{
                display: 'inline-block',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-wide)',
                color: 'var(--color-tape-dark)',
                marginBottom: 'var(--space-4)',
                padding: '4px 12px',
                background: 'var(--color-tape-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(242, 194, 48, 0.4)',
              }}>
                Bàn thợ may Gen Z · Phối trang phục Việt theo dịp
              </span>
              <h1 className="display-xl mb-6" style={{ maxWidth: 540 }}>
                Việt phục,<br />
                <span style={{ color: 'var(--color-ink-secondary)' }}>theo cách của bạn.</span>
              </h1>
              <p className="body-lg text-muted mb-8" style={{ maxWidth: 480 }}>
                Khám phá trang phục truyền thống Việt Nam, phối trang phục theo dịp với Thước Remix — sáng tạo hiện đại nhưng tôn trọng bối cảnh và giá trị văn hóa.
              </p>
              <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                <button onClick={handleTryDemo} className="btn btn-primary btn-lg" aria-label="Bắt đầu phối outfit tại Studio">
                  Bắt đầu phối outfit
                  <ArrowRight size={18} />
                </button>
                <Link to="/explore" className="btn btn-secondary btn-lg">
                  Khám phá 4 dáng áo
                </Link>
              </div>
              <div className="flex gap-3" style={{ marginTop: 'var(--space-8)' }}>
                <span className="tag">Áo dài</span>
                <span className="tag">Tết</span>
                <span className="tag">Tối giản</span>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="animate-fadeInUp stagger-2" style={{
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
                maxWidth: 360,
                width: '100%',
                position: 'relative',
                border: '1px solid var(--color-silver-light)',
              }}>
                <OutfitMiniVis garment="ao-dai" colors={['ivory', 'burgundy']} />
                <div style={{
                  position: 'absolute',
                  bottom: 'var(--space-5)',
                  left: 'var(--space-5)',
                  right: 'var(--space-5)',
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--color-silver-light)',
                }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>Modern Tết</p>
                      <p className="caption">Áo dài · Tối giản · Cách tân</p>
                    </div>
                    <span className="badge badge-gold">70%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: 'var(--color-white)' }}>
        <div className="container">
          <div className="section-header">
            <span className="label section-label" style={{ color: 'var(--color-tape-dark)' }}>Cách hoạt động</span>
            <h2 className="display-md">Bốn bước đơn giản</h2>
          </div>
          <div className="grid-4">
            {[
              { step: '01', title: 'Chọn', desc: 'Chọn trang phục, dịp, và phong cách.', icon: <Scissors size={22} /> },
              { step: '02', title: 'Remix', desc: 'Điều chỉnh mức độ cách tân với Thước Remix.', icon: <Palette size={22} /> },
              { step: '03', title: 'Hiểu', desc: 'Đọc câu chuyện và bối cảnh văn hóa.', icon: <BookOpen size={22} /> },
              { step: '04', title: 'Chia sẻ', desc: 'Lưu vào Lookbook và chia sẻ.', icon: <Share2 size={22} /> },
            ].map((item, i) => (
              <div key={i} className={`animate-fadeInUp stagger-${i + 1}`} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-paper)',
                  color: 'var(--color-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  border: '1px solid var(--color-silver-light)',
                }}>
                  {item.icon}
                </div>
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-tape-dark)',
                  letterSpacing: 'var(--tracking-wide)',
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                }}>
                  {item.step}
                </span>
                <h3 className="heading-sm mb-2">{item.title}</h3>
                <p className="body-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING LOOKS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="label section-label" style={{ color: 'var(--color-tape-dark)' }}>Xu hướng</span>
            <h2 className="display-md">Look được yêu thích</h2>
          </div>
          <div className="grid-3">
            {[
              { garment: 'ao-dai' as const, title: 'Vintage Kỷ yếu', preset: 'van_nghe_clb__ao_dai_cach_tan', tags: ['Áo dài', 'Vintage', 'Kỷ yếu'], colors: ['cream', 'burgundy'] as const, remix: 55 },
              { garment: 'ao-ba-ba' as const, title: 'Streetwear Saigon', preset: 'streetwear_saigon__ao_ba_ba', tags: ['Áo bà ba', 'Streetwear', 'Check-in'], colors: ['black', 'earth-tone'] as const, remix: 80 },
              { garment: 'ao-tu-than' as const, title: 'Bắc Bộ Lễ hội', preset: 'bac_bo_le_hoi__ao_tu_than', tags: ['Áo tứ thân', 'Thanh lịch', 'Lễ hội'], colors: ['burgundy', 'cream'] as const, remix: 25 },
            ].map((look, i) => (
              <div
                key={i}
                className={`card animate-fadeInUp stagger-${i + 1}`}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/remix?preset=${look.preset}`)}
                role="button"
                tabIndex={0}
                aria-label={`Xem look: ${look.title}`}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/remix?preset=${look.preset}`)}
              >
                <div style={{
                  aspectRatio: '3/4',
                  background: 'var(--color-cream)',
                  padding: 'var(--space-4)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <OutfitMiniVis garment={look.garment} colors={[...look.colors]} />
                  <div style={{
                    position: 'absolute',
                    top: 'var(--space-3)',
                    right: 'var(--space-3)',
                  }}>
                    <span className="badge badge-gold">{look.remix}%</span>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="heading-sm mb-2">{look.title}</h3>
                  <div className="flex gap-2 flex-wrap">
                    {look.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KHÁM PHÁ VIỆT PHỤC ── */}
      <section className="section" style={{ background: 'var(--color-white)' }}>
        <div className="container">
          <div className="section-header">
            <span className="label section-label" style={{ color: 'var(--color-tape-dark)' }}>Bộ sưu tập</span>
            <h2 className="display-md mb-4">Khám phá Việt phục</h2>
            <p className="body-lg text-muted" style={{ maxWidth: 560 }}>
              Bốn nhóm trang phục truyền thống, mỗi bộ mang một câu chuyện và đặc trưng riêng.
            </p>
          </div>
          <div className="grid-2">
            {garments.map((g, i) => (
              <Link
                key={g.id}
                to={`/garments/${g.id}`}
                className={`card animate-fadeInUp stagger-${i + 1}`}
                style={{ display: 'flex', overflow: 'hidden' }}
              >
                <div style={{
                  width: 140,
                  minHeight: 180,
                  background: 'var(--color-cream)',
                  padding: 'var(--space-2)',
                  flexShrink: 0,
                }}>
                  <OutfitMiniVis garment={g.id} colors={['ivory', 'burgundy']} />
                </div>
                <div className="card-body" style={{ flex: 1 }}>
                  <h3 className="heading-md mb-2">{g.name}</h3>
                  <p className="body-sm text-muted mb-4">{g.shortDescription}</p>
                  <div className="flex gap-2 flex-wrap">
                    {g.region.map(r => (
                      <span key={r} className="badge">{r === 'bac-bo' ? 'Bắc Bộ' : r === 'trung-bo' ? 'Trung Bộ' : 'Nam Bộ'}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHUYỆN CHIẾC ÁO PREVIEW ── */}
      <section className="section">
        <div className="container">
          <div className="two-col" style={{ alignItems: 'center' }}>
            <div>
              <span className="label section-label" style={{ color: 'var(--color-tape-dark)' }}>
                Văn hóa
              </span>
              <h2 className="display-md mb-4">Chuyện chiếc áo</h2>
              <p className="body-lg text-muted mb-6" style={{ maxWidth: 440 }}>
                Mỗi trang phục mang một câu chuyện. Hiểu bối cảnh giúp bạn phối đồ tự tin hơn — và tôn trọng giá trị văn hóa đằng sau mỗi chiếc áo.
              </p>
              <div className="story-card" style={{ maxWidth: 440 }}>
                <div className="story-card-header">
                  <h3 className="heading-sm">Áo dài</h3>
                </div>
                <div className="story-card-body">
                  <div className="story-card-section">
                    <p className="story-card-section-title">Bối cảnh</p>
                    <p className="body-sm">Áo dài phát triển qua nhiều giai đoạn lịch sử, gắn liền với hình ảnh Việt Nam.</p>
                  </div>
                  <div className="story-card-section">
                    <p className="story-card-section-title">Lưu ý khi remix</p>
                    <p className="body-sm">Giữ cấu trúc hai tà và phom dáng dài để trang phục vẫn được nhận diện.</p>
                  </div>
                </div>
                <div className="story-card-footer">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-yellow">Bản nháp — chờ thẩm định</span>
                    <Link to="/culture" className="btn btn-ghost btn-sm">Đọc thêm</Link>
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                maxWidth: 300,
                width: '100%',
                border: '1px solid var(--color-silver-light)',
              }}>
                <OutfitMiniVis garment="ao-ngu-than" colors={['navy', 'cream']} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA CUỐI ── */}
      <section className="section" style={{
        background: 'var(--color-ink)',
        color: 'var(--color-white)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Measuring tape accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'var(--color-tape)',
          pointerEvents: 'none',
        }} />
        <div className="container text-center">
          <h2 className="display-lg mb-4" style={{ color: 'var(--color-white)' }}>
            Sẵn sàng thử?
          </h2>
          <p className="body-lg mb-8" style={{ opacity: 0.7, maxWidth: 480, margin: '0 auto var(--space-8)' }}>
            Tạo bộ outfit Việt phục đầu tiên — chỉ mất vài phút.
          </p>
          <button onClick={handleTryDemo} className="btn btn-lg" style={{
            background: 'var(--color-tape)',
            color: 'var(--color-ink)',
            fontWeight: 700,
          }}>
            Thử demo ngay
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 'var(--space-1)' }}>
                Việt Phục Remix
              </p>
              <p className="caption">Bản demo — không phải sản phẩm chính thức</p>
            </div>
            <div className="flex gap-4">
              <Link to="/sources" className="nav-link" style={{ fontSize: 'var(--text-sm)' }}>Nguồn tham khảo</Link>
              <Link to="/culture" className="nav-link" style={{ fontSize: 'var(--text-sm)' }}>Về văn hóa</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
