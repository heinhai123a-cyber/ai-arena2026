import React from 'react';

interface LotusLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * LotusLogo — Logo hoa sen tối giản (minimalist) & sáng tạo (creative).
 * 
 * Ý tưởng thiết kế:
 * - Tinh giản (Basic/Minimal): Các đường nét hình học sắc sảo, thanh thoát,
 *   loại bỏ chi tiết rườm rà của emoji, tạo phong thái logo thương hiệu thời trang cao cấp.
 * - Sáng tạo (Creative):
 *   + Các cánh sen được tạo hình như các tà lụa / vạt áo Giao Lĩnh xếp lớp đan chéo.
 *   + Tâm hoa sen là biểu tượng ánh sao 4 cánh (✦) tượng trưng cho "Remix" — giao thoa giữa di sản và hiện đại.
 *   + Hiệu ứng Gradient kim hoàng gia (Imperial Gold) sang trọng, đồng bộ với sắc đỏ thẫm của nền.
 */
export const LotusLogo: React.FC<LotusLogoProps> = ({
  size = 28,
  className = '',
  style,
}) => {
  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`lotus-brand-logo ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35))',
        ...style,
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Imperial Gold Metallic Gradient */}
        <linearGradient id="lotusGoldGrad" x1="18" y1="2" x2="18" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF3D1" />
          <stop offset="35%" stopColor="#E5B842" />
          <stop offset="70%" stopColor="#C5972C" />
          <stop offset="100%" stopColor="#8F6815" />
        </linearGradient>

        {/* Soft Golden Glow for central core */}
        <linearGradient id="lotusCoreGrad" x1="18" y1="10" x2="18" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFDE82" />
          <stop offset="100%" stopColor="#D4A843" />
        </linearGradient>
      </defs>

      {/* ── Cánh chính giữa (Tháp búp / Vạt áo trung tâm) ── */}
      <path
        d="M18 3.5C14.8 9.5 14.8 17 18 24C21.2 17 21.2 9.5 18 3.5Z"
        fill="url(#lotusGoldGrad)"
      />

      {/* ── Cánh trong bên trái (Vạt lụa lượn sóng) ── */}
      <path
        d="M16.5 8C12 11.5 9 17.5 10 23.5C12.5 21 15 17 16.5 12V8Z"
        fill="url(#lotusGoldGrad)"
        fillOpacity="0.9"
      />

      {/* ── Cánh trong bên phải ── */}
      <path
        d="M19.5 8C24 11.5 27 17.5 26 23.5C23.5 21 21 17 19.5 12V8Z"
        fill="url(#lotusGoldGrad)"
        fillOpacity="0.9"
      />

      {/* ── Cánh ngoài xòe bên trái (Cánh sen đón sương / Tà áo bay) ── */}
      <path
        d="M13.5 15C8 17 4 21 4.5 26C8.5 25.5 12.5 23 15 19L13.5 15Z"
        fill="url(#lotusGoldGrad)"
        fillOpacity="0.8"
      />

      {/* ── Cánh ngoài xòe bên phải ── */}
      <path
        d="M22.5 15C28 17 32 21 31.5 26C27.5 25.5 23.5 23 21 19L22.5 15Z"
        fill="url(#lotusGoldGrad)"
        fillOpacity="0.8"
      />

      {/* ── Đài sen / Đế gương (Golden Pedestal) ── */}
      <path
        d="M12 28.5C14 30.2 22 30.2 24 28.5C22 29.5 14 29.5 12 28.5Z"
        stroke="url(#lotusGoldGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="28.8" r="1.2" fill="url(#lotusCoreGrad)" />

      {/* ── Tâm sáng Remixed Sparkle (✦) ── */}
      <path
        d="M18 12.5C18 14.5 17 15.5 15 15.5C17 15.5 18 16.5 18 18.5C18 16.5 19 15.5 21 15.5C19 15.5 18 14.5 18 12.5Z"
        fill="url(#lotusCoreGrad)"
      />
    </svg>
  );
};

export default LotusLogo;
