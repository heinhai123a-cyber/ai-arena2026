import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Palette, Search, Sparkles } from 'lucide-react';
import { garments } from '../content/garments';
import { events, regions, styles } from '../content/catalog';
import { OutfitMiniVis } from '../components/OutfitVisualization';
import { HeritageOrnament } from '../components/heritage/HeritageOrnament';
import { HeritagePattern } from '../components/heritage/HeritagePattern';
import type { GarmentId, EventId, RegionId, StyleId } from '../types';
import { useDocumentTitle } from '../lib/useDocumentTitle';

type FilterMode = 'event' | 'region' | 'style';

const garmentCardTints: Record<string, string> = {
  'ao-dai': 'var(--color-red-soft)',
  'ao-ngu-than': 'var(--color-gold-soft)',
  'ao-tu-than': 'var(--color-jade-soft)',
  'ao-ba-ba': 'var(--color-indigo-soft)',
};

const ExplorePage: React.FC = () => {
  useDocumentTitle('Khám Phá Việt Phục — Di Sản Cổ Truyền');
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as FilterMode) || 'event';
  const [filterMode, setFilterMode] = useState<FilterMode>(initialMode === 'region' || initialMode === 'style' ? initialMode : 'event');
  const [selectedEvent, setSelectedEvent] = useState<EventId | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGarments = garments.filter(g => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!g.name.toLowerCase().includes(q) && !g.shortDescription.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (filterMode === 'event' && selectedEvent) {
      const event = events.find(e => e.id === selectedEvent);
      if (event && !event.suggestedGarments.includes(g.id)) return false;
    }
    if (filterMode === 'region' && selectedRegion) {
      if (!g.region.includes(selectedRegion)) return false;
    }
    return true;
  });

  const filterModes = [
    { id: 'event' as FilterMode, label: 'Theo sự kiện', icon: <Calendar size={14} /> },
    { id: 'region' as FilterMode, label: 'Theo vùng miền', icon: <MapPin size={14} /> },
    { id: 'style' as FilterMode, label: 'Theo phong cách', icon: <Palette size={14} /> },
  ];

  return (
    <div className="page" style={{ paddingBottom: 'var(--space-16)' }}>
      {/* ── Imperial Header Banner ── */}
      <section style={{
        background: 'linear-gradient(160deg, #4A0D0D 0%, #7A1414 45%, #5C0F0F 100%)',
        borderBottom: '2px solid var(--color-gold)',
        padding: 'var(--space-10) 0 var(--space-8)',
        marginTop: 'calc(-1 * var(--space-6))',
        position: 'relative',
        overflow: 'hidden',
        color: 'var(--color-white)',
        marginBottom: 'var(--space-6)',
      }}>
        {/* Full-bleed golden dragon pattern background (Hình 4) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}>
          <img
            src="/images/heritage/royal-dragon-phoenix-bg.jpg"
            alt="Hoa văn rồng phượng hoàng triều"
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
            background: 'linear-gradient(160deg, rgba(74,13,13,0.85) 0%, rgba(122,20,20,0.75) 45%, rgba(60,8,8,0.92) 100%)',
          }} />
        </div>

        <HeritagePattern opacity={0.05} />
        <HeritageOrnament variant="corner" size={60} style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }} />
        <HeritageOrnament variant="corner" size={60} style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, transform: 'rotate(90deg)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          <div className="page-header animate-fadeInUp" style={{ marginBottom: 'var(--space-6)' }}>
            {/* Dấu Ấn Việt Nam roof eave motif (Hình 2) */}
            <div style={{
              display: 'inline-block',
              maxWidth: 260,
              marginBottom: 'var(--space-2)',
            }}>
              <img
                src="/images/heritage/dau-an-vietnam-roof.jpg"
                alt="Dấu Ấn Việt Nam"
                style={{ width: '100%', height: 32, objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
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
                DANH MỤC VIỆT PHỤC TRUYỀN THỐNG
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              color: 'var(--color-gold-bright)',
              margin: '0 0 var(--space-3) 0',
            }}>
              Khám Phá Việt Phục
            </h1>

            <p style={{
              fontSize: 'var(--text-base)',
              color: 'rgba(255, 253, 248, 0.9)',
              maxWidth: 540,
              lineHeight: 'var(--leading-relaxed)',
              margin: 0,
            }}>
              Tìm trang phục phù hợp theo dịp lễ tiết, cội nguồn vùng miền hoặc cá tính nghệ thuật của bạn.
            </p>
          </div>

          {/* Search Box */}
          <div className="animate-fadeInUp stagger-1" style={{ maxWidth: 480 }}>
            <div style={{ position: 'relative' }}>
              <input
                type="search"
                placeholder="Tìm kiếm: Áo dài, Tết, Bắc Bộ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Tìm kiếm trang phục"
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-5)',
                  paddingLeft: 'var(--space-10)',
                  border: '1.5px solid var(--color-gold)',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-white)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  boxShadow: 'var(--shadow-md)',
                }}
              />
              <span style={{
                position: 'absolute',
                left: 'var(--space-4)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-crimson)',
                display: 'flex',
              }}>
                <Search size={16} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Filter Mode Tabs */}
        <div className="flex gap-2 mb-4 animate-fadeInUp stagger-2" style={{ flexWrap: 'wrap' }}>
          {filterModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                setFilterMode(mode.id);
                setSelectedEvent(null);
                setSelectedRegion(null);
                setSelectedStyle(null);
              }}
              className={`btn ${filterMode === mode.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>

        {/* Filter Selection Chips */}
        <div className="mb-8 animate-fadeInUp stagger-3">
          <div className="flex gap-2 flex-wrap">
            {filterMode === 'event' && events.map(e => (
              <button
                key={e.id}
                onClick={() => setSelectedEvent(selectedEvent === e.id ? null : e.id)}
                className={`selection-card ${selectedEvent === e.id ? 'selected' : ''}`}
                style={{
                  width: 'auto',
                  padding: 'var(--space-2) var(--space-4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  borderRadius: 'var(--radius-full)',
                  border: selectedEvent === e.id ? '1.5px solid var(--color-gold)' : '1px solid var(--color-silver-light)',
                  background: selectedEvent === e.id ? 'var(--color-gold-soft)' : 'var(--color-white)',
                }}
              >
                <span>{e.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: selectedEvent === e.id ? 'var(--color-crimson)' : 'var(--color-ink)' }}>
                  {e.name}
                </span>
              </button>
            ))}

            {filterMode === 'region' && regions.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(selectedRegion === r.id ? null : r.id)}
                className={`selection-card ${selectedRegion === r.id ? 'selected' : ''}`}
                style={{
                  width: 'auto',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  border: selectedRegion === r.id ? '1.5px solid var(--color-gold)' : '1px solid var(--color-silver-light)',
                  background: selectedRegion === r.id ? 'var(--color-gold-soft)' : 'var(--color-white)',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: selectedRegion === r.id ? 'var(--color-crimson)' : 'var(--color-ink)' }}>
                  {r.name}
                </span>
              </button>
            ))}

            {filterMode === 'style' && styles.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(selectedStyle === s.id ? null : s.id)}
                className={`selection-card ${selectedStyle === s.id ? 'selected' : ''}`}
                style={{
                  width: 'auto',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  border: selectedStyle === s.id ? '1.5px solid var(--color-gold)' : '1px solid var(--color-silver-light)',
                  background: selectedStyle === s.id ? 'var(--color-gold-soft)' : 'var(--color-white)',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: selectedStyle === s.id ? 'var(--color-crimson)' : 'var(--color-ink)' }}>
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Regional Heritage Architectural Banner (Hình 3 & Generated Sketches) ── */}
        {filterMode === 'region' && (
          <div className="animate-fadeInUp" style={{
            marginBottom: 'var(--space-8)',
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--color-gold)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 320px', maxHeight: 220, overflow: 'hidden' }}>
              <img
                src={
                  selectedRegion === 'trung-bo'
                    ? '/images/heritage/hue-citadel-red-sketch.jpg'
                    : selectedRegion === 'nam-bo'
                    ? '/images/heritage/buu-dien-saigon-sketch.jpg'
                    : '/images/heritage/van-mieu-red-sketch.jpg'
                }
                alt="Kiến trúc di sản vùng miền"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ flex: '1 1 340px', padding: 'var(--space-6)' }}>
              <span className="badge badge-yellow" style={{ marginBottom: 'var(--space-2)' }}>
                {selectedRegion === 'trung-bo' ? 'Di sản Cung đình Huế' : selectedRegion === 'nam-bo' ? 'Di sản Nam Bộ - Sài Gòn' : 'Di sản Thăng Long - Bắc Bộ'}
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-crimson)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                {selectedRegion === 'trung-bo'
                  ? 'Ngọ Môn – Cố Đô Huế'
                  : selectedRegion === 'nam-bo'
                  ? 'Bưu Điện Trung Tâm Sài Gòn'
                  : 'Văn Miếu – Quốc Tử Giám Hà Nội'}
              </h3>
              <p className="body-sm text-muted" style={{ margin: 0 }}>
                {selectedRegion === 'trung-bo'
                  ? 'Nơi bảo lưu định chế trang phục cung đình và chiếc áo ngũ thân quý phái.'
                  : selectedRegion === 'nam-bo'
                  ? 'Gắn liền với hình ảnh chiếc áo bà ba mộc mạc và phong cách đời sống phóng khoáng.'
                  : 'Không gian văn hóa đất nghìn năm, khởi sinh chiếc áo tứ thân Quan họ đằm thắm.'}
              </p>
            </div>
          </div>
        )}

        {/* Garment Grid */}
        <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
          {filteredGarments.map((g, i) => (
            <GarmentCard key={g.id} garment={g} index={i} selectedStyle={selectedStyle} selectedEvent={selectedEvent} />
          ))}
        </div>

        {filteredGarments.length === 0 && (
          <div className="text-center" style={{ padding: 'var(--space-16) 0' }}>
            <p className="heading-md mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-crimson)' }}>
              Không tìm thấy trang phục phù hợp
            </p>
            <p className="text-muted mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedEvent(null); setSelectedRegion(null); setSelectedStyle(null); }}
              className="btn btn-secondary"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Garment Card Component with Heritage Double Frame
const GarmentCard: React.FC<{
  garment: typeof garments[0];
  index: number;
  selectedStyle: StyleId | null;
  selectedEvent: EventId | null;
}> = ({ garment, index, selectedStyle, selectedEvent }) => {
  const [hovered, setHovered] = useState(false);

  const contextParts: string[] = [];
  if (selectedEvent) {
    const event = events.find(e => e.id === selectedEvent);
    if (event) contextParts.push(event.name);
  }
  if (selectedStyle) {
    const style = styles.find(s => s.id === selectedStyle);
    if (style) contextParts.push(style.name);
  }

  const remixParams = new URLSearchParams();
  remixParams.set('garment', garment.id);
  if (selectedEvent) remixParams.set('event', selectedEvent);
  if (selectedStyle) remixParams.set('style', selectedStyle);

  const tintBg = garmentCardTints[garment.id] || 'var(--color-cream-warm)';

  return (
    <div
      className={`card animate-fadeInUp stagger-${(index % 4) + 1}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 'var(--radius-2xl)',
        border: '2px solid var(--color-gold)',
        overflow: 'hidden',
        boxShadow: hovered ? '0 12px 30px rgba(197, 151, 44, 0.25)' : 'var(--shadow-md)',
        transition: 'all var(--transition-base)',
        background: 'var(--color-white)',
        position: 'relative',
      }}
    >
      {/* Corner Ornaments */}
      <HeritageOrnament variant="corner" size={32} style={{ position: 'absolute', top: 4, left: 4, zIndex: 3 }} />
      <HeritageOrnament variant="corner" size={32} style={{ position: 'absolute', top: 4, right: 4, zIndex: 3, transform: 'rotate(90deg)' }} />

      {/* Visual Top */}
      <div style={{
        aspectRatio: '16/10',
        background: tintBg,
        padding: 'var(--space-4)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform var(--transition-slow)',
          height: '100%',
        }}>
          <OutfitMiniVis garment={garment.id as GarmentId} colors={['ivory', 'burgundy']} />
        </div>

        {/* Hover overlay button */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: hovered ? 'rgba(74, 13, 13, 0.35)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-base)',
          opacity: hovered ? 1 : 0,
        }}>
          <Link
            to={`/remix?${remixParams.toString()}`}
            className="btn btn-primary"
            style={{
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-lg)',
              padding: 'var(--space-2) var(--space-6)',
            }}
          >
            <Sparkles size={16} />
            Remix look này
          </Link>
        </div>
      </div>

      {/* Content Bottom */}
      <div className="card-body" style={{ padding: 'var(--space-5)' }}>
        <Link to={`/garments/${garment.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            color: 'var(--color-crimson)',
            marginBottom: 'var(--space-2)',
          }}>
            {garment.name}
          </h3>
        </Link>

        <p className="body-sm text-muted mb-4" style={{ lineHeight: 1.5 }}>
          {garment.shortDescription}
        </p>

        {contextParts.length > 0 && (
          <p className="caption mb-3" style={{ color: 'var(--color-gold-dark)', fontWeight: 600 }}>
            Phù hợp: {contextParts.join(' · ')}
          </p>
        )}

        <div className="flex gap-2 flex-wrap mb-4">
          {garment.region.map(r => (
            <span
              key={r}
              style={{
                background: 'var(--color-gold-soft)',
                color: 'var(--color-crimson)',
                border: '1px solid var(--color-gold)',
                borderRadius: 'var(--radius-full)',
                padding: '2px 10px',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {r === 'bac-bo' ? 'Bắc Bộ' : r === 'trung-bo' ? 'Trung Bộ' : 'Nam Bộ'}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between" style={{
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--color-silver-light)',
        }}>
          <Link to={`/garments/${garment.id}`} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-crimson)', fontWeight: 600 }}>
            Tìm hiểu chi tiết →
          </Link>

          <Link to={`/remix?${remixParams.toString()}`} className="btn btn-sm btn-secondary" style={{ borderRadius: 'var(--radius-full)' }}>
            Remix
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
