import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Palette, Search } from 'lucide-react';
import { garments } from '../content/garments';
import { events, regions, styles } from '../content/catalog';
import { OutfitMiniVis } from '../components/OutfitVisualization';
import type { GarmentId, EventId, RegionId, StyleId } from '../types';
import { useDocumentTitle } from '../lib/useDocumentTitle';

type FilterMode = 'event' | 'region' | 'style';

const ExplorePage: React.FC = () => {
  useDocumentTitle('Khám phá Việt phục');
  const [filterMode, setFilterMode] = useState<FilterMode>('event');
  const [selectedEvent, setSelectedEvent] = useState<EventId | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGarments = garments.filter(g => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!g.name.toLowerCase().includes(q) && !g.shortDescription.toLowerCase().includes(q)) {
        return false;
      }
    }

    // Mode filters
    if (filterMode === 'event' && selectedEvent) {
      const event = events.find(e => e.id === selectedEvent);
      if (event && !event.suggestedGarments.includes(g.id)) return false;
    }
    if (filterMode === 'region' && selectedRegion) {
      if (!g.region.includes(selectedRegion)) return false;
    }
    // Style filter doesn't restrict garments, all garments can be styled
    return true;
  });

  const filterModes = [
    { id: 'event' as FilterMode, label: 'Theo sự kiện', icon: <Calendar size={16} /> },
    { id: 'region' as FilterMode, label: 'Theo địa phương', icon: <MapPin size={16} /> },
    { id: 'style' as FilterMode, label: 'Theo phong cách', icon: <Palette size={16} /> },
  ];

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header animate-fadeInUp">
          <span className="label mb-3" style={{ display: 'block', color: 'var(--color-tape-dark)' }}>
            Khám phá
          </span>
          <h1 className="display-lg mb-4">Khám phá Việt phục</h1>
          <p className="body-lg text-muted" style={{ maxWidth: 560 }}>
            Tìm trang phục phù hợp theo sự kiện, vùng miền, hoặc phong cách của bạn.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 animate-fadeInUp stagger-1">
          <div style={{
            position: 'relative',
            maxWidth: 480,
          }}>
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
                border: '1px solid var(--color-silver)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-white)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                transition: 'border-color var(--transition-fast)',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-ink)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-silver)'}
            />
            <span style={{
              position: 'absolute',
              left: 'var(--space-4)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-slate)',
              display: 'flex',
            }}>
              <Search size={16} />
            </span>
          </div>
        </div>

        {/* Filter Mode Tabs */}
        <div className="flex gap-3 mb-6 animate-fadeInUp stagger-2" style={{ flexWrap: 'wrap' }}>
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
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>

        {/* Filter Options */}
        <div className="mb-8 animate-fadeInUp stagger-3">
          <div className="flex gap-2 flex-wrap">
            {filterMode === 'event' && events.map(e => (
              <button
                key={e.id}
                onClick={() => setSelectedEvent(selectedEvent === e.id ? null : e.id)}
                className={`selection-card ${selectedEvent === e.id ? 'selected' : ''}`}
                style={{
                  width: 'auto',
                  padding: 'var(--space-3) var(--space-5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <span>{e.icon}</span>
                <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{e.name}</span>
              </button>
            ))}
            {filterMode === 'region' && regions.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(selectedRegion === r.id ? null : r.id)}
                className={`selection-card ${selectedRegion === r.id ? 'selected' : ''}`}
                style={{ width: 'auto', padding: 'var(--space-3) var(--space-5)' }}
              >
                <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{r.name}</span>
              </button>
            ))}
            {filterMode === 'style' && styles.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(selectedStyle === s.id ? null : s.id)}
                className={`selection-card ${selectedStyle === s.id ? 'selected' : ''}`}
                style={{ width: 'auto', padding: 'var(--space-3) var(--space-5)' }}
              >
                <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid-2">
          {filteredGarments.map((g, i) => (
            <GarmentCard key={g.id} garment={g} index={i} selectedStyle={selectedStyle} selectedEvent={selectedEvent} />
          ))}
        </div>

        {filteredGarments.length === 0 && (
          <div className="text-center" style={{ padding: 'var(--space-16) 0' }}>
            <p className="heading-md mb-3">Không tìm thấy trang phục phù hợp</p>
            <p className="text-muted mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedEvent(null); setSelectedRegion(null); setSelectedStyle(null); }} className="btn btn-secondary">
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Garment Card Component
const GarmentCard: React.FC<{
  garment: typeof garments[0];
  index: number;
  selectedStyle: StyleId | null;
  selectedEvent: EventId | null;
}> = ({ garment, index, selectedStyle, selectedEvent }) => {
  const [hovered, setHovered] = useState(false);

  // Build context label
  const contextParts: string[] = [];
  if (selectedEvent) {
    const event = events.find(e => e.id === selectedEvent);
    if (event) contextParts.push(event.name);
  }
  if (selectedStyle) {
    const style = styles.find(s => s.id === selectedStyle);
    if (style) contextParts.push(style.name);
  }

  // Build remix link with pre-filled garment
  const remixParams = new URLSearchParams();
  remixParams.set('garment', garment.id);
  if (selectedEvent) remixParams.set('event', selectedEvent);
  if (selectedStyle) remixParams.set('style', selectedStyle);

  return (
    <div
      className={`card animate-fadeInUp stagger-${(index % 4) + 1}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow: 'hidden' }}
    >
      <div style={{
        aspectRatio: '4/3',
        background: 'var(--color-cream)',
        borderBottom: '1px solid var(--color-silver-light)',
        padding: 'var(--space-4)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform var(--transition-slow)',
          height: '100%',
        }}>
          <OutfitMiniVis garment={garment.id as GarmentId} colors={['ivory', 'burgundy']} />
        </div>
        {/* Hover CTA overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: hovered ? 'rgba(29, 47, 74, 0.25)' : 'transparent',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: 'var(--space-4)',
          transition: 'all var(--transition-base)',
          opacity: hovered ? 1 : 0,
        }}>
          <Link
            to={`/remix?${remixParams.toString()}`}
            className="btn btn-primary btn-sm"
            style={{
              transform: hovered ? 'translateY(0)' : 'translateY(10px)',
              transition: 'transform var(--transition-base)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            Remix look này
          </Link>
        </div>
      </div>
      <div className="card-body">
        <Link to={`/garments/${garment.id}`}>
          <h3 className="heading-md mb-2">{garment.name}</h3>
        </Link>
        <p className="body-sm text-muted mb-4">{garment.shortDescription}</p>
        {contextParts.length > 0 && (
          <p className="caption mb-3">Phù hợp: {contextParts.join(' · ')}</p>
        )}
        <div className="flex gap-2 flex-wrap mb-4">
          {garment.region.map(r => (
            <span key={r} className="badge">{r === 'bac-bo' ? 'Bắc Bộ' : r === 'trung-bo' ? 'Trung Bộ' : 'Nam Bộ'}</span>
          ))}
        </div>
        <Link to={`/garments/${garment.id}`} className="btn btn-ghost btn-sm">
          Tìm hiểu thêm →
        </Link>
      </div>
    </div>
  );
};

export default ExplorePage;
