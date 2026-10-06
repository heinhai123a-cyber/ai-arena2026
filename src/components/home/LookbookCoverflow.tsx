import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OutfitMiniVis } from '../OutfitVisualization';
import { RemixTapeBadge } from '../RemixTapeBadge';
import type { EventId, GarmentId } from '../../types';

interface Look {
  garment: GarmentId;
  title: string;
  to: string;
  tags: string[];
  colors: string[];
  accessories?: string[];
  event?: EventId;
  remix: number;
  bg: string;
}

const LOOKS: Look[] = [
  { garment: 'ao-dai', title: 'Tết sum vầy', to: '/remix?preset=tet_gia_dinh__ao_dai_truyen_thong', tags: ['Áo dài', 'Truyền thống', 'Tết'], colors: ['burgundy', 'cream'], accessories: ['man-doi-dau'], event: 'tet', remix: 15, bg: 'linear-gradient(160deg, #FAE8E4, #F5D9CF)' },
  { garment: 'ao-tu-than', title: 'Bắc Bộ Lễ hội', to: '/remix?preset=bac_bo_le_hoi__ao_tu_than', tags: ['Áo tứ thân', 'Thanh lịch', 'Lễ hội'], colors: ['earth-tone', 'burgundy'], accessories: ['non-quai-thao'], remix: 25, bg: 'linear-gradient(160deg, #F5EBD8, #EAD9B8)' },
  { garment: 'ao-dai', title: 'Vintage Kỷ yếu', to: '/remix?preset=van_nghe_clb__ao_dai_cach_tan', tags: ['Áo dài', 'Vintage', 'Kỷ yếu'], colors: ['cream', 'burgundy'], remix: 55, bg: 'linear-gradient(160deg, #F0E6D8, #E4D3BC)' },
  { garment: 'ao-ba-ba', title: 'Streetwear Saigon', to: '/remix?preset=streetwear_saigon__ao_ba_ba', tags: ['Áo bà ba', 'Streetwear', 'Check-in'], colors: ['navy', 'earth-tone'], accessories: ['khan-ran', 'sneaker'], remix: 80, bg: 'linear-gradient(160deg, #E8ECF2, #D3DAE6)' },
  { garment: 'ao-ngu-than', title: 'Cung đình Huế', to: '/remix?garment=ao-ngu-than&event=di-san', tags: ['Áo ngũ thân', 'Cung đình', 'Di sản'], colors: ['navy', 'cream'], accessories: ['khan-dong'], remix: 20, bg: 'linear-gradient(160deg, #E8F2EC, #D2E5DA)' },
];

export const LookbookCoverflow: React.FC = () => {
  const navigate = useNavigate();
  const n = LOOKS.length;
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir: number) => setActive(a => (a + dir + n) % n), [n]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce) return;
    const id = window.setTimeout(() => go(1), 4500);
    return () => window.clearTimeout(id);
  }, [active, paused, go]);

  return (
    <div
      className="coverflow reveal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={e => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Lookbook được yêu thích"
    >
      <div className="coverflow-track">
        {LOOKS.map((look, i) => {
          let offset = i - active;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const abs = Math.abs(offset);
          const isActive = offset === 0;
          return (
            <article
              key={look.title}
              className={`coverflow-card sq-frame${isActive ? ' is-active' : ''}`}
              style={{
                transform: `translateX(calc(${offset} * var(--cf-step))) translateZ(${-abs * 160}px) rotateY(${-offset * 32}deg)`,
                zIndex: 10 - abs,
                opacity: abs > 2 ? 0 : 1 - abs * 0.18,
                filter: isActive ? 'none' : `brightness(${1 - abs * 0.12}) saturate(${1 - abs * 0.2})`,
              }}
              onClick={() => (isActive ? navigate(look.to) : setActive(i))}
              role="button"
              tabIndex={isActive ? 0 : -1}
              aria-label={isActive ? `Mở look ${look.title} trong Studio` : `Xem look ${look.title}`}
              onKeyDown={e => e.key === 'Enter' && (isActive ? navigate(look.to) : setActive(i))}
            >
              <div className="coverflow-visual" style={{ background: look.bg }}>
                <OutfitMiniVis garment={look.garment} colors={look.colors} accessoryVariants={look.accessories} event={look.event} />
                <div className="coverflow-badge">
                  <RemixTapeBadge level={look.remix} width={124} />
                </div>
              </div>
              <div className="coverflow-body">
                <h3 className="heading-sm mb-2" style={{ fontFamily: 'var(--font-display)' }}>{look.title}</h3>
                <div className="flex gap-2 flex-wrap">
                  {look.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <span className="coverflow-open">Phối look này →</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="coverflow-controls">
        <button type="button" className="coverflow-arrow" onClick={() => go(-1)} aria-label="Look trước">←</button>
        <div className="coverflow-dots">
          {LOOKS.map((l, i) => (
            <button
              key={l.title}
              type="button"
              className={`coverflow-dot${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Chuyển tới ${l.title}`}
              aria-current={i === active}
            />
          ))}
        </div>
        <button type="button" className="coverflow-arrow" onClick={() => go(1)} aria-label="Look sau">→</button>
      </div>
    </div>
  );
};

export default LookbookCoverflow;
