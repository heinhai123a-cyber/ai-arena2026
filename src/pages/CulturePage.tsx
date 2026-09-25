import React from 'react';
import { Link } from 'react-router-dom';
import { garments } from '../content/garments';
import { OutfitMiniVis } from '../components/OutfitVisualization';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const CulturePage: React.FC = () => {
  useDocumentTitle('Chuyện chiếc áo');
  const certLabel: Record<string, string> = {
    consensus: 'Đồng thuận chung',
    multiple_views: 'Nhiều quan điểm',
    reconstruction: 'Phục dựng',
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header animate-fadeInUp">
          <span className="label mb-3" style={{ display: 'block', color: 'var(--color-tape-dark)' }}>
            Văn hóa
          </span>
          <h1 className="display-lg mb-4">Chuyện chiếc áo</h1>
          <p className="body-lg text-muted" style={{ maxWidth: 600 }}>
            Mỗi trang phục truyền thống mang một câu chuyện riêng. Đây là những gì chúng tôi biết — và những gì cần được kiểm chứng thêm.
          </p>
        </div>

        {/* Transparency notice */}
        <div className="animate-fadeInUp stagger-1" style={{
          padding: 'var(--space-6)',
          background: 'var(--color-warning-bg)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-12)',
          border: '1px solid rgba(184, 134, 11, 0.2)',
        }}>
          <h3 className="heading-sm mb-2" style={{ color: 'var(--color-warning)' }}>⚠️ Về nội dung văn hóa</h3>
          <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)' }}>
            Nội dung trên trang này được viết như bản nháp dựa trên hiểu biết chung.
            Tất cả đều chưa được thẩm định bởi chuyên gia hoặc đối chiếu với nguồn học thuật chính thức.
            Đây KHÔNG phải tài liệu tham khảo chính thức. Nếu bạn có kiến thức chuyên môn, rất mong nhận được góp ý.
          </p>
        </div>

        {/* Garment Stories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          {garments.map((g, i) => (
            <div key={g.id} className={`animate-fadeInUp stagger-${(i % 4) + 1}`}>
              <div className="two-col" style={{ gap: 'var(--space-8)', alignItems: 'start' }}>
                {/* Visual */}
                <div style={{
                  background: 'var(--color-cream)',
                  border: '1px solid var(--color-silver)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-6)',
                  maxWidth: 280,
                }}>
                  <OutfitMiniVis garment={g.id} colors={['ivory', 'burgundy']} />
                </div>

                {/* Story Card */}
                <div>
                  <div className="story-card">
                    <div className="story-card-header">
                      <div className="flex items-center justify-between">
                        <h2 className="heading-lg">{g.name}</h2>
                        <Link to={`/garments/${g.id}`} className="btn btn-ghost btn-sm">
                          Chi tiết →
                        </Link>
                      </div>
                      <p className="body-sm text-muted" style={{ marginTop: 'var(--space-2)' }}>
                        {g.shortDescription}
                      </p>
                    </div>

                    <div className="story-card-body">
                      <div className="story-card-section">
                        <p className="story-card-section-title">Bối cảnh</p>
                        <p className="body-sm">{g.culturalNote.context}</p>
                      </div>
                      <div className="story-card-section">
                        <p className="story-card-section-title">Đặc điểm</p>
                        <p className="body-sm">{g.culturalNote.characteristics}</p>
                      </div>
                      <div className="story-card-section">
                        <p className="story-card-section-title">Ngữ cảnh sử dụng</p>
                        <p className="body-sm">{g.culturalNote.usage}</p>
                      </div>
                      <div className="story-card-section">
                        <p className="story-card-section-title">Lưu ý khi remix</p>
                        <p className="body-sm">{g.culturalNote.remixAdvice}</p>
                      </div>
                    </div>

                    <div className="story-card-footer">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                          <span className="caption" style={{ display: 'block' }}>Nguồn</span>
                          <span className="body-sm" style={{ fontWeight: 500 }}>
                            {g.culturalNote.sources.length === 0 ? 'Chưa có nguồn (bản nháp)' : `${g.culturalNote.sources.length} nguồn`}
                          </span>
                        </div>
                        <div>
                          <span className="caption" style={{ display: 'block' }}>Độ chắc chắn</span>
                          <span className="badge badge-gold" style={{ fontSize: '10px', marginTop: 'var(--space-1)' }}>
                            {certLabel[g.culturalNote.certainty]}
                          </span>
                        </div>
                        <div>
                          <span className="caption" style={{ display: 'block' }}>Trạng thái</span>
                          <span className="badge badge-yellow" style={{ fontSize: '10px', marginTop: 'var(--space-1)' }}>
                            Bản nháp
                          </span>
                        </div>
                      </div>

                      {g.culturalNote.researchLeads.length > 0 && (
                        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-warm-gray-lighter)' }}>
                          <span className="caption" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Hướng tra cứu — chưa phải trích dẫn</span>
                          {g.culturalNote.researchLeads.map((lead, j) => (
                            <p key={j} className="caption" style={{ fontStyle: 'italic', lineHeight: 'var(--leading-relaxed)' }}>• {lead}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ marginTop: 'var(--space-4)' }}>
                    <Link to={`/remix?garment=${g.id}`} className="btn btn-secondary">
                      Remix {g.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CulturePage;
