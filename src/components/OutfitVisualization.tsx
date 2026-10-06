import React from 'react';
import type { CharacterId, GarmentId, ColorId, EventId } from '../types';
import { colorOptions } from '../content/catalog';
import { DEFAULT_CHARACTER_ID, getRepresentativeCharacter, type RepresentativeCharacter } from '../content/characters';

// ============================================================
// SVG Outfit Visualization System
// Layered garment compositions with real-time accessories & occasion ambiance
// ============================================================

export interface OutfitVisualizationProps {
  garment: GarmentId;
  accessoryVariants?: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  remixLevel: number;
  character?: CharacterId;
  event?: EventId | null;
  size?: 'sm' | 'md' | 'lg';
}

function getHex(colorId: string | undefined, fallback: string): string {
  if (!colorId) return fallback;
  const found = colorOptions.find(c => c.id === colorId || c.name.toLowerCase() === colorId.toLowerCase());
  return found?.hex || fallback;
}

function CharacterHead({ profile, isTuThan = false }: { profile: RepresentativeCharacter; isTuThan?: boolean }) {
  const child = profile.ageGroup === 'child';
  const rx = child ? 24 : 29;
  const ry = child ? 29 : 34;

  return (
    <g className="character-head">
      {/* Hair Behind */}
      {profile.hairStyle === 'long' && (
        <g fill={profile.hairColor}>
          {/* Flowing smooth hair behind shoulders */}
          <path d="M171 78 Q158 92 163 138 L168 178 Q177 182 181 162 L178 112 M229 78 Q242 92 237 138 L232 178 Q223 182 219 162 L222 112" />
        </g>
      )}

      {/* Áo tứ thân side braid (bím tóc tết một bên vai như Hình 1) */}
      {isTuThan && (
        <g className="tu-than-braid" fill={profile.hairColor}>
          <path d="M224 95 Q232 115 228 140 Q225 160 227 180 Q229 200 225 210 Q221 214 218 205 Q220 185 219 160 Q218 135 220 110 Z" />
          {/* Braid weave segments */}
          <path d="M224 120 Q229 125 224 130 M223 140 Q228 145 223 150 M223 160 Q227 165 222 170 M222 180 Q226 185 221 190" fill="none" stroke="#1A120E" strokeWidth="1.2" opacity="0.6" />
          {/* Red/gold hair tie at end */}
          <ellipse cx="224" cy="204" rx="3.5" ry="2" fill="#C0392B" />
        </g>
      )}

      {profile.hairStyle === 'bob' && (
        <path d="M170 72 Q200 45 230 72 L237 122 Q227 136 220 116 L218 96 L182 96 L180 116 Q173 136 163 122Z" fill={profile.hairColor} />
      )}
      {profile.hairStyle === 'tied' && (
        <g fill={profile.hairColor}>
          <circle cx="166" cy="100" r="11" />
          <circle cx="234" cy="100" r="11" />
          <path d="M171 70 Q200 43 229 70 L231 94 L169 94Z" />
        </g>
      )}
      {profile.hairStyle === 'elder-woman' && (
        <g fill={profile.hairColor}>
          <circle cx="200" cy="48" r="14" />
          <path d="M170 76 Q168 53 200 48 Q232 53 230 76 L226 95 L174 95Z" />
        </g>
      )}
      {profile.hairStyle === 'elder-man' && (
        <path d="M170 78 Q167 54 190 52 Q202 44 216 53 Q234 58 230 78 L225 90 L220 70 Q199 62 180 75 L175 90Z" fill={profile.hairColor} />
      )}
      {profile.hairStyle === 'short' && (
        <path d="M170 78 Q166 52 192 48 Q210 40 228 52 Q238 60 230 80 L224 90 L220 70 Q200 60 179 74 L175 90Z" fill={profile.hairColor} />
      )}

      {/* Head shape — smooth rounded oval */}
      <ellipse cx="200" cy="84" rx={rx} ry={ry} fill={profile.skinTone} />

      {/* Ears */}
      <ellipse cx={200 - rx + 1} cy="88" rx="3.5" ry="6" fill={profile.skinTone} />
      <ellipse cx={200 + rx - 1} cy="88" rx="3.5" ry="6" fill={profile.skinTone} />

      {/* Front bangs / hairline */}
      {(profile.hairStyle === 'long' || profile.hairStyle === 'tied') && (
        <path d="M172 74 Q182 52 200 50 Q218 52 228 74 Q216 63 200 62 Q184 63 172 74Z" fill={profile.hairColor} />
      )}
      {(profile.hairStyle === 'short' || profile.hairStyle === 'elder-man') && (
        <path d="M172 74 Q174 52 200 50 Q226 52 228 74 Q218 64 210 63 Q196 66 182 62Z" fill={profile.hairColor} />
      )}

      {/* ── CUTE SMILING CLOSED EYES (^ ^) AS IN HÌNH 1 ── */}
      {/* Left Smiling Eye Arc */}
      <path
        d="M185 84 Q192 78 199 84"
        fill="none"
        stroke="#332219"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Right Smiling Eye Arc */}
      <path
        d="M201 84 Q208 78 215 84"
        fill="none"
        stroke="#332219"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Gentle Eyebrows */}
      <path d="M184 76 Q192 73 198 76" fill="none" stroke="#4A342B" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
      <path d="M202 76 Q208 73 216 76" fill="none" stroke="#4A342B" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />

      {/* Sweet Smiling Mouth (Nụ cười hiền tươi tắn) */}
      <path
        d="M196 97 Q200 102 204 97"
        fill="none"
        stroke="#8C3833"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Rosy Cheek Blush (Má hồng nhẹ dễ thương) */}
      <ellipse cx="180" cy="91" rx="5" ry="3" fill="#E87676" opacity="0.32" />
      <ellipse cx="220" cy="91" rx="5" ry="3" fill="#E87676" opacity="0.32" />

      {profile.id === 'viet' && (
        <path d="M188 107 Q200 115 212 107 Q210 123 200 124 Q190 122 188 107Z" fill={profile.hairColor} opacity="0.85" />
      )}
    </g>
  );
}

function BaseFigure({ profile }: { profile: RepresentativeCharacter }) {
  return (
    <g className="figure-base">
      {/* Neck */}
      <path d="M191 114 L191 138 L209 138 L209 114 Z" fill={profile.skinTone} />
      {/* Shoulder base */}
      <path d="M174 134 Q200 128 226 134 L236 156 L164 156Z" fill={profile.skinTone} />
      {/* Arms base */}
      <path d="M162 144 Q146 148 140 178 L124 286 Q122 296 128 304 L144 301 L150 288 L166 204 L176 164Z" fill={profile.skinTone} stroke="#8B5D49" strokeOpacity="0.15" strokeWidth="1.5" />
      <path d="M238 144 Q254 148 260 178 L276 286 Q278 296 272 304 L256 301 L250 288 L234 204 L224 164Z" fill={profile.skinTone} stroke="#8B5D49" strokeOpacity="0.15" strokeWidth="1.5" />
    </g>
  );
}

function ArmSleeves({ fill, opacity = 1 }: { fill: string; opacity?: number }) {
  return (
    <g opacity={opacity} stroke="#3D1C1C" strokeOpacity="0.2" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M164 140 Q148 144 140 174 L121 282 Q118 294 125 302 L146 302 L151 288 L168 202 L178 162Z" fill={fill} />
      <path d="M236 140 Q252 144 260 174 L279 282 Q282 294 275 302 L254 302 L249 288 L232 202 L222 162Z" fill={fill} />
      <path d="M124 298 Q135 302 146 298 M254 298 Q265 302 276 298" fill="none" stroke="#FFFDF8" strokeOpacity="0.5" strokeWidth="1.8" />
    </g>
  );
}

