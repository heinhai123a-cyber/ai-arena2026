import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OutfitVisualization } from '../OutfitVisualization';
import { colorOptions } from '../../content/catalog';
import type { EventId, GarmentId } from '../../types';

interface Tier {
  colors: [string, string];
  accessories: string[];
  event: EventId;
  tags: string[];
}

const GARMENTS: { id: GarmentId; label: string }[] = [
  { id: 'ao-dai', label: 'Áo dài' },
  { id: 'ao-tu-than', label: 'Áo tứ thân' },
  { id: 'ao-ba-ba', label: 'Áo bà ba' },
];

const TIERS: Record<string, [Tier, Tier, Tier]> = {
  'ao-dai': [
    { colors: ['burgundy', 'cream'], accessories: ['man-doi-dau', 'kieng-bac'], event: 'tet', tags: ['Mấn đội đầu', 'Kiềng bạc'] },
    { colors: ['ivory', 'burgundy'], accessories: ['non-la', 'tui-theu'], event: 'le-hoi', tags: ['Nón lá', 'Túi thêu sen'] },
    { colors: ['navy', 'pastel'], accessories: ['mu-beret', 'sneaker', 'tui-xach-nho'], event: 'di-san', tags: ['Beret', 'Sneaker', 'Clutch'] },
  ],
  'ao-tu-than': [
    { colors: ['earth-tone', 'burgundy'], accessories: ['non-quai-thao', 'khan-mo-qua'], event: 'le-hoi', tags: ['Nón quai thao', 'Khăn mỏ quạ'] },
    { colors: ['cream', 'earth-tone'], accessories: ['non-la', 'quat-lua'], event: 'le-hoi', tags: ['Nón lá', 'Quạt lụa'] },
    { colors: ['pastel', 'navy'], accessories: ['kep-toc-hoa', 'vong-ngoc'], event: 'van-nghe', tags: ['Hoa cài tóc', 'Vòng ngọc'] },
  ],
  'ao-ba-ba': [
    { colors: ['earth-tone', 'cream'], accessories: ['non-la', 'guoc'], event: 'di-san', tags: ['Nón lá', 'Guốc mộc'] },
    { colors: ['ivory', 'earth-tone'], accessories: ['khan-ran', 'dep-co'], event: 'di-san', tags: ['Khăn rằn', 'Dép quai ngang'] },
    { colors: ['navy', 'burgundy'], accessories: ['khan-ran', 'sneaker', 'bang-do'], event: 'ky-yeu', tags: ['Khăn rằn', 'Sneaker', 'Băng đô'] },
  ],
};

const TIER_INFO = [
  { name: 'Nguyên bản', desc: 'Giữ trọn phom dáng, bảng màu và phụ kiện cổ truyền.' },
  { name: 'Giao thoa', desc: 'Giữ hồn cốt, điểm thêm phụ kiện và sắc màu nhẹ nhàng.' },
  { name: 'Đương đại', desc: 'Phá cách street-style — cấu trúc gốc vẫn được nhận diện.' },
];

const tierOf = (level: number) => (level < 34 ? 0 : level < 67 ? 1 : 2);
const hexOf = (id: string) => colorOptions.find(c => c.id === id)?.hex ?? '#ccc';
const nameOf = (id: string) => colorOptions.find(c => c.id === id)?.name ?? id;

export const RemixTeaser: React.FC = () => {
  const navigate = useNavigate();
  const [garment, setGarment] = useState<GarmentId>('ao-dai');
  const [level, setLevel] = useState(20);

  const tierIdx = tierOf(level);
  const tier = TIERS[garment][tierIdx];
  const info = TIER_INFO[tierIdx];

  const studioUrl = useMemo(
    () =>
      `/remix?garment=${garment}&event=${tier.event}&accessoryVariants=${tier.accessories.join(',')}&remix=${level}`,
    [garment, tier, level],
  );

  return (
    <div className="teaser sq-frame reveal">
      <div className="teaser-stage">
        <div className="teaser-stage-glow" aria-hidden="true" />
        <div key={`${garment}-${tierIdx}`} className="teaser-figure">
          <OutfitVisualization
            garment={garment}
            primaryColor={tier.colors[0]}
            secondaryColor={tier.colors[1]}
            accessoryVariants={tier.accessories}
            remixLevel={level}
            event={tier.event}
            size="lg"
          />
        </div>
        <span className="teaser-level-stamp" aria-hidden="true">
          {level}
          <small>%</small>
        </span>
      </div>

      <div className="teaser-panel">
        <p className="label mb-3" style={{ color: 'var(--color-gold-dark)' }}>THỬ NGAY · KHÔNG CẦN ĐĂNG NHẬP</p>
        <h2 className="display-md mb-3">Kéo thước — áo đổi thay</h2>
        <p className="body-lg text-muted mb-6">
          Chọn một bộ Việt phục rồi kéo thước may. Phom áo, sắc màu và phụ kiện biến tấu theo từng nấc remix ngay trước mắt bạn.
        </p>

        <div className="teaser-chips" role="radiogroup" aria-label="Chọn trang phục">
          {GARMENTS.map(g => (
            <button
              key={g.id}
              type="button"
              role="radio"
              aria-checked={garment === g.id}
              className={`teaser-chip${garment === g.id ? ' is-active' : ''}`}
              onClick={() => setGarment(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="tape">
          <div className="tape-head">
            <span>Thước Remix</span>
            <span className="tape-value">{level} phân</span>
          </div>
          <input
            id="home-remix-range"
            type="range"
            min={0}
            max={100}
            value={level}
            onChange={e => setLevel(Number(e.target.value))}
            className="tape-range"
            style={{ '--val': `${level}%` } as React.CSSProperties}
            aria-label="Mức độ remix"
            aria-valuetext={`${level} phần trăm — ${info.name}`}
          />
          <div className="tape-scale" aria-hidden="true">
            {[0, 25, 50, 75, 100].map(n => <span key={n}>{n}</span>)}
          </div>
          <div className="tape-tiers">
            {TIER_INFO.map((t, i) => (
              <button
                key={t.name}
                type="button"
                className={`tape-tier${i === tierIdx ? ' is-active' : ''}`}
                onClick={() => setLevel([15, 50, 85][i])}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div key={`${garment}-${tierIdx}`} className="teaser-tier-card">
          <div className="teaser-tier-head">
            <strong>{info.name}</strong>
            <div className="teaser-swatches">
              {tier.colors.map(c => (
                <span key={c} className="teaser-swatch" style={{ background: hexOf(c) }} title={nameOf(c)} />
              ))}
            </div>
          </div>
          <p className="body-sm text-muted mb-3">{info.desc}</p>
          <div className="flex gap-2 flex-wrap">
            {tier.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>

        <button type="button" className="btn btn-primary btn-lg teaser-cta" onClick={() => navigate(studioUrl)}>
          Mở Studio với bản phối này →
        </button>
      </div>
    </div>
  );
};

export default RemixTeaser;
