import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Sparkles, Shuffle, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import {
  generateRandomOutfitForOccasion,
  generateRandomOutfitAll,
  occasionRules,
  type GeneratedOutfitSet,
  type OutfitTop,
} from '../content/outfitParts';
import type { EventId } from '../types';

// ═══════════════════════════════════════════
// Floating Particles Animation Component
// ═══════════════════════════════════════════
const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string }[] = [];
    const colors = ['#C5972C', '#8B1A1A', '#D4A843', '#2D6B4F', '#C0392B'];

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.2,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10 || p.x > canvas.width + 10) { p.x = Math.random() * canvas.width; }
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

// ═══════════════════════════════════════════
// Shimmer Effect for Cards
// ═══════════════════════════════════════════
const ShimmerOverlay: React.FC = () => (
  <div
    className="shimmer-overlay"
    style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.15) 37%, transparent 63%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 2.5s ease-in-out infinite',
      pointerEvents: 'none',
      borderRadius: 'inherit',
    }}
  />
);

// ═══════════════════════════════════════════
// Outfit Card Component with animations
// ═══════════════════════════════════════════
interface OutfitPartCardProps {
  label: string;
  icon: string;
  name: string;
  description: string;
  colors: string[];
  hexColors: string[];
  delay: number;
}

const OutfitPartCard: React.FC<OutfitPartCardProps> = ({ label, icon, name, description, colors, hexColors, delay }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="outfit-part-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'var(--color-white)',
        border: '1px solid var(--color-silver-light)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ShimmerOverlay />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
        <span style={{ fontSize: '1.3rem' }}>{icon}</span>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-gold-dark)',
        }}>
          {label}
        </span>
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 var(--space-1) 0' }}>
        {name}
      </h4>
      <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-tertiary)', lineHeight: 1.5, margin: 0 }}>
        {description}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-1)', marginTop: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
        {hexColors.map((hex, i) => (
          <div
            key={hex}
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: hex,
              border: '2px solid var(--color-silver-light)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }}
            title={colors[i]}
          />
        ))}
        <span style={{ fontSize: '0.72rem', color: 'var(--color-slate)', marginLeft: 'var(--space-1)' }}>
          {colors.join(' · ')}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// Garment Image Map
// ═══════════════════════════════════════════
const garmentImages: Record<string, string> = {
  'ao-dai': './images/outfits/ao-dai-red.jpg',
  'ao-tu-than': './images/outfits/ao-tu-than.jpg',
  'ao-ba-ba': './images/outfits/ao-ba-ba.jpg',
  'ao-ngu-than': './images/outfits/ao-ngu-than.jpg',
};