function Hands({ skinTone }: { skinTone: string }) {
  return (
    <g className="character-hands" fill={skinTone} stroke="#8B5D49" strokeOpacity="0.18" strokeWidth="1.5">
      <ellipse cx="135" cy="314" rx="8" ry="10" />
      <ellipse cx="265" cy="314" rx="8" ry="10" />
    </g>
  );
}

/* ── HOA MAI / ĐÀO NỞ TRÊN VẢI (5 cánh hoa vàng nhụy đỏ như Hình 1) ── */
function BlossomPattern({ color = '#FFD13B', center = '#D35400' }: { color?: string; center?: string }) {
  const petals = [
    { x: 194, y: 165, s: 0.9 },
    { x: 178, y: 188, s: 0.8 },
    { x: 215, y: 182, s: 0.85 },
    { x: 198, y: 212, s: 0.95 },
    { x: 180, y: 236, s: 0.8 },
    { x: 218, y: 242, s: 0.85 },
    { x: 195, y: 270, s: 0.9 },
    { x: 176, y: 300, s: 0.85 },
    { x: 216, y: 308, s: 0.85 },
    { x: 192, y: 340, s: 0.95 },
    { x: 178, y: 375, s: 0.85 },
    { x: 218, y: 382, s: 0.9 },
    { x: 194, y: 418, s: 0.9 },
    { x: 175, y: 450, s: 0.85 },
    { x: 218, y: 456, s: 0.85 },
    { x: 195, y: 486, s: 0.9 },
    /* Sleeve blossoms */
    { x: 148, y: 210, s: 0.75 },
    { x: 138, y: 250, s: 0.7 },
    { x: 252, y: 210, s: 0.75 },
    { x: 262, y: 250, s: 0.7 },
  ];

  return (
    <g className="blossom-overlay" pointerEvents="none">
      {petals.map((p, idx) => (
        <g key={idx} transform={`translate(${p.x}, ${p.y}) scale(${p.s})`}>
          {/* 5 rounded petals */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <circle
              key={i}
              cx={Math.cos((angle * Math.PI) / 180) * 4.2}
              cy={Math.sin((angle * Math.PI) / 180) * 4.2}
              r="3.2"
              fill={color}
            />
          ))}
          {/* Center core */}
          <circle cx="0" cy="0" r="2.2" fill={center} />
        </g>
      ))}
    </g>
  );
}

// ── ÁO DÀI SVG (HÌNH 1: "Chúc Tết nhà ngoại") ──
function AoDai({ primary, secondary: _secondary, remix }: { primary: string; secondary?: string; remix: number }) {
  const hem = remix > 66 ? 410 : remix > 33 ? 450 : 490;
  const isDefaultRed = primary === '#FFFFF0' || primary.toLowerCase().includes('c0392b') || primary.toLowerCase().includes('8b1a1a') || primary.toLowerCase().includes('b83219') || primary.toLowerCase().includes('red');
  const robeColor = isDefaultRed ? '#C2272D' : primary;
  const pantsColor = '#FDFCF7'; // Quần lụa trắng thanh lịch như Hình 1
  const flowerColor = '#F9D342'; // Hoa mai vàng 5 cánh

  return (
    <g className="garment-ao-dai">
      {/* Quần lụa trắng ống rộng buông rủ như Hình 1 */}
      <path d="M172 274 L162 522 L198 522 L200 275Z" fill={pantsColor} stroke="#E5DEC9" strokeWidth="1" />
      <path d="M200 275 L202 522 L238 522 L228 274Z" fill={pantsColor} stroke="#E5DEC9" strokeWidth="1" />

      {/* Thân áo dài (Front bodice) */}
      <path d="M164 138 Q200 148 236 138 L246 273 Q225 288 200 283 Q175 288 154 273Z" fill={robeColor} stroke="#4B1E1E" strokeOpacity="0.25" strokeWidth="1.8" />
      
      {/* Tà trước áo dài buông dài (Front flap) */}
      <path d={`M154 266 Q174 282 198 276 L198 ${hem} Q177 ${hem - 6} 158 ${hem - 22}Z`} fill={robeColor} stroke="#4B1E1E" strokeOpacity="0.25" strokeWidth="1.8" />
      {/* Tà sau áo dài buông dài (Back flap) */}
      <path d={`M202 276 Q226 282 246 266 L242 ${hem - 22} Q223 ${hem - 6} 202 ${hem}Z`} fill={robeColor} stroke="#4B1E1E" strokeOpacity="0.25" strokeWidth="1.8" />

      {/* Cổ áo đứng ôm nhẹ (Mandarin collar) viền vàng */}
      <path d="M187 118 Q200 126 213 118 L213 138 Q200 146 187 138Z" fill={robeColor} stroke="#FFD13B" strokeWidth="1.5" />
      <path d="M188 120 Q200 128 212 120" fill="none" stroke="#FFD13B" strokeWidth="1.5" />

      {/* Tay áo dài */}
      <ArmSleeves fill={robeColor} />

      {/* Hoa mai/đào vàng 5 cánh phủ đều trên áo dài như Hình 1 */}
      <BlossomPattern color={flowerColor} center="#C0392B" />

      {/* Hàng cúc bấm nghiêng ngực áo truyền thống */}
      <path d="M198 138 Q210 148 216 172" fill="none" stroke="#FFD13B" strokeWidth="1.2" opacity="0.8" />
      {[140, 150, 162, 175].map(y => (
        <circle key={y} cx="215" cy={y} r="1.8" fill="#FFD13B" stroke="#B8860B" strokeWidth="0.6" />
      ))}

      {/* Túi xách tròn cầm tay màu vàng như Hình 1 (Chúc Tết nhà ngoại) */}
      <g className="tet-yellow-pouch" transform="translate(126, 308)">
        {/* Quai cầm túi */}
        <path d="M9 4 Q9 -8 13 -8 Q17 -8 17 4" fill="none" stroke="#C5972C" strokeWidth="1.8" strokeLinecap="round" />
        {/* Túi tròn vàng may viền */}
        <ellipse cx="13" cy="14" rx="10" ry="11" fill="#F4D03F" stroke="#C5972C" strokeWidth="1.5" />
        <ellipse cx="13" cy="14" rx="7" ry="8" fill="none" stroke="#D4AC0D" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="13" cy="14" r="2" fill="#E67E22" />
      </g>
    </g>
  );
}

