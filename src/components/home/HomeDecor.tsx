import React from 'react';

/* ────────────────────────────────────────────────────────────
   Decorative pieces for the homepage
   - DongSonDrum: Ngọc Lũ bronze-drum face (14-ray star + chim Lạc ring)
   - MaiBlossom: 5-petal apricot blossom used for falling / bursting petals
   - FallingPetals: ambient falling blossoms for dark heritage sections
   - Lantern: swinging silk lantern
   ──────────────────────────────────────────────────────────── */

const polar = (r: number, deg: number) => {
  const a = (deg - 90) * (Math.PI / 180);
  return [r * Math.cos(a), r * Math.sin(a)] as const;
};

const starPath = (rays: number, outer: number, inner: number) => {
  const pts: string[] = [];
  for (let i = 0; i < rays * 2; i++) {
    const [x, y] = polar(i % 2 === 0 ? outer : inner, (i * 180) / rays);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${pts.join(' L')}Z`;
};

const zigzagPath = (r: number, amp: number, segments: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= segments * 2; i++) {
    const [x, y] = polar(i % 2 === 0 ? r - amp : r + amp, (i * 180) / segments);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${pts.join(' L')}Z`;
};

export const DongSonDrum: React.FC<{ size?: number | string; className?: string; style?: React.CSSProperties }> = ({
  size = 560,
  className,
  style,
}) => (
  <svg
    viewBox="-200 -200 400 400"
    width={size}
    height={size}
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
  >
    <circle r="197" strokeWidth="2" />
    <circle r="189" strokeWidth="0.8" />
    {Array.from({ length: 90 }).map((_, i) => (
      <line key={`t${i}`} x1="0" y1="-189" x2="0" y2="-180" strokeWidth="0.7" transform={`rotate(${i * 4})`} />
    ))}
    <circle r="180" strokeWidth="0.8" />

    {/* Chim Lạc ring — 8 birds flying counter-clockwise */}
    {Array.from({ length: 8 }).map((_, i) => (
      <g key={`b${i}`} transform={`rotate(${i * 45}) translate(0 -152)`}>
        <path
          d="M-26 6 C-14 -4 -2 -7 7 -4 L26 -18 L15 -2 C22 2 25 7 20 9 C9 7 -6 10 -26 6Z"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.18"
        />
        <path d="M-8 4 L-14 16 M2 4 L-2 15" strokeWidth="0.8" />
        <circle cx="12" cy="-2.5" r="1.4" fill="currentColor" stroke="none" />
      </g>
    ))}

    <circle r="124" strokeWidth="0.8" />
    {Array.from({ length: 60 }).map((_, i) => {
      const [x, y] = polar(117, i * 6);
      return <circle key={`d${i}`} cx={x} cy={y} r="1.6" fill="currentColor" stroke="none" />;
    })}
    <circle r="110" strokeWidth="0.8" />
    <path d={zigzagPath(99, 6, 36)} strokeWidth="0.8" />
    <circle r="88" strokeWidth="0.8" />
    {Array.from({ length: 24 }).map((_, i) => (
      <g key={`c${i}`} transform={`rotate(${i * 15}) translate(0 -76)`}>
        <circle r="7" strokeWidth="0.8" />
        <circle r="2.5" strokeWidth="0.6" />
      </g>
    ))}
    <circle r="64" strokeWidth="0.8" />

    {/* 14-ray sun star */}
    <path d={starPath(14, 58, 17)} fill="currentColor" fillOpacity="0.28" strokeWidth="1" />
    <circle r="13" strokeWidth="1" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

export const MaiBlossom: React.FC<{ color?: string; core?: string; size?: number }> = ({
  color = '#F4D03F',
  core = '#C0392B',
  size = 18,
}) => (
  <svg viewBox="-12 -12 24 24" width={size} height={size} aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <ellipse key={i} cx="0" cy="-5.6" rx="4.2" ry="5.8" fill={color} transform={`rotate(${i * 72})`} />
    ))}
    <circle r="2.6" fill={core} />
    {Array.from({ length: 5 }).map((_, i) => {
      const [x, y] = polar(3.6, i * 72 + 36);
      return <circle key={`s${i}`} cx={x} cy={y} r="0.7" fill="#8B1A1A" />;
    })}
  </svg>
);

/** Deterministic pseudo-random so SSR/CSR and re-renders stay stable. */
const rand = (i: number, salt: number) => {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

export const FallingPetals: React.FC<{ count?: number }> = ({ count = 18 }) => (
  <div className="petal-field" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => {
      const pink = i % 4 === 0;
      const style = {
        '--x': `${(rand(i, 1) * 100).toFixed(1)}%`,
        '--dur': `${(11 + rand(i, 2) * 10).toFixed(1)}s`,
        '--delay': `${(-rand(i, 3) * 20).toFixed(1)}s`,
        '--sway': `${(18 + rand(i, 4) * 40).toFixed(0)}px`,
        '--scale': (0.55 + rand(i, 5) * 0.75).toFixed(2),
        '--op': (0.35 + rand(i, 6) * 0.45).toFixed(2),
      } as React.CSSProperties;
      return (
        <span key={i} className="petal" style={style}>
          <span className="petal-inner">
            <MaiBlossom color={pink ? '#F5B7C5' : '#F4D03F'} core={pink ? '#C0392B' : '#B9770E'} />
          </span>
        </span>
      );
    })}
  </div>
);

export const Lantern: React.FC<{ className?: string; style?: React.CSSProperties; size?: number }> = ({
  className,
  style,
  size = 90,
}) => {
  const uid = React.useId().replace(/:/g, '_');
  const silkId = `lanternSilk_${uid}`;
  const glowId = `lanternGlow_${uid}`;

  return (
    <svg viewBox="0 0 80 170" width={size} height={size * 2.125} className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={silkId} x1="0" x2="1">
          <stop offset="0%" stopColor="#7A1010" />
          <stop offset="45%" stopColor="#D9381E" />
          <stop offset="100%" stopColor="#7A1010" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD27A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFD27A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line x1="40" y1="0" x2="40" y2="30" stroke="#8B6914" strokeWidth="1.5" />
      <circle cx="40" cy="88" r="44" fill={`url(#${glowId})`} />
      <rect x="28" y="30" width="24" height="8" fill="#C5972C" />
      <path d="M14 46 Q40 30 66 46 L66 124 Q40 140 14 124 Z" fill={`url(#${silkId})`} />
    {[24, 32, 40, 48, 56].map(x => (
      <path key={x} d={`M${x} 40 Q${x + (x - 40) * 0.5} 85 ${x} 130`} stroke="#5C0F0F" strokeWidth="0.8" fill="none" opacity="0.6" />
    ))}
    <rect x="22" y="40" width="36" height="5" fill="#C5972C" />
    <rect x="22" y="125" width="36" height="5" fill="#C5972C" />
    <text x="40" y="92" textAnchor="middle" fontSize="20" fontWeight="700" fill="#F4D03F" fontFamily="serif">福</text>
    <rect x="34" y="130" width="12" height="6" fill="#C5972C" />
    {[-6, -3, 0, 3, 6].map(dx => (
      <line key={dx} x1={40 + dx} y1="136" x2={40 + dx * 1.3} y2="166" stroke="#D4A843" strokeWidth="1.2" />
    ))}
  </svg>
  );
};