// ═══════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════
const OutfitAssemblyPage: React.FC = () => {
  useDocumentTitle('Lắp Ráp Trang Phục — Outfit Assembly');
  const [selectedOccasion, setSelectedOccasion] = useState<EventId | null>(null);
  const [currentOutfit, setCurrentOutfit] = useState<GeneratedOutfitSet | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [savedOutfits, setSavedOutfits] = useState<GeneratedOutfitSet[]>([]);
  const [animKey, setAnimKey] = useState(0);

  const handleGenerate = useCallback(() => {
    setIsSpinning(true);
    setCurrentOutfit(null);
    setShowDetails(false);
    setAnimKey(prev => prev + 1);

    // Spin animation delay
    setTimeout(() => {
      const outfit = selectedOccasion
        ? generateRandomOutfitForOccasion(selectedOccasion)
        : generateRandomOutfitAll();
      setCurrentOutfit(outfit);
      setIsSpinning(false);
    }, 1200);
  }, [selectedOccasion]);

  const handleSave = useCallback(() => {
    if (currentOutfit) {
      setSavedOutfits(prev => [currentOutfit, ...prev].slice(0, 10));
    }
  }, [currentOutfit]);

  const getGarmentImage = (top: OutfitTop) => {
    const garmentType = typeof top.garmentType === 'string' ? top.garmentType : 'ao-dai';
    return garmentImages[garmentType] || garmentImages['ao-dai'];
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)' }}>
      {/* ═══ Hero Section with floating particles ═══ */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1A0A0A 0%, #5C0F0F 40%, #8B1A1A 70%, #C5972C 100%)',
          padding: 'var(--space-12) var(--space-4)',
          textAlign: 'center',
          color: 'var(--color-white)',
        }}
      >
        <FloatingParticles />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          {/* Banner Image */}
          <div style={{
            marginBottom: 'var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
            <img
              src="./images/outfits/banner.jpg"
              alt="Vietnamese Heritage Fashion Showcase"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              loading="eager"
            />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'rgba(197, 151, 44, 0.2)',
            backdropFilter: 'blur(8px)',
            padding: '6px 16px',
            borderRadius: '999px',
            marginBottom: 'var(--space-4)',
            border: '1px solid rgba(197, 151, 44, 0.3)',
          }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em' }}>
              PHỐI ĐỒ THÔNG MINH
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            margin: '0 0 var(--space-3)',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}>
            Lắp Ráp Trang Phục Việt
          </h1>
          <p style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            color: 'rgba(255,253,248,0.85)',
            maxWidth: 600,
            margin: '0 auto var(--space-6)',
            lineHeight: 1.6,
          }}>
            Chọn dịp → bấm nút → hệ thống tự phối bộ trang phục Việt hợp lý từ áo, quần, nón, giày đến phụ kiện.
            Mỗi lần bấm là một bộ mới!
          </p>
        </div>
      </section>

      {/* ═══ Occasion Selector ═══ */}
      <section style={{
        maxWidth: 900,
        margin: '-40px auto 0',
        padding: '0 var(--space-4)',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          boxShadow: '0 8px 40px rgba(26, 10, 10, 0.12)',
          border: '1px solid var(--color-silver-light)',
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--color-ink)',
            margin: '0 0 var(--space-4)',
            textAlign: 'center',
          }}>
            🎯 Chọn dịp sử dụng
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-5)',
          }}>
            {/* "All occasions" option */}
            <button
              onClick={() => setSelectedOccasion(null)}
              style={{
                padding: 'var(--space-3) var(--space-2)',
                borderRadius: 'var(--radius-md)',
                border: selectedOccasion === null
                  ? '2px solid var(--color-crimson)'
                  : '1px solid var(--color-silver-light)',
                background: selectedOccasion === null
                  ? 'var(--color-crimson-soft)'
                  : 'var(--color-paper-soft)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                transform: selectedOccasion === null ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🎲</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-ink)' }}>Ngẫu nhiên</div>
            </button>

            {occasionRules.map(rule => (
              <button
                key={rule.eventId}
                onClick={() => setSelectedOccasion(rule.eventId)}
                style={{
                  padding: 'var(--space-3) var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  border: selectedOccasion === rule.eventId
                    ? '2px solid var(--color-crimson)'
                    : '1px solid var(--color-silver-light)',
                  background: selectedOccasion === rule.eventId
                    ? 'var(--color-crimson-soft)'
                    : 'var(--color-paper-soft)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  transform: selectedOccasion === rule.eventId ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{rule.icon}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-ink)' }}>
                  {rule.name.split('/')[0].trim()}
                </div>
              </button>
            ))}
          </div>

          {/* Generate Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              id="generate-outfit-btn"
              onClick={handleGenerate}
              disabled={isSpinning}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-7)',
                borderRadius: '999px',
                border: 'none',
                background: isSpinning
                  ? 'var(--color-slate)'
                  : 'linear-gradient(135deg, var(--color-crimson) 0%, var(--color-crimson-deep) 100%)',
                color: 'var(--color-white)',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: isSpinning ? 'wait' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isSpinning ? 'none' : '0 4px 20px rgba(139, 26, 26, 0.35)',
                animation: isSpinning ? 'pulse 0.8s ease-in-out infinite' : 'none',
              }}
            >
              <Shuffle
                size={20}
                style={{
                  animation: isSpinning ? 'spin 0.6s linear infinite' : 'none',
                }}
              />
              {isSpinning ? 'Đang phối đồ...' : 'Phối đồ ngay!'}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Generated Outfit Display ═══ */}
      {currentOutfit && (
        <section
          key={animKey}
          style={{
            maxWidth: 900,
            margin: 'var(--space-8) auto',
            padding: '0 var(--space-4)',
          }}
        >
          {/* Outfit Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-paper-warm), var(--color-cream-warm))',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            border: '1px solid var(--color-gold-soft)',
            marginBottom: 'var(--space-4)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, rgba(197,151,44,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: '1.6rem' }}>{currentOutfit.occasion.icon}</span>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}>
                  {currentOutfit.occasion.name}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-tertiary)', margin: '2px 0 0' }}>
                  {currentOutfit.occasion.description}
                </p>
              </div>
            </div>

            {/* Color Mood Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'rgba(197, 151, 44, 0.12)',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(197, 151, 44, 0.25)',
            }}>
              <span style={{ fontSize: '0.75rem' }}>🎨</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gold-dark)' }}>
                {currentOutfit.colorMood}
              </span>
            </div>
          </div>

          {/* Outfit Illustration + Parts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 1fr) 2fr',
            gap: 'var(--space-4)',
            alignItems: 'start',
          }}>
            {/* Left: Illustration */}
            <div style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-3)',
              border: '1px solid var(--color-silver-light)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              position: 'sticky',
              top: 'var(--space-4)',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}>
                <img
                  src={getGarmentImage(currentOutfit.top)}
                  alt={currentOutfit.top.nameVi}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    animation: 'fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 'var(--space-4) var(--space-3) var(--space-3)',
                  background: 'linear-gradient(transparent, rgba(26,10,10,0.85))',
                  color: 'var(--color-white)',
                }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{currentOutfit.top.nameVi}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>{currentOutfit.top.material} · {currentOutfit.top.style === 'truyen-thong' ? 'Truyền thống' : currentOutfit.top.style === 'cach-tan' ? 'Cách tân' : 'Remix'}</div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{
                display: 'flex',
                gap: 'var(--space-2)',
                marginTop: 'var(--space-3)',
                justifyContent: 'center',
              }}>
                <button
                  onClick={handleSave}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: '1px solid var(--color-crimson-soft)',
                    background: 'var(--color-red-soft)',
                    color: 'var(--color-crimson)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Heart size={14} /> Lưu
                </button>
                <button
                  onClick={handleGenerate}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: '1px solid var(--color-gold-soft)',
                    background: 'var(--color-yellow-soft)',
                    color: 'var(--color-gold-dark)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Shuffle size={14} /> Phối lại
                </button>
              </div>
            </div>

            {/* Right: Parts Grid */}
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {/* Top */}
              <OutfitPartCard
                label="Áo"
                icon="👘"
                name={currentOutfit.top.nameVi}
                description={currentOutfit.top.description}
                colors={currentOutfit.top.colors}
                hexColors={currentOutfit.top.hexColors}
                delay={100}
              />

              {/* Bottom */}
              <OutfitPartCard
                label="Quần / Váy"
                icon="👖"
                name={currentOutfit.bottom.nameVi}
                description={currentOutfit.bottom.description}
                colors={currentOutfit.bottom.colors}
                hexColors={currentOutfit.bottom.hexColors}
                delay={200}
              />

              {/* Headwear */}
              {currentOutfit.headwear && (
                <OutfitPartCard
                  label="Nón / Khăn"
                  icon="🎩"
                  name={currentOutfit.headwear.nameVi}
                  description={currentOutfit.headwear.description}
                  colors={currentOutfit.headwear.colors}
                  hexColors={currentOutfit.headwear.hexColors}
                  delay={300}
                />
              )}

              {/* Footwear */}
              <OutfitPartCard
                label="Giày dép"
                icon="👠"
                name={currentOutfit.footwear.nameVi}
                description={currentOutfit.footwear.description}
                colors={currentOutfit.footwear.colors}
                hexColors={currentOutfit.footwear.hexColors}
                delay={400}
              />

              {/* Accessories */}
              {currentOutfit.accessories.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      width: '100%',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-gold-soft)',
                      background: 'var(--color-yellow-soft)',
                      cursor: 'pointer',
                      marginBottom: showDetails ? 'var(--space-2)' : 0,
                      transition: 'all 0.3s',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>💎</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-ink)', flex: 1, textAlign: 'left' }}>
                      Phụ kiện ({currentOutfit.accessories.length})
                    </span>
                    {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {showDetails && (
                    <div style={{
                      display: 'grid',
                      gap: 'var(--space-2)',
                      animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    }}>
                      {currentOutfit.accessories.map((acc, i) => (
                        <OutfitPartCard
                          key={acc.id}
                          label={acc.type}
                          icon="✨"
                          name={acc.nameVi}
                          description={acc.description}
                          colors={acc.colors}
                          hexColors={acc.hexColors}
                          delay={500 + i * 100}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Saved Outfits Gallery ═══ */}
      {savedOutfits.length > 0 && (
        <section style={{
          maxWidth: 900,
          margin: 'var(--space-8) auto',
          padding: '0 var(--space-4) var(--space-12)',
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--color-ink)',
            margin: '0 0 var(--space-4)',
            textAlign: 'center',
          }}>
            ❤️ Bộ đã lưu ({savedOutfits.length})
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
          }}>
            {savedOutfits.map((outfit, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-silver-light)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
                onClick={() => {
                  setCurrentOutfit(outfit);
                  setAnimKey(prev => prev + 1);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
              >
                <img
                  src={getGarmentImage(outfit.top)}
                  alt={outfit.top.nameVi}
                  style={{ width: '100%', height: 160, objectFit: 'cover' }}
                />
                <div style={{ padding: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.9rem' }}>{outfit.occasion.icon}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-ink-tertiary)' }}>
                      {outfit.occasion.name.split('/')[0].trim()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                    {outfit.top.nameVi}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: 3,
                    marginTop: 'var(--space-1)',
                  }}>
                    {outfit.top.hexColors.map(hex => (
                      <div key={hex} style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: hex,
                        border: '1px solid var(--color-silver-light)',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Inline CSS for animations ═══ */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .outfit-part-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(26, 10, 10, 0.1);
        }
        @media (max-width: 640px) {
          section > div[style*="grid-template-columns: minmax(200px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OutfitAssemblyPage;