// ── ÁO TỨ THÂN SVG (HÌNH 1: "Hội Lim mớ ba") ──
function AoTuThan({ primary, secondary, remix: _remix }: { primary: string; secondary: string; remix: number }) {
  const isDefault = primary === '#FFFFF0' || primary.toLowerCase().includes('burgundy') || primary.toLowerCase().includes('8b1a1a');
  // Màu chuẩn như Hình 1: Áo ngoài nâu đất, yếm xanh ngọc tươi, đai xanh lá, váy đụp đen
  const outerRobeColor = isDefault ? '#7A4D2E' : primary; // Nâu đất Hội Lim
  const yemColor = isDefault ? '#58D68D' : secondary; // Xanh ngọc tươi rực rỡ
  const skirtColor = '#1F1E24'; // Váy đụp đen truyền thống
  const sashColor = isDefault ? '#58D68D' : secondary; // Dải thắt lưng xanh

  return (
    <g className="garment-ao-tu-than">
      {/* Váy đụp đen xòe dài chấm gót như Hình 1 */}
      <path d="M154 274 Q200 286 246 274 L256 524 Q200 538 144 524Z" fill={skirtColor} stroke="#111" strokeWidth="1.5" />
      <path d="M154 274 L144 524" stroke="#2C2B33" strokeWidth="1" opacity="0.6" />
      <path d="M246 274 L256 524" stroke="#2C2B33" strokeWidth="1" opacity="0.6" />

      {/* Yếm bên trong màu xanh ngọc tươi (Hình 1) */}
      <path d="M185 138 L176 270 L224 270 L215 138Z" fill={yemColor} stroke="#27AE60" strokeWidth="1" />
      {/* Cổ yếm thắm */}
      <path d="M185 138 Q200 152 215 138" fill="none" stroke="#27AE60" strokeWidth="2" />

      {/* Áo khoác ngoài vạt dài màu nâu đất mở hai bên (Outer open robe) */}
      {/* Vạt trái áo khoác ngoài buông dài tới đầu gối */}
      <path d="M164 138 Q182 136 185 160 L185 410 L152 405 L154 274Z" fill={outerRobeColor} stroke="#3D2617" strokeWidth="1.5" />
      {/* Vạt phải áo khoác ngoài buông dài tới đầu gối */}
      <path d="M236 138 Q218 136 215 160 L215 410 L248 405 L246 274Z" fill={outerRobeColor} stroke="#3D2617" strokeWidth="1.5" />

      {/* Tay áo ngoài */}
      <ArmSleeves fill={outerRobeColor} />

      {/* ── THẮT LƯNG DẢI LỤA XANH VỚI 2 DẢI BUÔNG RỦ DÀI NHƯ HÌNH 1 ── */}
      {/* Bản đai lưng ngang bụng */}
      <rect x="168" y="244" width="64" height="14" rx="3" fill={sashColor} stroke="#27AE60" strokeWidth="1.2" />
      {/* Nút thắt ở chính giữa */}
      <ellipse cx="200" cy="251" rx="6" ry="7" fill={sashColor} stroke="#229954" strokeWidth="1.5" />
      {/* Dải nơ trái rủ dài xuống */}
      <path d="M196 256 L194 366 L201 364 L201 256 Z" fill={sashColor} stroke="#229954" strokeWidth="1.2" />
      {/* Dải nơ phải rủ dài xuống */}
      <path d="M201 256 L206 366 L213 364 L207 256 Z" fill={sashColor} stroke="#229954" strokeWidth="1.2" />
    </g>
  );
}

// ── ÁO BÀ BA SVG (HÌNH 1: "Phố cổ Hội An, bản street") ──
function AoBaBa({ primary, secondary: _secondary, remix: _remix }: { primary: string; secondary: string; remix: number }) {
  const isDefault = primary === '#FFFFF0' || primary.toLowerCase().includes('black') || primary.toLowerCase().includes('8b1a1a');
  // Màu chuẩn như Hình 1: Áo xanh ngọc nút vàng, 2 túi ốp vuông ở hông, quần jeans xanh, giày sneaker trắng
  const tunicColor = isDefault ? '#1B8B6F' : primary; // Xanh ngọc Hội An
  const pocketColor = isDefault ? '#166E58' : primary;
  const jeansColor = '#416E9B'; // Quần jeans xanh hiện đại (bản street)
  const buttonColor = '#F4D03F'; // Hàng cúc vàng

  return (
    <g className="garment-ao-ba-ba">
      {/* Quần jeans xanh ống đứng với đường chỉ may như Hình 1 */}
      <path d="M168 304 L158 522 L197 522 L200 310Z" fill={jeansColor} stroke="#2E5073" strokeWidth="1.5" />
      <path d="M200 310 L203 522 L242 522 L232 304Z" fill={jeansColor} stroke="#2E5073" strokeWidth="1.5" />
      {/* Đường chỉ may giữa ống quần jeans */}
      <line x1="177" y1="316" x2="177" y2="520" stroke="#7BA4C7" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1="223" y1="316" x2="223" y2="520" stroke="#7BA4C7" strokeWidth="1.2" strokeDasharray="3 3" />

      {/* Thân áo bà ba vạt ngắn tới ngang hông */}
      <path d="M164 138 Q200 146 236 138 L246 304 Q200 314 154 304Z" fill={tunicColor} stroke="#0E4E3E" strokeWidth="1.5" />
      {/* Xẻ tà hông đặc trưng áo bà ba */}
      <line x1="154" y1="282" x2="154" y2="304" stroke="#0E4E3E" strokeWidth="1.8" />
      <line x1="246" y1="282" x2="246" y2="304" stroke="#0E4E3E" strokeWidth="1.8" />

      {/* Tay áo bà ba */}
      <ArmSleeves fill={tunicColor} />

      {/* Cổ tròn viền nhẹ */}
      <path d="M184 136 Q200 148 216 136" fill="none" stroke="#0E4E3E" strokeWidth="1.5" />

      {/* Nẹp áo giữa và hàng cúc vàng nổi bật như Hình 1 */}
      <line x1="200" y1="144" x2="200" y2="306" stroke="#0E4E3E" strokeWidth="1.2" opacity="0.6" />
      {[156, 180, 204, 228, 252, 276, 298].map(y => (
        <circle key={y} cx="200" cy={y} r="2.2" fill={buttonColor} stroke="#B7950B" strokeWidth="0.8" />
      ))}

      {/* ── 2 TÚI ỐP VUÔNG Ở HÔNG NHƯ HÌNH 1 ── */}
      {/* Túi trái */}
      <rect x="164" y="258" width="18" height="20" rx="1.5" fill={pocketColor} stroke="#0E4E3E" strokeWidth="1.2" />
      <line x1="164" y1="262" x2="182" y2="262" stroke="#F4D03F" strokeWidth="0.8" opacity="0.7" />
      {/* Túi phải */}
      <rect x="218" y="258" width="18" height="20" rx="1.5" fill={pocketColor} stroke="#0E4E3E" strokeWidth="1.2" />
      <line x1="218" y1="262" x2="236" y2="262" stroke="#F4D03F" strokeWidth="0.8" opacity="0.7" />

      {/* Khăn rằn caro đen trắng vắt qua cổ xõa xuống ngực như Hình 1 */}
      <g className="street-khan-ran">
        {/* Quàng quanh cổ */}
        <path d="M174 136 Q200 150 226 136 L224 154 Q200 166 176 154 Z" fill="#FFFDF8" stroke="#1A1A1A" strokeWidth="1.2" />
        {/* Dải khăn rằn buông xuống ngực bên phải */}
        <path d="M214 146 L224 246 L233 246 L226 146 Z" fill="#FFFDF8" stroke="#1A1A1A" strokeWidth="1.2" />
        {/* Họa tiết caro gingham đen trắng */}
        {[154, 166, 178, 190, 202, 214, 226, 238].map(y => (
          <line key={y} x1="216" y1={y} x2="231" y2={y} stroke="#1A1A1A" strokeWidth="1.8" />
        ))}
        <line x1="223" y1="146" x2="228" y2="246" stroke="#1A1A1A" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* Tua rua chân khăn */}
        <path d="M224 246 L224 252 M227 246 L227 253 M230 246 L230 252" stroke="#1A1A1A" strokeWidth="1.2" />
      </g>

      {/* Túi tote màu be có sọc vàng cầm tay trái (như Hình 1) */}
      <g className="street-tote-bag" transform="translate(262, 276)">
        {/* Quai túi tote */}
        <path d="M6 0 L6 -16 Q14 -22 22 -16 L22 0" fill="none" stroke="#7A6855" strokeWidth="1.8" strokeLinecap="round" />
        {/* Thân túi canvas màu be */}
        <rect x="0" y="0" width="28" height="34" rx="2" fill="#FDFBF7" stroke="#9E8E7D" strokeWidth="1.5" />
        {/* Sọc vàng phong cách ở thân túi như Hình 1 */}
        <line x1="4" y1="18" x2="24" y2="18" stroke="#F4D03F" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </g>
  );
}

