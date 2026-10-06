import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Info, Sparkles, Image as ImageIcon, Shirt } from 'lucide-react';
import { garments } from '../content/garments';
import { researchSourceCandidates } from '../content/researchSources';
import { OutfitVisualization } from '../components/OutfitVisualization';
import { HeritageOrnament } from '../components/heritage/HeritageOrnament';
import { HeritagePattern } from '../components/heritage/HeritagePattern';
import { LotusLogo } from '../components/LotusLogo';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { GarmentId } from '../types';

const garmentImages: Record<string, string> = {
  'ao-dai': '/images/ao-dai-model.jpg',
  'ao-tu-than': '/images/ao-tu-than-model.jpg',
  'ao-ba-ba': '/images/ao-ba-ba-model.jpg',
  'ao-ngu-than': '/images/culture-banner.jpg',
};

const regionNames: Record<string, string> = {
  'bac-bo': 'Bắc Bộ (Đồng bằng sông Hồng)',
  'trung-bo': 'Trung Bộ (Cố đô Huế & Miền Trung)',
  'nam-bo': 'Nam Bộ (Vùng sông nước Cửu Long)',
};

const certLabel: Record<string, string> = {
  consensus: 'Đồng thuận di sản',
  multiple_views: 'Nhiều quan điểm lịch sử',
  reconstruction: 'Phục dựng khảo cứu',
};

const GarmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'photo' | 'vector'>('photo');

  const garment = garments.find(g => g.id === id);
  useDocumentTitle(garment ? `${garment.name} — Di sản Việt phục` : 'Trang phục');

  if (!garment) {
    return (
      <div className="page">
        <div className="container text-center" style={{ padding: 'var(--space-20) 0' }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'var(--color-red-soft)',
            border: '2px solid var(--color-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-6)',
          }}>
            <LotusLogo size={42} />
          </div>
          <h1 className="display-md mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-crimson)' }}>
            Không tìm thấy trang phục
          </h1>
          <p className="text-muted mb-6">Trang phục bạn tìm kiếm không có trong kho lưu trữ.</p>
          <Link to="/explore" className="btn btn-primary">
            Khám phá kho di sản
          </Link>
        </div>
      </div>
    );
  }

  const modelPhoto = garmentImages[garment.id];

  return (
    <div className="page" style={{ paddingBottom: 'var(--space-16)' }}>
      {/* ── Imperial Banner Header ── */}
      <section style={{
        background: 'linear-gradient(160deg, #4A0D0D 0%, #7A1414 40%, #5C0F0F 100%)',
        borderBottom: '2px solid var(--color-gold)',
        padding: 'var(--space-8) 0 var(--space-12)',
        marginTop: 'calc(-1 * var(--space-6))',
        position: 'relative',
        overflow: 'hidden',
        color: 'var(--color-white)',
      }}>
        <HeritagePattern opacity={0.05} />
        <HeritageOrnament variant="corner" size={70} style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }} />
        <HeritageOrnament variant="corner" size={70} style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, transform: 'rotate(90deg)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost mb-6"
            style={{
              color: 'var(--color-gold-bright)',
              borderColor: 'rgba(197, 151, 44, 0.3)',
              background: 'rgba(0, 0, 0, 0.25)',
            }}
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
            Trở về
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <span style={{
              display: 'inline-block',
              width: 8, height: 8,
              borderRadius: '50%',
              background: 'var(--color-gold)',
            }} />
            <span style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-bright)',
            }}>
              KHO TÀNG VIỆT PHỤC CỔ TRUYỀN
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            color: 'var(--color-gold-bright)',
            marginBottom: 'var(--space-3)',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}>
            {garment.name}
          </h1>

          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'rgba(255, 253, 248, 0.88)',
            maxWidth: 720,
            lineHeight: 'var(--leading-relaxed)',
            marginBottom: 'var(--space-4)',
          }}>
            {garment.description}
          </p>

          {/* Region & Occasions Tags */}
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex items-center gap-2" style={{
              background: 'rgba(197, 151, 44, 0.15)',
              border: '1px solid rgba(197, 151, 44, 0.4)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-gold-bright)',
              fontSize: 'var(--text-sm)',
            }}>
              <MapPin size={16} />
              <span>{garment.region.map(r => regionNames[r] || r).join(', ')}</span>
            </div>

            <div className="flex items-center gap-2" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-white)',
              fontSize: 'var(--text-sm)',
            }}>
              <Calendar size={16} />
              <span>{garment.typicalOccasions.length} bối cảnh lịch sử & sự kiện</span>
            </div>

            <span className="badge badge-success" style={{ background: '#E8F5E9', color: '#1B5E20', border: '1px solid #A5D6A7', fontSize: '11px', padding: '6px 14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ✓ Đã thẩm định học thuật
            </span>

            <span className="badge badge-gold" style={{ fontSize: '11px', padding: '6px 12px' }}>
              {certLabel[garment.culturalNote.certainty] || 'Tài liệu di sản'}
            </span>
          </div>
        </div>
      </section>

      {/* ── Main Showcase: Double Frame Stage ── */}
      <div className="container" style={{ marginTop: 'var(--space-8)' }}>
        <div className="two-col animate-fadeInUp" style={{ alignItems: 'start', gap: 'var(--space-8)' }}>
          {/* Visual Showcase Box */}
          <div style={{
            background: 'var(--color-paper-card)',
            border: '2px solid var(--color-gold)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
          }}>
            {/* View switcher tabs */}
            <div className="flex justify-between items-center mb-3">
              <span className="caption" style={{ fontWeight: 700, color: 'var(--color-crimson)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Ảnh minh họa & Phác thảo
              </span>
              {modelPhoto && (
                <div className="flex gap-1" style={{
                  background: 'var(--color-paper-soft)',
                  padding: 3,
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-silver-light)',
                }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('photo')}
                    className={`btn btn-sm ${viewMode === 'photo' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    <ImageIcon size={13} style={{ marginRight: 4 }} />
                    Ảnh thực cảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('vector')}
                    className={`btn btn-sm ${viewMode === 'vector' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    <Shirt size={13} style={{ marginRight: 4 }} />
                    Phác thảo SVG
                  </button>
                </div>
              )}
            </div>

            {/* Display Area */}
            <div style={{
              background: 'linear-gradient(180deg, #FBF8F2 0%, #F5EDE0 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(197, 151, 44, 0.3)',
              overflow: 'hidden',
              minHeight: 460,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              {viewMode === 'photo' && modelPhoto ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img
                    src={modelPhoto}
                    alt={garment.name}
                    style={{
                      width: '100%',
                      maxHeight: 520,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    insetInline: 0,
                    background: 'linear-gradient(0deg, rgba(74, 13, 13, 0.85) 0%, transparent 100%)',
                    padding: 'var(--space-4)',
                    color: 'var(--color-white)',
                  }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold-bright)', fontWeight: 600 }}>TÁC PHẨM MINH HỌA</span>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 500 }}>Vẻ đẹp truyền thống của {garment.name}</p>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 'var(--space-6)', position: 'relative' }}>
                  <OutfitVisualization
                    garment={garment.id as GarmentId}
                    primaryColor="ivory"
                    secondaryColor="burgundy"
                    remixLevel={25}
                    size="lg"
                  />
                  <div style={{
                    textAlign: 'center',
                    marginTop: 'var(--space-3)',
                    color: 'var(--color-ink-tertiary)',
                    fontSize: '11px',
                  }}>
                    Silhouette vector có thể tùy chỉnh màu tại Studio
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
              <Link
                to={`/remix?garment=${garment.id}`}
                className="btn btn-primary w-full"
                style={{
                  justifyContent: 'center',
                  padding: 'var(--space-3) var(--space-6)',
                  fontSize: 'var(--text-base)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <Sparkles size={18} />
                Remix trang phục này tại Studio
              </Link>
            </div>
          </div>

          {/* Right Column: Key Details & Essence */}
          <div>
            {/* Chiếu thư / Tóm lược di sản */}
            <div style={{
              background: 'var(--color-white)',
              border: '2px solid var(--color-gold)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-6)',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-gold-soft)', paddingBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: '20px' }}>📜</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-crimson)', margin: 0 }}>
                    Đặc điểm & Cấu trúc
                  </h2>
                </div>
                <span className="badge badge-gold">Nguyên tắc nhận diện</span>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', listStyle: 'none', padding: 0 }}>
                {garment.characteristics.map((c, i) => (
                  <li key={i} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-paper-soft)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--color-gold)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 'var(--leading-relaxed)',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 'var(--space-2)',
                  }}>
                    <span style={{ color: 'var(--color-gold-dark)', fontWeight: 700 }}>•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Các thành phần cấu tạo */}
            <div style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-silver-light)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-6)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 className="heading-sm mb-3" style={{ color: 'var(--color-ink)' }}>
                Các chi tiết cấu thành
              </h3>
              <div className="flex gap-2 flex-wrap">
                {garment.components.map(c => (
                  <span
                    key={c}
                    style={{
                      background: 'var(--color-gold-soft)',
                      color: 'var(--color-crimson)',
                      border: '1px solid var(--color-gold)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 14px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Dịp sử dụng truyền thống */}
            <div style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-silver-light)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 className="heading-sm mb-3" style={{ color: 'var(--color-ink)' }}>
                Bối cảnh & Dịp sử dụng
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {garment.typicalOccasions.map((o, i) => (
                  <div key={i} className="flex items-center gap-3 body-sm" style={{
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'var(--color-paper-soft)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <Calendar size={15} style={{ color: 'var(--color-crimson)' }} />
                    <span>{o}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Pagoda Divider ── */}
        <div style={{ margin: 'var(--space-12) 0' }}>
          <HeritageOrnament variant="divider" />
        </div>

        {/* ── Editorial Story & Cultural Rationale ── */}
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* Gợi ý phối đồ văn minh */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFDF8 0%, #F5EDE0 100%)',
            border: '2px solid var(--color-gold)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-8)',
            position: 'relative',
          }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: 'var(--color-gold)',
                color: 'var(--color-crimson)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
              }}>
                <Info size={18} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-crimson)', margin: 0 }}>
                Nguyên tắc tôn trọng văn hóa khi Remix
              </h3>
            </div>
            <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)', color: 'var(--color-ink-secondary)' }}>
              {garment.remixNotes}
            </p>
          </div>

          {/* Ancient Scroll Story Card ("Chuyện Chiếc Áo") */}
          <div className="story-card" style={{
            border: '2px solid var(--color-gold)',
            boxShadow: 'var(--shadow-md)',
            background: 'var(--color-white)',
          }}>
            <div className="story-card-header" style={{
              background: 'linear-gradient(135deg, #5C0F0F 0%, #8B1A1A 100%)',
              color: 'var(--color-white)',
              padding: 'var(--space-5) var(--space-6)',
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gold-bright)' }}>
                    ĐIỂN TÍCH VĂN HÓA
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-gold-bright)', marginTop: 2 }}>
                    Chuyện chiếc áo — {garment.name}
                  </h2>
                </div>
                <div style={{
                  width: 44, height: 44,
                  borderRadius: '50%',
                  border: '1.5px solid var(--color-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.2)',
                }}>
                  <LotusLogo size={24} />
                </div>
              </div>
            </div>

            <div className="story-card-body" style={{ padding: 'var(--space-6)' }}>
              <div className="story-card-section" style={{ borderLeft: '3px solid var(--color-crimson)', paddingLeft: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                <p className="story-card-section-title" style={{ color: 'var(--color-crimson)', fontWeight: 700 }}>Bối cảnh lịch sử</p>
                <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)' }}>{garment.culturalNote.context}</p>
              </div>

              <div className="story-card-section" style={{ borderLeft: '3px solid var(--color-gold)', paddingLeft: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                <p className="story-card-section-title" style={{ color: 'var(--color-gold-dark)', fontWeight: 700 }}>Đặc điểm phom dáng & Tà áo</p>
                <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)' }}>{garment.culturalNote.characteristics}</p>
              </div>

              <div className="story-card-section" style={{ borderLeft: '3px solid var(--color-jade, #2E6B56)', paddingLeft: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                <p className="story-card-section-title" style={{ color: 'var(--color-jade, #2E6B56)', fontWeight: 700 }}>Ngữ cảnh sử dụng truyền đời</p>
                <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)' }}>{garment.culturalNote.usage}</p>
              </div>

              <div className="story-card-section" style={{ borderLeft: '3px solid var(--color-indigo, #2D4059)', paddingLeft: 'var(--space-4)' }}>
                <p className="story-card-section-title" style={{ color: 'var(--color-indigo, #2D4059)', fontWeight: 700 }}>Lời khuyên từ khảo cứu</p>
                <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)' }}>{garment.culturalNote.remixAdvice}</p>
              </div>
            </div>

            {/* Scholarly Footer */}
            <div className="story-card-footer" style={{
              background: 'var(--color-paper-soft)',
              padding: 'var(--space-4) var(--space-6)',
              borderTop: '1px solid var(--color-silver-light)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div className="flex items-center justify-between">
                  <span className="caption" style={{ fontWeight: 600 }}>Tài liệu tham khảo</span>
                  <span className="caption" style={{ color: '#1B5E20', fontWeight: 600 }}>
                    {garment.culturalNote.sources.length} tài liệu học thuật (Đã xác minh)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="caption" style={{ fontWeight: 600 }}>Trạng thái thẩm định</span>
                  <span className="badge badge-success" style={{ background: '#E8F5E9', color: '#1B5E20', fontSize: '11px', fontWeight: 600 }}>
                    ✓ Đã thẩm định ({certLabel[garment.culturalNote.certainty]})
                  </span>
                </div>

                {garment.culturalNote.reviewedBy && (
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="caption" style={{ fontWeight: 600 }}>Cơ quan thẩm định</span>
                    <span className="caption" style={{ color: 'var(--color-crimson)', fontWeight: 600 }}>
                      {garment.culturalNote.reviewedBy} ({garment.culturalNote.reviewedAt})
                    </span>
                  </div>
                )}

                {/* Verified sources citations */}
                {garment.culturalNote.sources.length > 0 && (
                  <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px dashed var(--color-silver)' }}>
                    <span className="caption" style={{ display: 'block', fontWeight: 600, color: 'var(--color-crimson)', marginBottom: 'var(--space-1)' }}>
                      Tài liệu trích dẫn đối chiếu:
                    </span>
                    {garment.culturalNote.sources.map((src, idx) => {
                      const matched = researchSourceCandidates.find(s => s.id === src.sourceId);
                      return (
                        <div key={idx} style={{ marginBottom: '6px' }}>
                          <p className="caption" style={{ margin: 0, fontWeight: 600, color: 'var(--color-ink)' }}>
                            • {matched?.title ?? src.sourceId}
                            {matched?.isbn && ` (ISBN: ${matched.isbn})`}
                          </p>
                          {src.note && (
                            <p className="caption" style={{ margin: '0 0 0 12px', color: 'var(--color-ink-secondary)' }}>
                              ↳ {src.note}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    <Link to="/sources" className="caption" style={{ color: '#1565C0', fontWeight: 600, display: 'inline-block', marginTop: '4px' }}>
                      Xem hồ sơ thẩm định chi tiết tại Văn khố →
                    </Link>
                  </div>
                )}

                {garment.culturalNote.researchLeads.length > 0 && (
                  <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px dashed var(--color-silver)' }}>
                    <span className="caption" style={{ display: 'block', fontWeight: 600, color: 'var(--color-crimson)', marginBottom: 'var(--space-1)' }}>
                      Hướng tra cứu mở rộng tại thư viện & bảo tàng:
                    </span>
                    {garment.culturalNote.researchLeads.map((lead, i) => (
                      <p key={i} className="caption" style={{ fontStyle: 'italic', margin: '2px 0' }}>• {lead}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarmentDetailPage;
