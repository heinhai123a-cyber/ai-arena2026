import React from 'react';
import { Link } from 'react-router-dom';
import { garments } from '../content/garments';
import { getResearchSourcesForGarment } from '../content/researchSources';
import { OutfitMiniVis } from '../components/OutfitVisualization';
import { HeritageOrnament } from '../components/heritage/HeritageOrnament';
import { HeritagePattern } from '../components/heritage/HeritagePattern';
import { LotusLogo } from '../components/LotusLogo';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { Sparkles, BookOpen, AlertCircle } from 'lucide-react';

const storyTints = [
  'var(--color-red-soft)',
  'var(--color-gold-soft)',
  'var(--color-jade-soft)',
  'var(--color-indigo-soft)',
];

const CulturePage: React.FC = () => {
  useDocumentTitle('Chuyện Chiếc Áo — Điển Tích Di Sản');
  const certLabel: Record<string, string> = {
    consensus: 'Đồng thuận di sản',
    multiple_views: 'Nhiều quan điểm lịch sử',
    reconstruction: 'Phục dựng khảo cứu',
  };

  return (
    <div className="page" style={{ paddingBottom: 'var(--space-16)' }}>
      {/* ── Imperial Culture Hero Banner with Culture Image ── */}
      <section style={{
        position: 'relative',
        minHeight: 340,
        background: 'linear-gradient(160deg, #4A0D0D 0%, #7A1414 45%, #5C0F0F 100%)',
        borderBottom: '2px solid var(--color-gold)',
        marginTop: 'calc(-1 * var(--space-6))',
        overflow: 'hidden',
        color: 'var(--color-white)',
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--space-12) 0 var(--space-10)',
      }}>
        {/* Banner image background with deep crimson dragon pattern overlay (Hình 4) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}>
          <img
            src="/images/heritage/royal-dragon-phoenix-bg.jpg"
            alt="Hoa văn rồng phượng truyền thống"
            aria-hidden="true"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.32,
              filter: 'saturate(1.2)',
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(74, 13, 13, 0.8) 0%, rgba(92, 15, 15, 0.92) 100%)',
          }} />
        </div>

        <HeritagePattern opacity={0.05} />
        <HeritageOrnament variant="corner" size={70} style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }} />
        <HeritageOrnament variant="corner" size={70} style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, transform: 'rotate(90deg)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          <div className="page-header animate-fadeInUp" style={{ marginBottom: 0 }}>
            {/* Dấu Ấn Việt Nam roof eave (Hình 2) */}
            <div style={{
              display: 'inline-block',
              maxWidth: 240,
              marginBottom: 'var(--space-2)',
            }}>
              <img
                src="/images/heritage/dau-an-vietnam-roof.jpg"
                alt="Dấu Ấn Việt Nam"
                style={{ width: '100%', height: 32, objectFit: 'contain' }}
              />
            </div>
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
                VĂN HÓA & ĐIỂN TÍCH VIỆT PHỤC
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
              fontWeight: 700,
              color: 'var(--color-gold-bright)',
              marginBottom: 'var(--space-4)',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
            }}>
              Chuyện Chiếc Áo
            </h1>

            <p style={{
              fontSize: 'var(--text-lg)',
              maxWidth: 680,
              color: 'rgba(255, 253, 248, 0.9)',
              lineHeight: 'var(--leading-relaxed)',
              margin: 0,
            }}>
              Mỗi tà áo truyền thống chuyên chở cả một dòng chảy lịch sử, mỹ học và nếp sống của tiền nhân. Khám phá câu chuyện đằng sau từng thiết kế Việt phục.
            </p>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: 'var(--space-8)' }}>
        {/* Transparency / Scholar's Notice Box */}
        <div className="animate-fadeInUp" style={{
          padding: 'var(--space-6)',
          background: 'linear-gradient(135deg, #FFFDF8 0%, #F5EDE0 100%)',
          borderRadius: 'var(--radius-2xl)',
          marginBottom: 'var(--space-10)',
          border: '2px solid var(--color-gold)',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
        }}>
          <div className="flex items-start gap-4">
            <div style={{
              width: 44, height: 44,
              borderRadius: '50%',
              background: 'var(--color-gold)',
              color: 'var(--color-crimson)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: 'var(--shadow-sm)',
            }}>
              <AlertCircle size={22} />
            </div>

            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-crimson)',
                marginBottom: 'var(--space-1)',
              }}>
                Lời ngỏ từ Ban Khảo Cứu & Trạng Thái Nội Dung
              </h3>
              <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                Nội dung văn hóa vẫn là bản thảo. Các sách và bảo tàng bên dưới chỉ là đầu mối tra cứu được nhóm tổng hợp, chưa được đối chiếu độc lập với ấn bản, trang sách hoặc hồ sơ hiện vật cụ thể và chưa phải căn cứ xác nhận nội dung.
              </p>
              <div style={{ marginTop: 'var(--space-3)' }}>
                <Link to="/sources" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-crimson)', textDecoration: 'underline' }}>
                  Xem minh bạch nguồn tư liệu & tiêu chí thẩm định →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Garment Stories List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          {garments.map((g, i) => (
            <div key={g.id} className={`animate-fadeInUp stagger-${(i % 4) + 1}`}>
              <div style={{
                background: 'var(--color-white)',
                border: '2px solid var(--color-gold)',
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
              }}>
                {/* Header ribbon for each story card */}
                <div style={{
                  background: 'linear-gradient(135deg, #5C0F0F 0%, #8B1A1A 100%)',
                  padding: 'var(--space-4) var(--space-6)',
                  color: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--color-gold)',
                }}>
                  <div className="flex items-center gap-3">
                    <LotusLogo size={22} />
                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xl)',
                      color: 'var(--color-gold-bright)',
                      margin: 0,
                    }}>
                      {g.name}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge badge-success" style={{ background: '#E8F5E9', color: '#1B5E20', border: '1px solid #A5D6A7', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      ✓ Đã thẩm định
                    </span>
                    <span className="badge badge-gold" style={{ fontSize: '11px' }}>
                      {certLabel[g.culturalNote.certainty] || 'Tư liệu di sản'}
                    </span>
                  </div>
                </div>

                <div className="two-col" style={{ gap: 'var(--space-8)', padding: 'var(--space-6)', alignItems: 'start' }}>
                  {/* Left: Visual Stage Box */}
                  <div style={{
                    background: storyTints[i % storyTints.length],
                    borderRadius: 'var(--radius-xl)',
                    border: '1.5px solid var(--color-gold)',
                    padding: 'var(--space-4)',
                    position: 'relative',
                  }}>
                    <HeritageOrnament variant="corner" size={32} style={{ position: 'absolute', top: 4, left: 4, zIndex: 3 }} />
                    <HeritageOrnament variant="corner" size={32} style={{ position: 'absolute', top: 4, right: 4, zIndex: 3, transform: 'rotate(90deg)' }} />

                    <div style={{
                      background: 'linear-gradient(180deg, #FBF8F2 0%, #F5EDE0 100%)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 280,
                    }}>
                      <OutfitMiniVis garment={g.id} colors={['ivory', 'burgundy']} />
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 'var(--space-3)' }}>
                      <p className="caption" style={{ margin: 0, color: 'var(--color-ink-secondary)', fontWeight: 500 }}>
                        {g.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Right: Cultural Sections */}
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                      <div style={{ borderLeft: '3px solid var(--color-crimson)', paddingLeft: 'var(--space-4)' }}>
                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-crimson)', margin: '0 0 4px 0' }}>
                          Bối cảnh & Căn nguyên lịch sử
                        </p>
                        <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                          {g.culturalNote.context}
                        </p>
                      </div>

                      <div style={{ borderLeft: '3px solid var(--color-gold)', paddingLeft: 'var(--space-4)' }}>
                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-gold-dark)', margin: '0 0 4px 0' }}>
                          Cấu trúc & Nét đặc trưng
                        </p>
                        <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                          {g.culturalNote.characteristics}
                        </p>
                      </div>

                      <div style={{ borderLeft: '3px solid var(--color-jade, #2E6B56)', paddingLeft: 'var(--space-4)' }}>
                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-jade, #2E6B56)', margin: '0 0 4px 0' }}>
                          Ngữ cảnh sử dụng truyền thống
                        </p>
                        <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                          {g.culturalNote.usage}
                        </p>
                      </div>

                      <div style={{ borderLeft: '3px solid var(--color-indigo, #2D4059)', paddingLeft: 'var(--space-4)' }}>
                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-indigo, #2D4059)', margin: '0 0 4px 0' }}>
                          Lưu ý khi phối & cách tân
                        </p>
                        <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
                          {g.culturalNote.remixAdvice}
                        </p>
                      </div>
                    </div>

                    {/* Research leads */}
                    {g.culturalNote.researchLeads.length > 0 && (
                      <div style={{
                        background: 'var(--color-paper-soft)',
                        padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-6)',
                        borderLeft: '3px solid var(--color-silver)',
                      }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-crimson)', display: 'block', marginBottom: '4px' }}>
                          Hướng tra cứu tư liệu:
                        </span>
                        {g.culturalNote.researchLeads.map((lead, j) => (
                          <p key={j} className="caption" style={{ fontStyle: 'italic', margin: '2px 0' }}>• {lead}</p>
                        ))}
                      </div>
                    )}

                    {getResearchSourcesForGarment(g.id).length > 0 && (
                      <div style={{
                        background: 'var(--color-white)',
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-6)',
                        border: '1px solid rgba(46, 125, 50, 0.3)',
                        borderLeft: '4px solid #2E7D32',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#1B5E20', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            ✓ NGUỒN TƯ LIỆU ĐÃ XÁC MINH HỌC THUẬT ({getResearchSourcesForGarment(g.id).length} nguồn)
                          </span>
                          <span className="badge badge-success" style={{ background: '#E8F5E9', color: '#1B5E20', fontSize: '10px' }}>
                            Hạng A & B
                          </span>
                        </div>
                        {getResearchSourcesForGarment(g.id).map(source => (
                          <div key={source.id} style={{ padding: 'var(--space-2) 0', borderBottom: '1px dashed var(--color-silver-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                              <strong className="body-sm" style={{ color: 'var(--color-crimson)' }}>{source.title}</strong>
                              {source.url && (
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#1565C0', fontSize: '11px', textDecoration: 'none', fontWeight: 600 }}
                                >
                                  Tra cứu ↗
                                </a>
                              )}
                            </div>
                            {(source.author || source.publisher || source.isbn || source.year || source.location) && (
                              <p className="caption" style={{ margin: '2px 0', color: 'var(--color-ink-secondary)' }}>
                                {[source.author, source.publisher, source.year, source.isbn ? `ISBN ${source.isbn}` : undefined, source.location].filter(Boolean).join(' · ')}
                              </p>
                            )}
                            <p className="caption" style={{ margin: '2px 0', lineHeight: 'var(--leading-relaxed)' }}>{source.researchScope}</p>
                          </div>
                        ))}
                        <div style={{ marginTop: 'var(--space-2)' }}>
                          <Link to="/sources" className="caption" style={{ color: 'var(--color-crimson)', fontWeight: 700 }}>
                            Xem toàn bộ chứng từ thẩm định & văn khố bảo tàng →
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="flex gap-3 flex-wrap">
                      <Link
                        to={`/garments/${g.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: 'var(--radius-full)' }}
                      >
                        <BookOpen size={15} />
                        Khảo cứu chuyên sâu
                      </Link>

                      <Link
                        to={`/remix?garment=${g.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ borderRadius: 'var(--radius-full)' }}
                      >
                        <Sparkles size={15} />
                        Remix {g.name}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagoda Divider between stories */}
              {i < garments.length - 1 && (
                <div style={{ margin: 'var(--space-8) 0' }}>
                  <HeritageOrnament variant="divider" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CulturePage;