// ── ÁO NGŨ THÂN SVG ──
function AoNguThan({ primary, secondary, remix: _remix }: { primary: string; secondary: string; remix: number }) {
  const isDefault = primary === '#FFFFF0';
  const robeColor = isDefault ? '#2C3E6B' : primary;
  const pantsColor = secondary || '#FDFCF7';

  return (
    <g className="garment-ao-ngu-than">
      {/* Quần lụa */}
      <path d="M165 400 L155 524 L195 524 L200 400Z" fill={pantsColor} stroke="#4B2925" strokeOpacity="0.2" strokeWidth="1.2" />
      <path d="M200 400 L205 524 L245 524 L235 400Z" fill={pantsColor} stroke="#4B2925" strokeOpacity="0.2" strokeWidth="1.2" />

      {/* Thân 5 thân (5 panels) */}
      <path d="M164 137 Q200 150 236 137 L253 406 Q200 427 147 406Z" fill={robeColor} stroke="#1A1A2E" strokeWidth="1.8" />
      {/* Vạt con bên trong */}
      <path d="M174 157 L174 397 L199 405 L199 158Z" fill={robeColor} opacity="0.8" />
      {/* Vạt lớn đè qua phải */}
      <path d="M201 157 L201 405 L251 397 L236 151Z" fill={robeColor} stroke="#FFFDF8" strokeOpacity="0.3" strokeWidth="1.2" />

      {/* Cổ áo đứng lập lĩnh tròn cao */}
      <path d="M185 118 Q200 126 215 118 L215 138 Q200 146 185 138Z" fill={robeColor} stroke="#C5972C" strokeWidth="1.5" />
      <path d="M186 136 L200 162 L228 136" fill="none" stroke="#C5972C" strokeWidth="1.8" />

      {/* Đai thắt */}
      <rect x="152" y="250" width="96" height="12" rx="3" fill="#C5972C" opacity="0.8" />

      {/* Tay áo ngũ thân */}
      <ArmSleeves fill={robeColor} />

      {/* 5 cúc vàng truyền thống (Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín) */}
      {[140, 165, 195, 225, 255].map(y => (
        <circle key={y} cx="218" cy={y} r="2.4" fill="#F4D03F" stroke="#997300" strokeWidth="0.8" />
      ))}
    </g>
  );
}

