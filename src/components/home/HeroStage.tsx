import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OutfitMiniVis } from '../OutfitVisualization';
import type { EventId, GarmentId } from '../../types';

interface StageLook {
  region: string;
  garment: GarmentId;
  name: string;
  place: string;
  colors: string[];
  accessories: string[];
  event?: EventId;
}

const LOOKS: StageLook[] = [
  {
    region: 'Bắc Bộ',
    garment: 'ao-tu-than',
    name: 'Áo Tứ Thân',
    place: 'Kinh Bắc · Hội Lim quan họ',
    colors: ['earth-tone', 'burgundy'],
    accessories: ['non-quai-thao'],
    event: 'le-hoi',
  },
  {
    region: 'Trung Bộ',
    garment: 'ao-ngu-than',
    name: 'Áo Ngũ Thân',
    place: 'Cố đô Huế · Cung đình',
    colors: ['navy', 'cream'],
    accessories: ['khan-dong'],
  },
  {
    region: 'Nam Bộ',
    garment: 'ao-ba-ba',
    name: 'Áo Bà Ba',
    place: 'Miệt vườn · Sông nước Cửu Long',
    colors: ['ivory', 'earth-tone'],
    accessories: ['non-la', 'khan-ran'],
  },
];

const INTERVAL = 4200;

export const HeroStage: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce) return;
    const id = window.setTimeout(() => setActive(a => (a + 1) % LOOKS.length), INTERVAL);
    return () => window.clearTimeout(id);
  }, [active, paused]);

  const look = LOOKS[active];

  return (
    <div
      className="hero-stage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-stage-frame">
        <div className="hero-stage-halo" aria-hidden="true" />
        <div className="hero-stage-rays" aria-hidden="true" />

        <div className="hero-stage-figures">
          {LOOKS.map((l, i) => (
            <button
              key={l.garment}
              type="button"
              className={`hero-stage-figure${i === active ? ' is-active' : ''}`}
              aria-hidden={i !== active}
              tabIndex={i === active ? 0 : -1}
              aria-label={`Phối ${l.name} tại Studio`}
              onClick={() =>
                navigate(`/remix?garment=${l.garment}${l.event ? `&event=${l.event}` : ''}&accessoryVariants=${l.accessories.join(',')}`)
              }
            >
              <OutfitMiniVis garment={l.garment} colors={l.colors} accessoryVariants={l.accessories} event={l.event} />
            </button>
          ))}
        </div>
        <div className="hero-stage-pedestal" aria-hidden="true" />

        <div className="hero-stage-plate" aria-live="polite">
          <span className="hero-stage-region">{look.region}</span>
          <strong key={look.name} className="hero-stage-name">{look.name}</strong>
          <span className="hero-stage-place">{look.place}</span>
        </div>
      </div>

      <div className="hero-stage-tabs" role="tablist" aria-label="Chọn vùng miền">
        {LOOKS.map((l, i) => (
          <button
            key={l.region}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`hero-stage-tab${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            {l.region}
            <span
              key={`${active}-${paused}`}
              className={`hero-stage-progress${i === active && !paused ? ' is-running' : ''}`}
              style={{ animationDuration: `${INTERVAL}ms` }}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroStage;
