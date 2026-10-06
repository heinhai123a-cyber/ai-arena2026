import React from 'react';

interface RemixTapeBadgeProps {
  level: number;
  label?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const RemixTapeBadge: React.FC<RemixTapeBadgeProps> = ({
  level,
  label,
  width,
  height,
  className = '',
  style,
}) => {
  // If label is not explicitly provided, compute standard label from level
  const displayLabel = label || (level <= 33 ? 'Nguyên bản' : level <= 66 ? 'Cách tân' : 'Remix mạnh');
  const displayText = `${displayLabel} · ${level}%`;

  // Determine soft vibrant color tier
  const isOriginal = level <= 33;
  const isModern = level > 33 && level <= 66;

  const bgFill = isOriginal ? '#E8F4EC' : isModern ? '#FEF7DE' : '#FDECE8';
  const strokeColor = isOriginal ? '#A3D5B3' : isModern ? '#F7D76A' : '#F4A8A0';
  const textColor = isOriginal ? '#225232' : isModern ? '#5C4400' : '#8A271B';
  const dotColor = isOriginal ? '#3F7A52' : isModern ? '#D9A81E' : '#D6402F';

  return (
    <div
      className={`remix-tape-badge ${className}`}
      role="img"
      aria-label={`Độ Remix hiện tại: ${displayText}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        padding: '5px 12px',
        minHeight: height ? (typeof height === 'number' ? `${height}px` : height) : '28px',
        minWidth: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
        borderRadius: 'var(--radius-full)',
        background: bgFill,
        border: `1.5px solid ${strokeColor}`,
        color: textColor,
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: "'Be Vietnam Pro', system-ui, -apple-system, sans-serif",
        lineHeight: 1,
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 3px rgba(29, 47, 74, 0.08)',
        userSelect: 'none',
        ...style,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: dotColor,
          flexShrink: 0,
          display: 'inline-block',
        }}
        aria-hidden="true"
      />
      <span style={{ letterSpacing: '-0.01em' }}>{displayText}</span>
    </div>
  );
};

export default RemixTapeBadge;
