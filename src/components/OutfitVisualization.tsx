import React from 'react';
import type { GarmentId, ColorId } from '../types';
import { colorOptions } from '../content/catalog';

// ============================================================
// SVG Outfit Visualization System
// Layered garment compositions without external images
// ============================================================

interface OutfitVisualizationProps {
  garment: GarmentId;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  remixLevel: number;
  size?: 'sm' | 'md' | 'lg';
}

function getHex(colorId: string | undefined, fallback: string): string {
  if (!colorId) return fallback;
  const found = colorOptions.find(c => c.id === colorId || c.name.toLowerCase() === colorId.toLowerCase());
  return found?.hex || fallback;
}

// Base silhouette figure — faceless, gender-neutral
function BaseFigure({ skinTone = '#D4A574' }: { skinTone?: string }) {
  return (
    <g className="figure-base">
      {/* Head */}
      <ellipse cx="200" cy="85" rx="32" ry="38" fill={skinTone} />
      {/* Hair (simple, no gender markers) */}
      <path d="M168 78 C168 50 232 50 232 78 C232 65 168 65 168 78Z" fill="#2D1810" />
      {/* Neck */}
      <rect x="190" y="118" width="20" height="18" rx="4" fill={skinTone} />
      {/* Hands */}
      <ellipse cx="130" cy="320" rx="12" ry="14" fill={skinTone} />
      <ellipse cx="270" cy="320" rx="12" ry="14" fill={skinTone} />
    </g>
  );
}

// Áo Dài SVG
function AoDai({ primary, secondary, remix }: { primary: string; secondary: string; remix: number }) {
  const slitLength = remix > 66 ? 180 : remix > 33 ? 220 : 260;
  const collarHeight = remix > 66 ? 8 : 15;

  return (
    <g className="garment-ao-dai">
      {/* Pants */}
      <path d={`M165 380 L155 530 L195 530 L200 380Z`} fill={secondary} />
      <path d={`M200 380 L205 530 L245 530 L235 380Z`} fill={secondary} />
      {/* Main body - ao dai */}
      <path d={`M155 136 L140 ${slitLength} L200 ${slitLength + 20} L260 ${slitLength} L245 136Z`} fill={primary} opacity="0.95" />
      {/* Front slit left tà */}
      <path d={`M155 380 L140 ${slitLength} L200 ${slitLength + 20} L200 380Z`} fill={primary} opacity="0.9" />
      {/* Front slit right tà */}
      <path d={`M245 380 L260 ${slitLength} L200 ${slitLength + 20} L200 380Z`} fill={primary} opacity="0.85" />
      {/* Collar */}
      <path d={`M180 136 L200 ${136 + collarHeight} L220 136`} fill="none" stroke={primary} strokeWidth="3" />
      {/* Collar stand */}
      <rect x="185" y="128" width="30" height={collarHeight} rx="2" fill={primary} stroke={secondary} strokeWidth="0.5" />
      {/* Sleeves */}
      <path d="M155 136 L120 240 L140 245 L160 170Z" fill={primary} opacity="0.9" />
      <path d="M245 136 L280 240 L260 245 L240 170Z" fill={primary} opacity="0.9" />
      {/* Subtle detail lines */}
      <line x1="200" y1="180" x2="200" y2={slitLength} stroke={secondary} strokeWidth="0.5" opacity="0.3" />
    </g>
  );
}

// Áo Ngũ Thân SVG
function AoNguThan({ primary, secondary, remix }: { primary: string; secondary: string; remix: number }) {
  const _ = remix; // Future use
  void _;
  return (
    <g className="garment-ao-ngu-than">
      {/* Pants */}
      <path d="M165 400 L155 530 L195 530 L200 400Z" fill={secondary} />
      <path d="M200 400 L205 530 L245 530 L235 400Z" fill={secondary} />
      {/* Main body - 5 panels */}
      <path d="M150 136 L135 420 L200 430 L265 420 L250 136Z" fill={primary} opacity="0.95" />
      {/* Inner panel visible */}
      <path d="M175 155 L170 400 L200 410 L200 155Z" fill={secondary} opacity="0.4" />
      {/* Overlap right */}
      <path d="M200 150 L200 410 L255 400 L245 150Z" fill={primary} opacity="0.9" />
      {/* Collar - cross right */}
      <path d="M185 136 L200 165 L225 136" fill="none" stroke={secondary} strokeWidth="2" />
      {/* Belt / sash */}
      <rect x="150" y="250" width="100" height="12" rx="3" fill={secondary} opacity="0.7" />
      {/* Sleeves - wider */}
      <path d="M150 136 L110 260 L135 265 L155 175Z" fill={primary} opacity="0.9" />
      <path d="M250 136 L290 260 L265 265 L245 175Z" fill={primary} opacity="0.9" />
    </g>
  );
}