function OccasionAmbiance({ event }: { event?: EventId | null }) {
  if (!event) return null;
  switch (event) {
    case 'tet':
      return (
        <g className="occasion-ambiance occasion-tet" pointerEvents="none">
          {/* Subtle gold ambient glow */}
          <radialGradient id="tetGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FFF3D1" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#FDEBD0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F5EDE0" stopOpacity="0" />
          </radialGradient>
          <rect x="0" y="0" width="400" height="560" fill="url(#tetGlow)" />

          {/* Traditional Red Lantern at top left */}
          <g transform="translate(38, 12)">
            <line x1="16" y1="0" x2="16" y2="22" stroke="#8B1A1A" strokeWidth="1.5" />
            <ellipse cx="16" cy="38" rx="16" ry="18" fill="url(#lanternGradient)" stroke="#8B1A1A" strokeWidth="1.2" />
            <ellipse cx="16" cy="38" rx="8" ry="18" fill="none" stroke="#F1C40F" strokeWidth="0.8" opacity="0.7" />
            <rect x="10" y="19" width="12" height="3" rx="1" fill="#C5972C" />
            <rect x="10" y="55" width="12" height="3" rx="1" fill="#C5972C" />
            {/* Golden tassel */}
            <path d="M16 58 L16 80 M13 80 L19 80" stroke="#F1C40F" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="38" r="4" fill="#FFEAA7" opacity="0.7" />
          </g>

          {/* Curving Spring Blossom Branch at top right */}
          <g transform="translate(290, 8)">
            <path d="M110 5 Q70 25 40 18 Q15 28 -10 22" fill="none" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M40 18 Q30 42 12 50" fill="none" stroke="#5D4037" strokeWidth="1.8" strokeLinecap="round" />
            {/* Golden Apricot Blossoms (Hoa Mai) */}
            <g transform="translate(18, 22)">
              <circle cx="0" cy="-6" r="4" fill="#F4D03F" />
              <circle cx="6" cy="-2" r="4" fill="#F4D03F" />
              <circle cx="4" cy="5" r="4" fill="#F4D03F" />
              <circle cx="-4" cy="5" r="4" fill="#F4D03F" />
              <circle cx="-6" cy="-2" r="4" fill="#F4D03F" />
              <circle cx="0" cy="0" r="2.5" fill="#C0392B" />
            </g>
            <g transform="translate(55, 16) scale(0.85)">
              <circle cx="0" cy="-6" r="4" fill="#F1948A" />
              <circle cx="6" cy="-2" r="4" fill="#F1948A" />
              <circle cx="4" cy="5" r="4" fill="#F1948A" />
              <circle cx="-4" cy="5" r="4" fill="#F1948A" />
              <circle cx="-6" cy="-2" r="4" fill="#F1948A" />
              <circle cx="0" cy="0" r="2.5" fill="#922B21" />
            </g>
            <g transform="translate(85, 8) scale(0.7)">
              <circle cx="0" cy="-6" r="4" fill="#F4D03F" />
              <circle cx="6" cy="-2" r="4" fill="#F4D03F" />
              <circle cx="4" cy="5" r="4" fill="#F4D03F" />
              <circle cx="-4" cy="5" r="4" fill="#F4D03F" />
              <circle cx="-6" cy="-2" r="4" fill="#F4D03F" />
              <circle cx="0" cy="0" r="2.5" fill="#C0392B" />
            </g>
          </g>

          {/* Drifting petals */}
          <ellipse cx="70" cy="180" rx="4" ry="2.5" fill="#F4D03F" opacity="0.6" transform="rotate(25 70 180)" />
          <ellipse cx="330" cy="210" rx="3.5" ry="2" fill="#F1948A" opacity="0.7" transform="rotate(-30 330 210)" />
          <ellipse cx="85" cy="380" rx="3" ry="2" fill="#F4D03F" opacity="0.5" transform="rotate(40 85 380)" />
          <ellipse cx="330" cy="410" rx="4" ry="2.2" fill="#F1948A" opacity="0.6" transform="rotate(15 330 410)" />
        </g>
      );

    case 'le-hoi':
      return (
        <g className="occasion-ambiance occasion-le-hoi" pointerEvents="none">
          {/* Dong Son Bronze Drum Sun Halo */}
          <g transform="translate(200, 240)" opacity="0.16">
            <circle cx="0" cy="0" r="140" fill="none" stroke="#C5972C" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="120" fill="none" stroke="#C5972C" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="90" fill="none" stroke="#C5972C" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="50" fill="none" stroke="#C5972C" strokeWidth="1" />
            {/* 12 Sun Rays */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = Math.cos(angle) * 15;
              const y1 = Math.sin(angle) * 15;
              const x2 = Math.cos(angle) * 85;
              const y2 = Math.sin(angle) * 85;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C5972C" strokeWidth="1.5" />;
            })}
          </g>

          {/* Traditional 5-Color Festival Pennants across top */}
          <g transform="translate(20, 10)">
            {['#C0392B', '#F39C12', '#27AE60', '#2980B9', '#8E44AD', '#C0392B', '#F39C12', '#27AE60'].map((color, i) => (
              <polygon
                key={i}
                points={`${i * 45},0 ${i * 45 + 36},0 ${i * 45 + 18},26`}
                fill={color}
                opacity="0.85"
                stroke="#FFFDF8"
                strokeWidth="0.8"
              />
            ))}
          </g>
        </g>
      );

    case 'ky-yeu':
      return (
        <g className="occasion-ambiance occasion-ky-yeu" pointerEvents="none">
          {/* Warm Graduation Sunlight */}
          <linearGradient id="sunbeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9E6" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#FDEBD0" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <polygon points="0,0 200,0 350,560 0,560" fill="url(#sunbeam)" />

          {/* Red Poinciana Blossoms (Hoa Phượng) top right */}
          <g transform="translate(310, 14)">
            <path d="M80 0 Q40 20 0 28" fill="none" stroke="#4A2E18" strokeWidth="2" />
            <g transform="translate(20, 24)">
              <circle cx="0" cy="-6" r="4.5" fill="#E74C3C" />
              <circle cx="6" cy="-2" r="4.5" fill="#E74C3C" />
              <circle cx="4" cy="5" r="4.5" fill="#E74C3C" />
              <circle cx="-4" cy="5" r="4.5" fill="#E74C3C" />
              <circle cx="-6" cy="-2" r="4.5" fill="#F39C12" />
              <circle cx="0" cy="0" r="2.5" fill="#FFF" />
            </g>
            <g transform="translate(50, 12) scale(0.8)">
              <circle cx="0" cy="-6" r="4.5" fill="#C0392B" />
              <circle cx="6" cy="-2" r="4.5" fill="#E74C3C" />
              <circle cx="4" cy="5" r="4.5" fill="#E74C3C" />
              <circle cx="-4" cy="5" r="4.5" fill="#E74C3C" />
              <circle cx="-6" cy="-2" r="4.5" fill="#E74C3C" />
              <circle cx="0" cy="0" r="2.5" fill="#FFF" />
            </g>
          </g>

          {/* Drifting Poinciana petals */}
          <ellipse cx="60" cy="240" rx="3.5" ry="2" fill="#E74C3C" opacity="0.6" transform="rotate(25 60 240)" />
          <ellipse cx="340" cy="350" rx="4" ry="2" fill="#E74C3C" opacity="0.6" transform="rotate(-20 340 350)" />
        </g>
      );

    case 'khai-giang':
      return (
        <g className="occasion-ambiance occasion-khai-giang" pointerEvents="none">
          {/* Fresh Autumn Breeze / Lotus bud at corner */}
          <g transform="translate(20, 480)" opacity="0.75">
            <ellipse cx="30" cy="40" rx="35" ry="12" fill="#2E7D52" opacity="0.4" />
            <path d="M28 35 Q30 10 32 -10 Q36 8 38 35 Z" fill="#FFF" stroke="#E77B96" strokeWidth="1" />
            <path d="M22 35 Q27 15 32 0 Q25 15 22 35 Z" fill="#FADBD8" opacity="0.7" />
          </g>
        </g>
      );

    case 'di-san':
      return (
        <g className="occasion-ambiance occasion-di-san" pointerEvents="none">
          {/* Imperial Hue Roof Silhouette at horizon */}
          <g transform="translate(200, 220)" opacity="0.15">
            <circle cx="0" cy="0" r="130" fill="none" stroke="#8B1A1A" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="100" fill="none" stroke="#C5972C" strokeWidth="1" strokeDasharray="4 2" />
          </g>
          <path
            d="M20 535 Q100 525 200 525 Q300 525 380 535"
            fill="none"
            stroke="#C5972C"
            strokeWidth="1.2"
            opacity="0.4"
          />
        </g>
      );

    case 'van-nghe':
      return (
        <g className="occasion-ambiance occasion-van-nghe" pointerEvents="none">
          {/* Theatre Stage sparkles & banners */}
          <path d="M0 0 Q200 35 400 0 L400 16 Q200 45 0 16 Z" fill="#8B1A1A" opacity="0.45" />
          {/* Golden star sparkles */}
          {[
            { cx: 50, cy: 70, s: 0.8 },
            { cx: 350, cy: 90, s: 1 },
            { cx: 70, cy: 300, s: 0.7 },
            { cx: 340, cy: 260, s: 0.9 },
          ].map((star, i) => (
            <g key={i} transform={`translate(${star.cx}, ${star.cy}) scale(${star.s})`} fill="#F1C40F" opacity="0.75">
              <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" />
            </g>
          ))}
        </g>
      );

    default:
      return null;
  }
}

