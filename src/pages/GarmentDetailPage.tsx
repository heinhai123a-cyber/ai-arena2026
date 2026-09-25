import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Info } from 'lucide-react';
import { garments } from '../content/garments';
import { OutfitVisualization } from '../components/OutfitVisualization';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { GarmentId } from '../types';

const GarmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const garment = garments.find(g => g.id === id);
  useDocumentTitle(garment ? garment.name : 'Trang phục');

  if (!garment) {
    return (
      <div className="page">
        <div className="container text-center" style={{ padding: 'var(--space-20) 0' }}>
          <h1 className="display-md mb-4">Không tìm thấy trang phục</h1>
          <p className="text-muted mb-6">Trang phục bạn tìm không tồn tại.</p>
          <Link to="/explore" className="btn btn-primary">Khám phá Việt phục</Link>
        </div>
      </div>
    );
  }

  const regionNames: Record<string, string> = {
    'bac-bo': 'Bắc Bộ',
    'trung-bo': 'Trung Bộ — Huế',
    'nam-bo': 'Nam Bộ',
  };

  const certLabel: Record<string, string> = {
    consensus: 'Đồng thuận chung',
    multiple_views: 'Nhiều quan điểm',
    reconstruction: 'Phục dựng',
  };

  return (
    <div className="page">
      <div className="container">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost mb-6"
          aria-label="Quay lại"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>

        {/* Hero */}
        <div className="two-col animate-fadeInUp" style={{ marginBottom: 'var(--space-16)' }}>
          <div style={{
            background: 'var(--color-cream)',
            border: '1px solid var(--color-silver)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-8)',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <OutfitVisualization
              garment={garment.id as GarmentId}
              primaryColor="ivory"
              secondaryColor="burgundy"
              remixLevel={30}
              size="lg"
            />
          </div>

          <div>
            <span className="label mb-3" style={{ display: 'block', color: 'var(--color-tape-dark)' }}>
              Trang phục
            </span>
            <h1 className="display-lg mb-4">{garment.name}</h1>
            <p className="body-lg text-muted mb-6">{garment.description}</p>

            {/* Metadata */}
            <div className="flex gap-4 flex-wrap mb-6">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-muted" />
                <span className="body-sm">{garment.region.map(r => regionNames[r]).join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted" />
                <span className="body-sm">{garment.typicalOccasions.length} dịp phổ biến</span>
              </div>
            </div>

            <Link
              to={`/remix?garment=${garment.id}`}
              className="btn btn-primary btn-lg"
            >
              Remix look này
            </Link>
          </div>
        </div>

        {/* Sections */}
        <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto' }}>
          {/* 01 — Đặc điểm */}
          <section className="mb-12 animate-fadeInUp">
            <span className="label mb-2" style={{ display: 'block' }}>01 — Đặc điểm</span>
            <h2 className="heading-lg mb-4">Đặc điểm nhận diện</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {garment.characteristics.map((c, i) => (
                <li key={i} className="body-sm" style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--color-burgundy)',
                }}>
                  {c}
                </li>
              ))}
            </ul>
          </section>

          {/* 02 — Thành phần */}
          <section className="mb-12 animate-fadeInUp">
            <span className="label mb-2" style={{ display: 'block' }}>02 — Thành phần</span>
            <h2 className="heading-lg mb-4">Các thành phần chính</h2>
            <div className="flex gap-3 flex-wrap">
              {garment.components.map(c => (
                <span key={c} className="badge badge-burgundy" style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}>
                  {c}
                </span>
              ))}
            </div>
          </section>

          {/* 03 — Khi nào thường mặc */}
          <section className="mb-12 animate-fadeInUp">
            <span className="label mb-2" style={{ display: 'block' }}>03 — Khi nào thường mặc</span>
            <h2 className="heading-lg mb-4">Dịp sử dụng phổ biến</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {garment.typicalOccasions.map((o, i) => (
                <div key={i} className="flex items-center gap-3 body-sm" style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: i % 2 === 0 ? 'var(--color-white)' : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <Calendar size={14} className="text-muted" />
                  {o}
                </div>
              ))}
            </div>
          </section>

          {/* 04 — Gợi ý phối */}
          <section className="mb-12 animate-fadeInUp">
            <span className="label mb-2" style={{ display: 'block' }}>04 — Gợi ý phối</span>
            <h2 className="heading-lg mb-4">Lưu ý khi remix</h2>
            <div style={{
              padding: 'var(--space-6)',
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-warm-gray-lighter)',
            }}>
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} style={{ color: 'var(--color-gold)' }} />
                <span className="heading-sm" style={{ fontSize: 'var(--text-sm)' }}>Gợi ý</span>
              </div>
              <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)' }}>
                {garment.remixNotes}
              </p>
            </div>
          </section>

          {/* 05 — Chuyện chiếc áo */}
          <section className="mb-12 animate-fadeInUp">
            <span className="label mb-2" style={{ display: 'block' }}>05 — Chuyện chiếc áo</span>
            <div className="story-card">
              <div className="story-card-header">
                <h2 className="heading-lg">{garment.name}</h2>
              </div>
              <div className="story-card-body">
                <div className="story-card-section">
                  <p className="story-card-section-title">Bối cảnh</p>
                  <p className="body-sm">{garment.culturalNote.context}</p>
                </div>
                <div className="story-card-section">
                  <p className="story-card-section-title">Đặc điểm</p>
                  <p className="body-sm">{garment.culturalNote.characteristics}</p>
                </div>
                <div className="story-card-section">
                  <p className="story-card-section-title">Ngữ cảnh sử dụng</p>
                  <p className="body-sm">{garment.culturalNote.usage}</p>
                </div>
                <div className="story-card-section">
                  <p className="story-card-section-title">Lưu ý khi remix</p>
                  <p className="body-sm">{garment.culturalNote.remixAdvice}</p>
                </div>
              </div>
              <div className="story-card-footer">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <div className="flex items-center justify-between">
                    <span className="caption">Nguồn</span>
                    <span className="caption">{garment.culturalNote.sources.length === 0 ? 'Chưa có nguồn chính thức' : `${garment.culturalNote.sources.length} nguồn`}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="caption">Độ chắc chắn</span>
                    <span className="badge badge-gold" style={{ fontSize: '10px' }}>
                      {certLabel[garment.culturalNote.certainty]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="caption">Trạng thái</span>
                    <span className="badge badge-yellow" style={{ fontSize: '10px' }}>
                      Bản nháp — chờ thẩm định
                    </span>
                  </div>
                  {garment.culturalNote.researchLeads.length > 0 && (
                    <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-warm-gray-lighter)' }}>
                      <span className="caption" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Hướng tra cứu:</span>
                      {garment.culturalNote.researchLeads.map((lead, i) => (
                        <p key={i} className="caption" style={{ fontStyle: 'italic' }}>• {lead}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GarmentDetailPage;