// Áo Tứ Thân SVG
function AoTuThan({ primary, secondary, remix }: { primary: string; secondary: string; remix: number }) {
  const _ = remix;
  void _;
  return (
    <g className="garment-ao-tu-than">
      {/* Váy đụp (skirt) */}
      <path d="M145 280 L125 530 L275 530 L255 280Z" fill={secondary} opacity="0.85" />
      {/* Yếm (inner garment) */}
      <path d="M175 140 L170 280 L230 280 L225 140Z" fill="#D4544A" opacity="0.7" />
      {/* Main body - 4 panels */}
      {/* Left front panel */}
      <path d="M155 140 L150 350 L200 355Z" fill={primary} opacity="0.9" />
      {/* Right front panel */}
      <path d="M245 140 L250 350 L200 355Z" fill={primary} opacity="0.85" />
      {/* Tied front */}
      <path d="M185 280 L200 310 L215 280" fill="none" stroke={primary} strokeWidth="2" />
      {/* Belt */}
      <rect x="155" y="270" width="90" height="10" rx="2" fill={secondary} opacity="0.6" />
      {/* Sleeves */}
      <path d="M155 140 L125 230 L145 235 L160 170Z" fill={primary} opacity="0.9" />
      <path d="M245 140 L275 230 L255 235 L240 170Z" fill={primary} opacity="0.9" />
      {/* Khăn mỏ quạ indication */}
      <path d="M170 60 L200 50 L230 60 L220 75 L180 75Z" fill="#1A1A1A" opacity="0.8" />
    </g>
  );
}

// Áo Bà Ba SVG
function AoBaBa({ primary, secondary, remix }: { primary: string; secondary: string; remix: number }) {
  const _ = remix;
  void _;
  return (
    <g className="garment-ao-ba-ba">
      {/* Quần lá tọa */}
      <path d="M165 310 L150 530 L195 530 L200 310Z" fill={secondary} />
      <path d="M200 310 L205 530 L250 530 L235 310Z" fill={secondary} />
      {/* Main body - simple tunic */}
      <rect x="150" y="136" width="100" height="185" rx="3" fill={primary} opacity="0.95" />
      {/* Side slits */}
      <line x1="150" y1="280" x2="150" y2="321" stroke={secondary} strokeWidth="1.5" />
      <line x1="250" y1="280" x2="250" y2="321" stroke={secondary} strokeWidth="1.5" />
      {/* Button line */}
      {[160, 190, 220, 250, 280].map(y => (
        <circle key={y} cx="200" cy={y} r="2.5" fill={secondary} opacity="0.6" />
      ))}
      {/* Collar - round/v-neck */}
      <path d="M180 136 Q200 148 220 136" fill="none" stroke={secondary} strokeWidth="1.5" />
      {/* Sleeves - shorter */}
      <path d="M150 140 L125 210 L145 215 L155 165Z" fill={primary} opacity="0.9" />
      <path d="M250 140 L275 210 L255 215 L245 165Z" fill={primary} opacity="0.9" />
      {/* Khăn rằn */}
      <path d="M165 130 Q200 145 235 130" fill="none" stroke="#CC5500" strokeWidth="4" strokeDasharray="6 3" opacity="0.6" />
    </g>
  );
}

export const OutfitVisualization: React.FC<OutfitVisualizationProps> = ({
  garment,
  primaryColor,
  secondaryColor,
  accentColor: _accentColor,
  remixLevel,
  size = 'md',
}) => {
  const primary = getHex(primaryColor, '#FFFFF0');
  const secondary = getHex(secondaryColor, '#722F37');

  const sizeMap = { sm: 200, md: 320, lg: 420 };
  const viewSize = sizeMap[size];

  const GarmentComponent = {
    'ao-dai': AoDai,
    'ao-ngu-than': AoNguThan,
    'ao-tu-than': AoTuThan,
    'ao-ba-ba': AoBaBa,
  }[garment] || AoDai;

  return (
    <div className="outfit-visual" style={{ maxWidth: viewSize }}>
      <svg
        viewBox="0 0 400 560"
        width="100%"
        height="100%"
        style={{ padding: '20px' }}
        role="img"
        aria-label={`Minh họa trang phục ${garment}`}
      >
        {/* Figure & Garment */}
        <BaseFigure />
        <GarmentComponent primary={primary} secondary={secondary} remix={remixLevel} />
        {/* Feet */}
        <ellipse cx="175" cy="535" rx="22" ry="8" fill="#3D3D3D" />
        <ellipse cx="225" cy="535" rx="22" ry="8" fill="#3D3D3D" />
      </svg>
    </div>
  );
};

// Mini swatch visualization for cards
export const OutfitMiniVis: React.FC<{
  garment: GarmentId;
  colors: ColorId[];
}> = ({ garment, colors }) => {
  const primary = colors[0] ? getHex(colors[0], '#FFFFF0') : '#FFFFF0';
  const secondary = colors[1] ? getHex(colors[1], '#722F37') : '#722F37';

  const GarmentComponent = {
    'ao-dai': AoDai,
    'ao-ngu-than': AoNguThan,
    'ao-tu-than': AoTuThan,
    'ao-ba-ba': AoBaBa,
  }[garment] || AoDai;

  return (
    <svg viewBox="0 0 400 560" width="100%" height="100%" role="img" aria-label={`Trang phục ${garment}`}>
      <BaseFigure />
      <GarmentComponent primary={primary} secondary={secondary} remix={50} />
      <ellipse cx="175" cy="535" rx="22" ry="8" fill="#3D3D3D" />
      <ellipse cx="225" cy="535" rx="22" ry="8" fill="#3D3D3D" />
    </svg>
  );
};

export default OutfitVisualization;