function AccessoryIllustration({
  variants,
  primary: _primary,
  secondary,
}: {
  variants: string[];
  primary?: string;
  secondary: string;
}) {
  const selected = new Set(variants);

  return (
    <g className="outfit-accessories">
      {/* ── NÓN LÁ TRUYỀN THỐNG (Hình 1: Phố cổ Hội An) ── */}
      {selected.has('non-la') && (
        <g className="acc-non-la">
          {/* Silk chinstrap (quai nón duyên dáng) */}
          <path d="M165 72 Q158 112 178 142" fill="none" stroke="#58D68D" strokeWidth="2" strokeLinecap="round" />
          <path d="M235 72 Q242 112 222 142" fill="none" stroke="#58D68D" strokeWidth="2" strokeLinecap="round" />
          {/* Conical body — light golden straw */}
          <path d="M200 16 L144 68 Q200 82 256 68 Z" fill="#F4E6BD" stroke="#9E804F" strokeWidth="1.6" />
          {/* Subtle concentric weave rings */}
          <ellipse cx="200" cy="69" rx="54" ry="7" fill="#E8D5A3" stroke="#9E804F" strokeWidth="1.2" />
          <path d="M160 58 Q200 68 240 58" fill="none" stroke="#B89B66" strokeWidth="1.2" />
          <path d="M176 44 Q200 52 224 44" fill="none" stroke="#B89B66" strokeWidth="1.2" />
          <path d="M188 30 Q200 36 212 30" fill="none" stroke="#B89B66" strokeWidth="1.2" />
          {/* Vertical seam */}
          <line x1="200" y1="16" x2="200" y2="76" stroke="#9E804F" strokeWidth="1.2" />
        </g>
      )}

      {/* ── MẤN ĐỘI ĐẦU HOÀNG GIA / CÔ DÂU (Hình 1: Chúc Tết) ── */}
      {selected.has('man-doi-dau') && (
        <g className="acc-man-doi-dau">
          {/* Golden textured mấn như Hình 1 */}
          <path
            d="M166 64 Q200 46 234 64 L232 42 Q200 24 168 42 Z"
            fill="#F4D03F"
            stroke="#B7950B"
            strokeWidth="1.8"
          />
          {/* Fold layers on mấn */}
          <path d="M167 52 Q200 34 233 52" fill="none" stroke="#D4AC0D" strokeWidth="1.5" />
          <path d="M168 42 Q200 24 232 42" fill="none" stroke="#997300" strokeWidth="1.5" />
          <path d="M166 64 Q200 46 234 64" fill="none" stroke="#997300" strokeWidth="1.5" />
          {/* Delicate golden blossom rosette at front */}
          <circle cx="200" cy="42" r="3.5" fill="#E67E22" stroke="#B7950B" strokeWidth="1" />
          <circle cx="200" cy="42" r="1.5" fill="#FFFDF8" />
        </g>
      )}

      {/* ── KHĂN ĐÓNG TRUYỀN THỐNG ── */}
      {selected.has('khan-dong') && (
        <g className="acc-khan-dong">
          <path
            d="M168 66 Q200 52 232 66 L230 46 Q200 32 170 46 Z"
            fill="#1A1A1A"
            stroke="#333333"
            strokeWidth="1.8"
          />
          {/* Horizontal folded tiers */}
          <path d="M169 53 Q200 39 231 53" fill="none" stroke="#3D3D3D" strokeWidth="1.5" />
          <path d="M168 59 Q200 45 232 59" fill="none" stroke="#2B2B2B" strokeWidth="1.5" />
        </g>
      )}

      {/* ── NÓN QUAI THAO BẮC BỘ (Hình 1: Hội Lim mớ ba) ── */}
      {selected.has('non-quai-thao') && (
        <g className="acc-non-quai-thao">
          {/* Flat wide straw disc */}
          <ellipse cx="200" cy="52" rx="76" ry="12" fill="#EAE0C5" stroke="#9E855C" strokeWidth="1.8" />
          {/* Inner ring groove */}
          <ellipse cx="200" cy="52" rx="60" ry="9" fill="none" stroke="#C4B088" strokeWidth="1.2" />
          <ellipse cx="200" cy="52" rx="36" ry="6" fill="#DECFA6" stroke="#9E855C" strokeWidth="1" />
          {/* Small crown hub */}
          <ellipse cx="200" cy="50" rx="16" ry="3.5" fill="#BFA673" />
          {/* Cascading light green silk ribbon ties (quai thao buông dài rủ hai bên như Hình 1) */}
          <path d="M142 54 Q136 120 148 200" fill="none" stroke="#58D68D" strokeWidth="3" strokeLinecap="round" />
          <path d="M258 54 Q264 120 252 200" fill="none" stroke="#58D68D" strokeWidth="3" strokeLinecap="round" />
          {/* Ribbon ends */}
          <line x1="146" y1="200" x2="149" y2="215" stroke="#58D68D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="254" y1="200" x2="251" y2="215" stroke="#58D68D" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {/* ── MŨ BERET ĐÔNG DƯƠNG ── */}
      {selected.has('mu-beret') && (
        <g className="acc-mu-beret">
          <path
            d="M168 67 Q178 40 208 42 Q233 46 233 65 Q208 73 168 67 Z"
            fill="#2C3E50"
            stroke="#1A252F"
            strokeWidth="2"
          />
          <line x1="204" y1="41" x2="204" y2="35" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {/* ── KHĂN MỎ QUẠ ── */}
      {selected.has('khan-mo-qua') && (
        <path
          className="acc-khan-mo-qua"
          d="M166 69 Q200 52 234 69 L220 86 L200 78 L180 88 Z"
          fill="#1D1A19"
          stroke="#101010"
          strokeWidth="1.8"
        />
      )}

      {/* ── KHĂN RẰN NAM BỘ ── */}
      {selected.has('khan-ran') && (
        <g className="acc-khan-ran">
          {/* Neck wrap */}
          <path d="M170 130 Q200 148 230 130 L226 150 Q200 162 174 150 Z" fill="#F4EFE6" stroke="#2C2C2C" strokeWidth="1.5" />
          {/* Left drape hanging down */}
          <path d="M172 136 L164 275 L178 275 L186 142 Z" fill="#F4EFE6" stroke="#2C2C2C" strokeWidth="1.5" />
          {/* Right drape hanging down */}
          <path d="M228 136 L236 275 L222 275 L214 142 Z" fill="#F4EFE6" stroke="#2C2C2C" strokeWidth="1.5" />
          {/* Checkered pattern lines */}
          <g stroke="#1A1A1A" strokeWidth="1.8" opacity="0.85">
            {[144, 158, 172, 186, 200, 214, 228, 242, 256, 270].map(y => (
              <React.Fragment key={y}>
                <line x1="165" y1={y} x2="178" y2={y} />
                <line x1="222" y1={y} x2="235" y2={y} />
              </React.Fragment>
            ))}
            <line x1="170" y1="138" x2="170" y2="274" strokeDasharray="4 4" />
            <line x1="230" y1="138" x2="230" y2="274" strokeDasharray="4 4" />
          </g>
          {/* Fringed tassels at bottom of scarf */}
          <path d="M164 275 L164 283 M168 275 L168 284 M172 275 L172 284 M176 275 L176 283" stroke="#2C2C2C" strokeWidth="1.2" />
          <path d="M224 275 L224 283 M228 275 L228 284 M232 275 L232 284 M236 275 L236 283" stroke="#2C2C2C" strokeWidth="1.2" />
        </g>
      )}

      {/* ── KHĂN LỤA TƠ TẰM ── */}
      {selected.has('khan-lua') && (
        <g className="acc-khan-lua">
          <path d="M172 134 Q200 148 228 134 L222 170 Q210 182 202 165 L198 146 Z" fill={secondary} stroke="#FFFDF8" strokeWidth="1" opacity="0.9" />
          <path d="M202 165 L218 215 L208 220 L196 168 Z" fill={secondary} opacity="0.85" />
        </g>
      )}

      {/* ── KIỀNG BẠC CỔ TRUYỀN (Huyền thoại Áo Dài) ── */}
      {selected.has('kieng-bac') && (
        <g className="acc-kieng-bac">
          {/* Silver metallic torc around neck */}
          <ellipse cx="200" cy="142" rx="22" ry="11" fill="none" stroke="url(#silverGradient)" strokeWidth="4" />
          <ellipse cx="200" cy="142" rx="22" ry="11" fill="none" stroke="#FFF" strokeWidth="1" opacity="0.75" />
          {/* Front engraved lotus medallion */}
          <circle cx="200" cy="153" r="4" fill="url(#silverGradient)" stroke="#8A9BA8" strokeWidth="1" />
          <circle cx="200" cy="153" r="1.5" fill="#FFFDF8" />
        </g>
      )}

      {/* ── CHUỖI VÒNG NGỌC TRAI ── */}
      {selected.has('chuoi-ngoc') && (
        <g className="acc-chuoi-ngoc">
          {[-20, -15, -10, -5, 0, 5, 10, 15, 20].map((dx, idx) => {
            const py = 142 + (1 - Math.abs(dx) / 24) * 16;
            return (
              <g key={idx} transform={`translate(${200 + dx}, ${py})`}>
                <circle cx="0" cy="0" r="2.6" fill="#FFFDF8" stroke="#D5D0C5" strokeWidth="0.8" />
                <circle cx="-0.8" cy="-0.8" r="0.9" fill="#FFF" />
              </g>
            );
          })}
        </g>
      )}

      {/* ── DÂY CHUYỀN VÀNG HOA SEN ── */}
      {selected.has('day-chuyen') && (
        <g className="acc-day-chuyen">
          <path d="M188 136 Q200 164 212 136" fill="none" stroke="#F1C40F" strokeWidth="1.2" />
          <circle cx="200" cy="164" r="3" fill="#F1C40F" stroke="#C5972C" strokeWidth="1" />
          <polygon points="200,161 202,164 200,167 198,164" fill="#C0392B" />
        </g>
      )}

      {/* ── BÔNG TAI NGỌC TRAI ── */}
      {selected.has('bong-tai-don-gian') && (
        <g className="acc-bong-tai">
          {/* Left ear */}
          <line x1="168" y1="93" x2="168" y2="101" stroke="#C5972C" strokeWidth="1.2" />
          <circle cx="168" cy="103" r="2.8" fill="#FFFDF8" stroke="#D5D0C5" strokeWidth="0.8" />
          <circle cx="167.2" cy="102.2" r="0.8" fill="#FFF" />
          {/* Right ear */}
          <line x1="232" y1="93" x2="232" y2="101" stroke="#C5972C" strokeWidth="1.2" />
          <circle cx="232" cy="103" r="2.8" fill="#FFFDF8" stroke="#D5D0C5" strokeWidth="0.8" />
          <circle cx="231.2" cy="102.2" r="0.8" fill="#FFF" />
        </g>
      )}

      {/* ── VÒNG NGỌC CẨM THẠCH (Đeo cổ tay) ── */}
      {selected.has('vong-ngoc') && (
        <g className="acc-vong-ngoc">
          <ellipse cx="265" cy="304" rx="10" ry="4.5" fill="none" stroke="#27AE60" strokeWidth="3.2" />
          <ellipse cx="265" cy="304" rx="10" ry="4.5" fill="none" stroke="#A9DFBF" strokeWidth="1" opacity="0.8" />
        </g>
      )}

      {/* ── TRÂM CÀI TÓC HOA SEN ── */}
      {selected.has('tram-cai') && (
        <g className="acc-tram-cai" strokeLinecap="round">
          <path d="M174 58 L230 50" stroke="#F1C40F" strokeWidth="2.5" />
          <circle cx="230" cy="50" r="4.5" fill="#F1C40F" stroke="#C5972C" strokeWidth="1" />
          <circle cx="230" cy="50" r="2" fill="#E74C3C" />
          {/* Dangling pearl string */}
          <path d="M230 54 L232 64" stroke="#F1C40F" strokeWidth="1" />
          <circle cx="232" cy="65" r="1.8" fill="#FFFDF8" />
        </g>
      )}

      {/* ── HOA TƯƠI CÀI TÓC ── */}
      {selected.has('kep-toc-hoa') && (
        <g className="acc-kep-toc-hoa" transform="translate(228, 68)">
          <circle cx="0" cy="-4" r="3.5" fill="#F1948A" />
          <circle cx="4" cy="-1" r="3.5" fill="#F1948A" />
          <circle cx="3" cy="4" r="3.5" fill="#F1948A" />
          <circle cx="-3" cy="4" r="3.5" fill="#F1948A" />
          <circle cx="-4" cy="-1" r="3.5" fill="#F1948A" />
          <circle cx="0" cy="0" r="2" fill="#F4D03F" />
        </g>
      )}

      {/* ── BĂNG ĐÔ LỤA ── */}
      {selected.has('bang-do') && (
        <path
          className="acc-bang-do"
          d="M170 72 Q200 48 230 72"
          fill="none"
          stroke={secondary}
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}

      {/* ── TÚI THÊU / CLUTCH / TÚI VẢI ── */}
      {(selected.has('tui-theu') || selected.has('tui-xach-nho') || selected.has('tui-vai')) && (
        <g className="acc-bag">
          {selected.has('tui-theu') && (
            <g transform="translate(268, 252)">
              <path d="M-3 0 Q-1 20 6 35" fill="none" stroke="#C5972C" strokeWidth="1.5" />
              <path d="M-4 35 Q8 30 20 35 L22 66 Q8 74 -6 66 Z" fill={secondary} stroke="#8B1A1A" strokeWidth="1.8" />
              <circle cx="8" cy="50" r="5" fill="#FADBD8" />
              <circle cx="8" cy="50" r="2" fill="#F1C40F" />
              <line x1="8" y1="70" x2="8" y2="86" stroke="#F1C40F" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}
          {selected.has('tui-xach-nho') && (
            <g transform="translate(268, 275)">
              <rect x="0" y="0" width="34" height="24" rx="4" fill="#2C3E50" stroke="#C5972C" strokeWidth="1.5" />
              <rect x="14" y="2" width="6" height="4" rx="1" fill="#F1C40F" />
            </g>
          )}
          {selected.has('tui-vai') && (
            <g transform="translate(268, 260)">
              <path d="M4 0 L4 20 M26 0 L26 20" stroke="#8D6E63" strokeWidth="2" />
              <rect x="0" y="20" width="32" height="42" rx="3" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1.8" />
            </g>
          )}
        </g>
      )}

      {/* ── QUẠT LỤA / QUẠT GIẤY ── */}
      {(selected.has('quat-lua') || selected.has('quat-giay')) && (
        <g className="acc-fan" transform="translate(278, 252)">
          <path
            d="M0 48 Q-30 10 0 -12 Q30 10 0 48 Z"
            fill={selected.has('quat-lua') ? '#FCE4D6' : '#FFF9E6'}
            stroke="#8B1A1A"
            strokeWidth="1.8"
          />
          <path d="M0 48 L0 -12 M0 48 L-18 6 M0 48 L18 6" stroke="#C5972C" strokeWidth="1.2" />
          {selected.has('quat-lua') && (
            <circle cx="2" cy="12" r="4" fill="#E74C3C" opacity="0.8" />
          )}
          <line x1="0" y1="48" x2="0" y2="58" stroke="#8B1A1A" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="58" x2="0" y2="76" stroke="#C5972C" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

function Shoes({ variants, garment }: { variants: string[]; garment?: GarmentId }) {
  const isSneaker = variants.includes('sneaker') || (garment === 'ao-ba-ba' && !variants.includes('guoc') && !variants.includes('giay-cao-got') && !variants.includes('dep-co'));
  const isHeels = variants.includes('giay-cao-got');

  if (isHeels) {
    return (
      <g className="shoes-high-heels">
        <path d="M152 524 Q174 518 194 524 Q197 530 191 536 L156 536 L153 530 Z" fill="#1A1A1A" stroke="#333" strokeWidth="1.2" />
        <line x1="154" y1="530" x2="154" y2="542" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M206 524 Q226 518 248 524 Q252 530 246 536 L211 536 L208 530 Z" fill="#1A1A1A" stroke="#333" strokeWidth="1.2" />
        <line x1="246" y1="530" x2="246" y2="542" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    );
  }

  if (isSneaker) {
    // Giày sneaker trắng hiện đại như Hình 1 (Phố cổ Hội An, bản street)
    return (
      <g className="shoes-sneaker">
        {/* Giày trái */}
        <path d="M156 522 Q177 517 197 522 Q200 529 195 536 L156 536 Z" fill="#FFFDF8" stroke="#A6B0BA" strokeWidth="1.4" />
        <rect x="156" y="533" width="41" height="5" rx="1.5" fill="#E8ECEF" stroke="#95A5A6" strokeWidth="0.8" />
        <line x1="172" y1="525" x2="185" y2="525" stroke="#7F8C8D" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="173" y1="528" x2="184" y2="528" stroke="#7F8C8D" strokeWidth="1.2" strokeLinecap="round" />
        {/* Giày phải */}
        <path d="M203 522 Q223 517 244 522 Q248 529 243 536 L204 536 Z" fill="#FFFDF8" stroke="#A6B0BA" strokeWidth="1.4" />
        <rect x="203" y="533" width="41" height="5" rx="1.5" fill="#E8ECEF" stroke="#95A5A6" strokeWidth="0.8" />
        <line x1="215" y1="525" x2="228" y2="525" stroke="#7F8C8D" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="216" y1="528" x2="227" y2="528" stroke="#7F8C8D" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    );
  }

  // Guốc mộc truyền thống (Hình 1: Chúc Tết & Hội Lim)
  const strapColor = garment === 'ao-tu-than' ? '#58D68D' : garment === 'ao-dai' ? '#F4D03F' : '#C0392B';
  const woodColor = '#C89D6C';

  return (
    <g className="shoes-guoc-go">
      {/* Đế guốc mộc trái */}
      <path d="M154 524 Q176 518 196 524 L194 536 Q176 532 154 536 Z" fill={woodColor} stroke="#6E4424" strokeWidth="1.4" />
      {/* Quai guốc trái */}
      <path d="M166 520 Q176 514 186 520" fill="none" stroke={strapColor} strokeWidth="3.2" strokeLinecap="round" />

      {/* Đế guốc mộc phải */}
      <path d="M204 524 Q224 518 246 524 L244 536 Q224 532 204 536 Z" fill={woodColor} stroke="#6E4424" strokeWidth="1.4" />
      {/* Quai guốc phải */}
      <path d="M214 520 Q224 514 234 520" fill="none" stroke={strapColor} strokeWidth="3.2" strokeLinecap="round" />
    </g>
  );
}

export const OutfitVisualization: React.FC<OutfitVisualizationProps> = ({
  garment,
  accessoryVariants = [],
  primaryColor,
  secondaryColor,
  accentColor: _accentColor,
  remixLevel,
  character = DEFAULT_CHARACTER_ID,
  event,
  size = 'md',
}) => {
  const primary = getHex(primaryColor, '#FFFFF0');
  const secondary = getHex(secondaryColor, '#722F37');
  const profile = getRepresentativeCharacter(character);

  const sizeMap = { sm: 200, md: 320, lg: 420 };
  const viewSize = sizeMap[size];

  const GarmentComponent = {
    'ao-dai': AoDai,
    'ao-ngu-than': AoNguThan,
    'ao-tu-than': AoTuThan,
    'ao-ba-ba': AoBaBa,
  }[garment] || AoDai;

  return (
    <div className="outfit-visual" style={{ maxWidth: viewSize, position: 'relative' }}>
      <svg
        viewBox="0 0 400 560"
        width="100%"
        height="100%"
        style={{ padding: '16px' }}
        role="img"
        aria-label={`Minh họa trang phục ${garment}`}
      >
        <defs>
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#DDE4EA" />
            <stop offset="60%" stopColor="#A8B7C4" />
            <stop offset="100%" stopColor="#EBF0F5" />
          </linearGradient>
          <linearGradient id="manGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5C0F0F" />
            <stop offset="50%" stopColor="#8B1A1A" />
            <stop offset="100%" stopColor="#5C0F0F" />
          </linearGradient>
          <linearGradient id="lanternGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#96281B" />
            <stop offset="50%" stopColor="#D91E18" />
            <stop offset="100%" stopColor="#96281B" />
          </linearGradient>
        </defs>

        {/* Occasion Ambiance Backdrop */}
        <OccasionAmbiance event={event} />

        <g transform={`translate(200 535) scale(${profile.widthScale} ${profile.heightScale}) translate(-200 -535)`}>
          <BaseFigure profile={profile} />
          <GarmentComponent primary={primary} secondary={secondary} remix={remixLevel} />
          <CharacterHead profile={profile} isTuThan={garment === 'ao-tu-than'} />
          <Hands skinTone={profile.skinTone} />
          <AccessoryIllustration variants={accessoryVariants} primary={primary} secondary={secondary} />
          <Shoes variants={accessoryVariants} garment={garment} />
        </g>
      </svg>
    </div>
  );
};

export const CharacterPortrait: React.FC<{ character: CharacterId; size?: number }> = ({ character, size = 56 }) => {
  const profile = getRepresentativeCharacter(character);
  return (
    <svg
      viewBox="145 38 110 112"
      width={size}
      height={size}
      role="img"
      aria-label={`Minh họa nhân vật ${profile.name}, ${profile.description}`}
    >
      <circle cx="200" cy="94" r="55" fill="#F3E7D7" />
      <CharacterHead profile={profile} />
      <path d="M163 151 Q166 132 184 128 L216 128 Q234 132 237 151Z" fill="#8B1A1A" />
      <path d="M192 131 L200 141 L208 131" fill="none" stroke="#D4A843" strokeWidth="2" />
    </svg>
  );
};

// Mini swatch visualization for cards
export const OutfitMiniVis: React.FC<{
  garment: GarmentId;
  colors: (ColorId | string)[];
  character?: CharacterId;
  accessoryVariants?: string[];
  event?: EventId;
}> = ({ garment, colors, character = DEFAULT_CHARACTER_ID, accessoryVariants = [], event }) => {
  const primary = colors[0] ? getHex(colors[0], '#FFFFF0') : '#FFFFF0';
  const secondary = colors[1] ? getHex(colors[1], '#722F37') : '#722F37';
  const profile = getRepresentativeCharacter(character);

  const GarmentComponent = {
    'ao-dai': AoDai,
    'ao-ngu-than': AoNguThan,
    'ao-tu-than': AoTuThan,
    'ao-ba-ba': AoBaBa,
  }[garment] || AoDai;

  return (
    <svg viewBox="0 0 400 560" width="100%" height="100%" role="img" aria-label={`Trang phục ${garment}`}>
      <defs>
        <linearGradient id="silverGradientMini" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#A8B7C4" />
          <stop offset="100%" stopColor="#EBF0F5" />
        </linearGradient>
        <linearGradient id="manGradientMini" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5C0F0F" />
          <stop offset="50%" stopColor="#8B1A1A" />
          <stop offset="100%" stopColor="#5C0F0F" />
        </linearGradient>
        <linearGradient id="lanternGradientMini" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#96281B" />
          <stop offset="50%" stopColor="#D91E18" />
          <stop offset="100%" stopColor="#96281B" />
        </linearGradient>
      </defs>
      <OccasionAmbiance event={event} />
      <g transform={`translate(200 535) scale(${profile.widthScale} ${profile.heightScale}) translate(-200 -535)`}>
        <BaseFigure profile={profile} />
        <GarmentComponent primary={primary} secondary={secondary} remix={50} />
        <CharacterHead profile={profile} isTuThan={garment === 'ao-tu-than'} />
        <Hands skinTone={profile.skinTone} />
        <AccessoryIllustration variants={accessoryVariants} primary={primary} secondary={secondary} />
        <Shoes variants={accessoryVariants} garment={garment} />
      </g>
    </svg>
  );
};

export default OutfitVisualization;

