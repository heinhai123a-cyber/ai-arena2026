import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, BookOpen, Share2, Palette } from 'lucide-react';
import { OutfitMiniVis } from '../components/OutfitVisualization';
import { HeritageOrnament } from '../components/heritage/HeritageOrnament';
import { HeritagePattern } from '../components/heritage/HeritagePattern';
import { HeroStage } from '../components/home/HeroStage';
import { RemixTeaser } from '../components/home/RemixTeaser';
import { LookbookCoverflow } from '../components/home/LookbookCoverflow';
import { DongSonDrum, FallingPetals, Lantern, MaiBlossom } from '../components/home/HomeDecor';
import { garments } from '../content/garments';
import { accessories } from '../content/catalog';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { useReveal, tiltHandlers } from '../lib/useReveal';
import './HomePage.css';

/* ── Dragon SVG ornament for hero (strokes draw themselves on load) ── */
const DragonOrnament: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <svg
    viewBox="0 0 200 400"
    width="200"
    height="400"
    fill="none"
    className="hero-dragon"
    style={{
      [side]: -20,
      transform: `translateY(-50%) scaleX(${side === 'right' ? -1 : 1})`,
    }}
    aria-hidden="true"
  >
    {/* Dragon body — flowing S-curve */}
    <path
      pathLength={1}
      d="M100 20 C120 60, 160 80, 150 120 C140 160, 80 180, 90 220 C100 260, 160 280, 140 320 C120 360, 80 380, 100 400"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    {/* Dragon scales */}
    <path pathLength={1} d="M115 70 C125 65, 135 70, 130 80" stroke="currentColor" strokeWidth="1.5" />
    <path pathLength={1} d="M130 100 C140 95, 150 100, 145 110" stroke="currentColor" strokeWidth="1.5" />
    <path pathLength={1} d="M110 160 C100 155, 90 160, 95 170" stroke="currentColor" strokeWidth="1.5" />
    <path pathLength={1} d="M95 200 C85 195, 75 200, 80 210" stroke="currentColor" strokeWidth="1.5" />
    <path pathLength={1} d="M120 260 C130 255, 140 260, 135 270" stroke="currentColor" strokeWidth="1.5" />
    <path pathLength={1} d="M130 300 C140 295, 150 300, 145 310" stroke="currentColor" strokeWidth="1.5" />
    {/* Cloud wisps */}
    <path pathLength={1} d="M40 100 Q60 80, 80 100" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <path pathLength={1} d="M140 200 Q160 180, 180 200" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <path pathLength={1} d="M30 300 Q50 280, 70 300" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    {/* Head */}
    <circle pathLength={1} cx="100" cy="20" r="8" stroke="currentColor" strokeWidth="2" />
    <circle cx="96" cy="17" r="2" fill="currentColor" />
  </svg>
);

/* ── Vietnamese Star Emblem ── */
const StarEmblem: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
    <rect x="2" y="2" width="44" height="44" fill="#C5972C" transform="rotate(45 24 24)" />
    <rect x="6" y="6" width="36" height="36" fill="none" stroke="#FFF3CD" strokeWidth="0.6" transform="rotate(45 24 24)" />
    <polygon
      points="24,8 27.5,18.5 38.5,18.5 29.5,25 32.5,35.5 24,29 15.5,35.5 18.5,25 9.5,18.5 20.5,18.5"
      fill="#FFFDF8"
    />
  </svg>
);

/* ── Lotus SVG Decoration ── */
const LotusDecoration: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = 'var(--color-gold)' }) => (
  <svg viewBox="0 0 60 40" width={size} height={size * 0.67} fill="none" aria-hidden="true">
    <path d="M30 5 C25 12, 15 18, 10 25 C15 22, 25 28, 30 35 C35 28, 45 22, 50 25 C45 18, 35 12, 30 5Z" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M30 10 C27 15, 22 20, 18 25" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <path d="M30 10 C33 15, 38 20, 42 25" stroke={color} strokeWidth="0.8" opacity="0.5" />
    <circle cx="30" cy="28" r="2" fill={color} opacity="0.3" />
  </svg>
);

/* ── Square section heading (title boxed between two gold rules) ── */
const SqHeading: React.FC<{
  label: string;
  title: string;
  desc?: string;
  ornament?: React.ReactNode;
  align?: 'center' | 'left';
  labelColor?: string;
}> = ({ label, title, desc, ornament, align = 'center', labelColor }) => (
  <div className={`sq-heading reveal${align === 'left' ? ' sq-heading--left' : ''}`}>
    {ornament}
    <p className="label mb-3" style={labelColor ? { color: labelColor } : undefined}>{label}</p>
    <h2 className="display-md sq-heading-title">{title}</h2>
    {desc && <p className="body-lg text-muted" style={{ maxWidth: 620 }}>{desc}</p>}
  </div>
);

/* ── Count-up number that starts when scrolled into view ── */
const CountUp: React.FC<{ to: number; suffix?: string; duration?: number }> = ({ to, suffix = '', duration = 1600 }) => {
  const ref = useRef<HTMLElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      setVal(to);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        run();
        io.disconnect();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return <strong ref={ref}>{val}{suffix}</strong>;
};

const ENTRY_PATHS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3v2" />
        <path d="M9 7h10l1 12H8L9 7z" />
        <path d="M10 7c0-2 2-4 4-4s4 2 4 4" />
        <path d="M11 19l-1 6M17 19l1 6" />
        <path d="M9.5 12h9M10 16h8" />
      </svg>
    ),
    num: '壹',
    title: 'Theo dịp',
    desc: 'Tết, lễ hội, đám cưới — chọn dịp trước, chọn áo sau.',
    link: '/explore?mode=event',
    bg: 'linear-gradient(135deg, #FAE8E4 0%, #F8EDE4 100%)',
    accent: 'var(--color-crimson)',
    bgImage: '/images/heritage-pattern-bg.jpg',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14c2-4 5-6 10-6s8 2 10 6" />
        <path d="M6 14c1 4 4 7 8 7s7-3 8-7" />
        <circle cx="10" cy="12" r="1" fill="currentColor" stroke="none" />
        <path d="M14 8V5" />
        <path d="M18 9l2-2" />
        <path d="M10 9L8 7" />
        <path d="M14 21v3" />
      </svg>
    ),
    num: '貳',
    title: 'Theo vùng miền',
    desc: 'Bắc Bộ, Trung Bộ, Nam Bộ — mỗi nơi một đặc trưng.',
    link: '/explore?mode=region',
    bg: 'linear-gradient(135deg, #FAF0D6 0%, #F5EBD8 100%)',
    accent: 'var(--color-gold-dark)',
    bgImage: '/images/lotus-ornament.jpg',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="4" />
        <path d="M14 4v3M14 21v3M4 14h3M21 14h3" />
        <path d="M7 7l2 2M19 19l2 2M7 21l2-2M19 7l2 2" />
      </svg>
    ),
    num: '叁',
    title: 'Theo phong cách',
    desc: 'Tối giản, vintage, streetwear — vibe của bạn.',
    link: '/explore?mode=style',
    bg: 'linear-gradient(135deg, #E8F2EC 0%, #EFF8F2 100%)',
    accent: 'var(--color-jade)',
    bgImage: '/images/heritage-pattern-bg.jpg',
  },
];

const ARCHITECTURE = [
  {
    tag: 'BẮC BỘ',
    tagBg: 'var(--color-crimson)',
    img: '/images/heritage/van-mieu-red-sketch.jpg',
    alt: 'Văn Miếu Quốc Tử Giám Hà Nội - Bản vẽ phác thảo đỏ cổ điển',
    title: 'Văn Miếu – Quốc Tử Giám',
    meta: 'Thủ đô Hà Nội · Khắc họa 1928',
    desc: 'Chiếc nôi nghìn năm văn hiến, khởi nguyên của nếp áo Tứ thân Quan họ và Áo dài truyền thống Kinh kỳ trang nhã.',
    link: '/explore?region=bac-bo',
    linkText: 'Xem trang phục Bắc Bộ',
  },
  {
    tag: 'TRUNG BỘ',
    tagBg: 'var(--color-gold-dark)',
    img: '/images/heritage/hue-citadel-red-sketch.jpg',
    alt: 'Ngọ Môn Cố Đô Huế - Bản vẽ phác thảo đỏ cổ điển',
    title: 'Ngọ Môn – Cố Đô Huế',
    meta: 'Kinh thành triều Nguyễn · Khắc họa 1928',
    desc: 'Không gian cung đình uy nghiêm, nơi hoàng tộc định hình định chế Áo Ngũ thân lập lĩnh và chiếc Áo dài cung phụng.',
    link: '/explore?region=trung-bo',
    linkText: 'Xem trang phục Trung Bộ',
  },
  {
    tag: 'NAM BỘ',
    tagBg: 'var(--color-jade)',
    img: '/images/heritage/buu-dien-saigon-sketch.jpg',
    alt: 'Bưu Điện Trung Tâm Sài Gòn - Bản vẽ kiến trúc đỏ nguyên bản',
    title: 'Bưu Điện Trung Tâm Sài Gòn',
    meta: 'Thành phố Hồ Chí Minh · Bản khắc di sản',
    desc: 'Điểm giao thoa Đông Tây tráng lệ, gắn với chiếc Áo Bà Ba Nam Bộ mộc mạc và phong cách phối đồ hiện đại đầy phóng khoáng.',
    link: '/explore?region=nam-bo',
    linkText: 'Xem trang phục Nam Bộ',
  },
];

const TRIO = [
  {
    to: '/remix?garment=ao-dai&event=tet',
    garment: 'ao-dai' as const,
    colors: ['burgundy', 'cream'],
    acc: ['man-doi-dau'],
    event: 'tet' as const,
    badge: 'Chúc Tết nhà ngoại',
    title: 'Áo Dài Hoa Mai & Mấn Vàng',
    detail: 'Cổ đứng · Tà đỏ hoa mai · Quần lụa trắng · Túi tròn vàng',
  },
  {
    to: '/remix?garment=ao-tu-than&event=le-hoi',
    garment: 'ao-tu-than' as const,
    colors: ['earth-tone', 'burgundy'],
    acc: ['non-quai-thao'],
    event: 'le-hoi' as const,
    badge: 'Hội Lim mớ ba',
    title: 'Áo Tứ Thân & Nón Quai Thao',
    detail: 'Vạt ngoài nâu đất · Yếm xanh ngọc · Dải đai nơ · Bím tóc lệch',
  },
  {
    to: '/remix?garment=ao-ba-ba&event=di-san',
    garment: 'ao-ba-ba' as const,
    colors: ['ivory', 'earth-tone'],
    acc: ['non-la', 'khan-ran', 'sneaker'],
    event: 'di-san' as const,
    badge: 'Phố cổ Hội An, bản street',
    title: 'Áo Bà Ba & Khăn Rằn Sneaker',
    detail: 'Áo xanh ngọc 2 túi · Khăn rằn caro · Quần jeans · Giày trắng',
  },
];

const STEPS = [
  { title: 'Chọn trang phục', desc: 'Chọn áo, dịp xuất hiện, và phong cách định hình.', icon: <Scissors size={20} />, num: '壹' },
  { title: 'Chỉnh Thước Remix', desc: 'Điều chỉnh mức độ cách tân với vạch chia thước may.', icon: <Palette size={20} />, num: '貳' },
  { title: 'Hiểu văn hóa', desc: 'Đọc câu chuyện và lưu ý bối cảnh nguyên bản.', icon: <BookOpen size={20} />, num: '叁' },
  { title: 'Lưu & chia sẻ', desc: 'Lưu vào Lookbook cá nhân và xuất thẻ phối đồ.', icon: <Share2 size={20} />, num: '肆' },
];

const ACCESSORY_COUNT = accessories.reduce((n, a) => n + a.variants.length, 0);

/** Starts the ink-spread reveal from the point where the cursor entered. */
const inkEnter = (e: React.MouseEvent<HTMLElement>) => {
  const media = e.currentTarget.querySelector<HTMLElement>('.arch-media');
  if (!media) return;
  const r = media.getBoundingClientRect();
  media.style.setProperty('--ix', `${e.clientX - r.left}px`);
  media.style.setProperty('--iy', `${e.clientY - r.top}px`);
};

const HomePage: React.FC = () => {
  useDocumentTitle();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [burst, setBurst] = useState(0);

  useReveal(pageRef);

  const handleTryDemo = () => {
    navigate('/remix');
  };

  const handleFinalCta = () => {
    setBurst(b => b + 1);
    window.setTimeout(() => navigate('/remix'), 650);
  };

  const handleHeroMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    el.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  };

  const handleHeroLeave = () => {
    heroRef.current?.style.setProperty('--mx', '0');
    heroRef.current?.style.setProperty('--my', '0');
  };

  return (
    <div className="page home" ref={pageRef}>
      {/* ══════════════════════════════════════════════════════
         HERO — Vietnamese Heritage Grand Opening
         Royal Dragon & Phoenix (Long Phụng Sum Vầy) & Live Character Stage
         ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="heritage-zone hero"
        style={{ padding: 0 }}
        onMouseMove={handleHeroMove}
        onMouseLeave={handleHeroLeave}
      >
        {/* Full-bleed golden dragon and phoenix pattern background (parallax + Ken Burns) */}
        <div className="hero-bg">
          <img src="/images/heritage/royal-dragon-phoenix-bg.jpg" alt="" aria-hidden="true" />
        </div>

        {/* Heritage Pattern overlay */}
        <HeritagePattern opacity={0.05} />

        {/* Đông Sơn bronze drum slowly turning behind the stage */}
        <div className="hero-drum" aria-hidden="true">
          <DongSonDrum size="100%" />
        </div>

        {/* Dragon ornaments */}
        <DragonOrnament side="left" />
        <DragonOrnament side="right" />

        {/* Falling hoa mai / hoa đào */}
        <FallingPetals count={18} />

        {/* Corner ornaments */}
        <HeritageOrnament variant="corner" size={76} style={{ position: 'absolute', top: 16, left: 16, zIndex: 4 }} />
        <HeritageOrnament variant="corner" size={76} style={{ position: 'absolute', top: 16, right: 16, zIndex: 4, transform: 'rotate(90deg)' }} />
        <HeritageOrnament variant="corner" size={76} style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 4, transform: 'rotate(270deg)' }} />
        <HeritageOrnament variant="corner" size={76} style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 4, transform: 'rotate(180deg)' }} />

        <div className="container hero-inner">
          <div className="hero-copy">
            {/* Royal Badge */}
            <div className="hero-badge">
              <span style={{ color: 'var(--color-gold)' }}>✦</span>
              Bản sắc hoàng triều · Tinh hoa Việt phục
              <span style={{ color: 'var(--color-gold)' }}>✦</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              <span className="hero-line">
                <span className="gold-shimmer" style={{ '--d': '0.15s' } as React.CSSProperties}>Dấu ấn Việt Nam</span>
              </span>
              <span className="hero-line">
                <span style={{ '--d': '0.35s' } as React.CSSProperties}>Vạn nét tinh hoa</span>
              </span>
            </h1>

            {/* Description */}
            <p className="hero-desc">
              Không gian tương tác trang phục truyền thống ba miền Bắc — Trung — Nam. Tự do sáng tạo, biến tấu sắc màu ngũ hành và phụ kiện cổ truyền cùng công cụ Studio độc bản.
            </p>

            {/* CTAs */}
            <div className="hero-ctas">
              <button onClick={handleTryDemo} className="btn btn-lg btn-gold" aria-label="Bắt đầu phối outfit tại Studio">
                ★ Bắt đầu phối outfit
              </button>
              <Link to="/explore" className="btn btn-lg btn-ghost-gold">
                Khám phá Việt phục
              </Link>
            </div>

            {/* Quick stats */}
            <div className="hero-stats">
              <div className="hero-stat"><CountUp to={garments.length} /><span>bộ Việt phục</span></div>
              <div className="hero-stat"><CountUp to={3} /><span>vùng miền</span></div>
              <div className="hero-stat"><CountUp to={ACCESSORY_COUNT} suffix="+" /><span>phụ kiện</span></div>
              <div className="hero-stat"><CountUp to={6} /><span>dịp lễ</span></div>
            </div>
          </div>

          {/* Live character stage */}
          <HeroStage />
        </div>

        {/* Bottom ornamental border */}
        <div className="hero-rule" aria-hidden="true" />
      </section>

      {/* ── Royal Dragon & Phoenix Divider Ribbon ── */}
      <div className="heritage-pattern-strip" style={{ height: 32, position: 'relative' }}>
        <img
          src="/images/heritage/royal-dragon-phoenix-bg.jpg"
          alt="Dải rồng phượng hoàng triều"
          aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, var(--color-paper) 0%, transparent 12%, transparent 88%, var(--color-paper) 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── ENTRY PATHS — Heritage-themed category cards ── */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-paper)', position: 'relative' }}>
        {/* Subtle pattern background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/heritage-pattern-bg.jpg)',
          backgroundSize: '600px',
          opacity: 0.03,
          pointerEvents: 'none',
        }} aria-hidden="true" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <SqHeading label="KHÁM PHÁ" title="Ba lối vào bàn phối" labelColor="var(--color-gold-dark)" ornament={<LotusDecoration size={50} />} />
          <div className="grid-3">
            {ENTRY_PATHS.map((entry, i) => (
              <div key={entry.title} className="reveal" style={{ '--d': `${i * 0.12}s` } as React.CSSProperties}>
                <Link
                  to={entry.link}
                  className="entry-card sq-frame tilt"
                  style={{ '--accent': entry.accent, background: entry.bg } as React.CSSProperties}
                  {...tiltHandlers}
                >
                  {/* Background pattern overlay */}
                  <div className="entry-card-pattern" style={{ backgroundImage: `url(${entry.bgImage})` }} aria-hidden="true" />
                  {/* Top ornamental line — expands on hover */}
                  <div className="entry-card-accent" aria-hidden="true" />
                  <span className="entry-card-index" aria-hidden="true">{entry.num}</span>

                  <div className="entry-card-icon"><span style={{ display: 'flex' }}>{entry.icon}</span></div>
                  <h3 className="heading-md mb-2" style={{ fontFamily: 'var(--font-display)' }}>{entry.title}</h3>
                  <p className="body-sm text-muted" style={{ marginBottom: 'var(--space-4)' }}>{entry.desc}</p>
                  <span className="entry-card-link">
                    Khám phá <span className="arrow">→</span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THỬ NGAY — Interactive remix ruler teaser ── */}
      <section className="teaser-section">
        <HeritagePattern opacity={0.03} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <RemixTeaser />
        </div>
      </section>

      {/* ── KIẾN TRÚC & DI SẢN BA MIỀN (Hình 3 + Bản vẽ phác thảo đỏ Văn Miếu & Huế) ── */}
      <section className="heritage-rich-section" style={{
        background: 'linear-gradient(135deg, var(--color-cream-warm) 0%, var(--color-paper-warm) 100%)',
        padding: 'var(--space-16) 0',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <SqHeading
            label="DI SẢN KIẾN TRÚC"
            title="Dấu ấn ba miền qua nét vẽ phác thảo"
            desc="Mỗi vùng đất là một không gian văn hóa độc bản. Các công trình kiến trúc biểu tượng Bắc — Trung — Nam là chiếc nôi nuôi dưỡng hồn cốt Việt phục."
            ornament={<HeritageOrnament variant="emblem" size={56} style={{ margin: '0 auto var(--space-4)' }} />}
          />

          {/* Architectural Lithograph Gallery — hover to spread the red ink */}
          <div className="grid-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
            {ARCHITECTURE.map((a, i) => (
              <div key={a.title} className="reveal" style={{ '--d': `${i * 0.12}s` } as React.CSSProperties}>
                <article
                  className="arch-card sq-frame tilt"
                  style={{ height: '100%' }}
                  onMouseEnter={inkEnter}
                  {...tiltHandlers}
                >
                  <div className="arch-media">
                    <img className="arch-base" src={a.img} alt="" aria-hidden="true" />
                    <img className="arch-ink" src={a.img} alt={a.alt} />
                    <span className="arch-tag" style={{ background: a.tagBg }}>{a.tag}</span>
                    <span className="arch-hint" aria-hidden="true">Rê chuột để loang mực</span>
                  </div>
                  <div className="arch-body">
                    <h3 className="heading-sm mb-1" style={{ color: 'var(--color-crimson)' }}>{a.title}</h3>
                    <p className="caption text-muted mb-3">{a.meta}</p>
                    <p className="body-sm mb-4" style={{ color: 'var(--color-ink-secondary)', flex: 1 }}>{a.desc}</p>
                    <Link
                      to={a.link}
                      className="btn btn-sm btn-ghost"
                      style={{ color: 'var(--color-crimson)', fontWeight: 600, paddingLeft: 0, justifyContent: 'flex-start' }}
                    >
                      {a.linkText} →
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {/* ── BỘ BA MINH HỌA VIỆT PHỤC (Hình 1) ── */}
          <div className="trio sq-frame reveal">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <p className="label mb-2" style={{ color: 'var(--color-crimson)' }}>PHONG CÁCH MINH HỌA</p>
              <h3 className="heading-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-crimson-deep)' }}>
                Ba tạo hình tiêu biểu của Việt Phục Remix
              </h3>
              <p className="body-sm text-muted" style={{ maxWidth: 540, margin: '0 auto' }}>
                Bộ ba tạo hình trang phục truyền thống ba miền: Áo dài hoa mai chúc Tết, Áo tứ thân trẩy hội Lim và Áo bà ba dạo phố Hội An.
              </p>
            </div>

            <div className="grid-3" style={{ gap: 'var(--space-6)' }}>
              {TRIO.map(t => (
                <div
                  key={t.title}
                  className="trio-card sq-frame tilt"
                  onClick={() => navigate(t.to)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(t.to)}
                  aria-label={`Phối ${t.title}`}
                  {...tiltHandlers}
                >
                  <div className="trio-visual">
                    <OutfitMiniVis garment={t.garment} colors={t.colors} accessoryVariants={t.acc} event={t.event} />
                  </div>
                  <div style={{ padding: 'var(--space-4)' }}>
                    <span className="badge badge-yellow" style={{ marginBottom: '6px' }}>{t.badge}</span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-crimson)' }}>
                      {t.title}
                    </h4>
                    <p className="caption text-muted mt-1">{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — Steps stitched together by a sewing thread ── */}
      <section style={{
        padding: 'var(--space-16) 0 var(--space-12)',
        background: 'var(--color-paper)',
        position: 'relative',
      }}>
        {/* Heritage divider */}
        <HeritageOrnament
          variant="divider"
          style={{ position: 'absolute', top: 0, left: '5%', right: '5%' }}
        />

        {/* Subtle lotus pattern background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/lotus-ornament.jpg)',
          backgroundSize: '300px',
          backgroundRepeat: 'repeat',
          opacity: 0.025,
          pointerEvents: 'none',
        }} aria-hidden="true" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <SqHeading label="QUY TRÌNH" title="Bốn bước đơn giản" ornament={<LotusDecoration size={45} color="var(--color-crimson)" />} />

          {/* Sewing thread with needle */}
          <div className="thread reveal" aria-hidden="true">
            <div className="thread-line">
              <svg className="thread-needle" width="34" height="20" viewBox="0 0 34 20">
                <path d="M33 10 L8 7.6 Q2 10 8 12.4 Z" fill="currentColor" />
                <ellipse cx="8" cy="10" rx="2.6" ry="0.9" fill="var(--color-paper)" />
              </svg>
            </div>
            {[12.5, 37.5, 62.5, 87.5].map((left, i) => (
              <span
                key={left}
                className="thread-knot"
                style={{ left: `${left}%`, transitionDelay: `${0.5 + i * 0.65}s` }}
              />
            ))}
          </div>

          <div className="grid-4">
            {STEPS.map((item, i) => (
              <div key={item.title} className="reveal" style={{ '--d': `${0.3 + i * 0.15}s` } as React.CSSProperties}>
                <div className="step-card sq-frame tilt" style={{ height: '100%' }} {...tiltHandlers}>
                  {/* Han tu number */}
                  <div className="step-num" aria-hidden="true">{item.num}</div>
                  <div className="step-icon">{item.icon}</div>
                  <h3 className="heading-sm mb-2">{item.title}</h3>
                  <p className="body-sm text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mái đình cổ truyền basic chìm phía dưới 4 ô quy trình */}
          <div style={{
            position: 'relative',
            maxWidth: 860,
            margin: 'var(--space-6) auto 0',
            height: 145,
            overflow: 'hidden',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} aria-hidden="true">
            <img
              src="/images/heritage/basic-roof-eave.jpg"
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: 0.32,
                mixBlendMode: 'multiply',
                filter: 'contrast(1.1) sepia(0.2)',
              }}
            />
            {/* Soft gradient masks for organic fade into paper texture */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 35%, var(--color-paper) 95%)',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, var(--color-paper) 0%, transparent 12%, transparent 88%, var(--color-paper) 100%)',
            }} />
          </div>
        </div>
      </section>

      {/* ── TRENDING LOOKS — 3D coverflow lookbook ── */}
      <section style={{
        padding: 'var(--space-16) 0',
        background: 'var(--color-white)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="container">
          <SqHeading label="LOOKBOOK" title="Look được yêu thích" ornament={<LotusDecoration size={45} />} />
          <LookbookCoverflow />
        </div>
      </section>

      {/* ── KHÁM PHÁ VIỆT PHỤC — Garment overview with rich imagery ── */}
      <section style={{
        padding: 'var(--space-16) 0',
        background: 'var(--color-paper)',
        position: 'relative',
      }}>
        {/* Subtle pattern background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/heritage-pattern-bg.jpg)',
          backgroundSize: '800px',
          opacity: 0.03,
          pointerEvents: 'none',
        }} aria-hidden="true" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <SqHeading
            align="left"
            label="DI SẢN"
            title="Khám phá Việt phục"
            desc="Bốn nhóm trang phục truyền thống, mỗi bộ mang một câu chuyện và đặc trưng riêng."
            ornament={<LotusDecoration size={45} color="var(--color-crimson)" />}
          />
          <div className="grid-2">
            {garments.map((g, idx) => {
              const tints = ['var(--color-red-soft)', 'var(--color-yellow-soft)', 'var(--color-green-soft)', 'var(--color-purple-soft)'];
              const accents = ['var(--color-crimson)', 'var(--color-gold-dark)', 'var(--color-jade)', 'var(--color-indigo)'];
              return (
                <div key={g.id} className="reveal" style={{ '--d': `${(idx % 2) * 0.12}s` } as React.CSSProperties}>
                  <Link
                    to={`/garments/${g.id}`}
                    className="garment-row sq-frame"
                    style={{ '--accent': accents[idx % accents.length], '--frame-corner': accents[idx % accents.length] } as React.CSSProperties}
                  >
                    <div
                      className="garment-row-visual"
                      style={{ background: tints[idx % tints.length], borderRight: `1px solid ${accents[idx % accents.length]}` }}
                    >
                      <OutfitMiniVis garment={g.id} colors={['ivory', 'burgundy']} />
                      {/* Heritage pattern overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'url(/images/lotus-ornament.jpg)',
                        backgroundSize: '80px',
                        opacity: 0.04,
                        pointerEvents: 'none',
                      }} aria-hidden="true" />
                    </div>
                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h3 className="heading-md mb-2" style={{ fontFamily: 'var(--font-display)' }}>{g.name}</h3>
                      <p className="body-sm text-muted mb-3">{g.shortDescription}</p>
                      <div className="flex gap-2 flex-wrap">
                        {g.region.map(r => (
                          <span key={r} className="badge">{r === 'bac-bo' ? 'Bắc Bộ' : r === 'trung-bo' ? 'Trung Bộ' : 'Nam Bộ'}</span>
                        ))}
                      </div>
                      <span className="garment-row-more">Tìm hiểu <span className="arrow">→</span></span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CHUYỆN CHIẾC ÁO — Cultural story section with imagery ── */}
      <section className="story-section" style={{
        padding: 'var(--space-16) 0',
        background: 'linear-gradient(135deg, #8B1A1A 0%, #5C0F0F 100%)',
        color: 'var(--color-white)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Full-bleed culture banner background with dragon pattern (Hình 4) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/images/heritage/royal-dragon-phoenix-bg.jpg"
            alt=""
            aria-hidden="true"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28 }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(139,26,26,0.88) 0%, rgba(74,13,13,0.94) 100%)',
          }} />
        </div>

        {/* Background dragon pattern */}
        <HeritagePattern opacity={0.05} />
        <FallingPetals count={10} />

        {/* Corner ornaments */}
        <HeritageOrnament variant="corner" size={64} style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }} />
        <HeritageOrnament variant="corner" size={64} style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, transform: 'rotate(90deg)' }} />
        <HeritageOrnament variant="corner" size={64} style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 2, transform: 'rotate(270deg)' }} />
        <HeritageOrnament variant="corner" size={64} style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 2, transform: 'rotate(180deg)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          <div className="two-col" style={{ alignItems: 'center' }}>
            <div className="reveal">
              <p className="label mb-3" style={{ color: 'var(--color-gold-bright)' }}>VĂN HÓA</p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                marginBottom: 'var(--space-4)',
                color: 'var(--color-gold-bright)',
                display: 'inline-block',
                paddingBottom: 'var(--space-2)',
                borderBottom: '1px solid rgba(212, 168, 67, 0.6)',
              }}>
                Chuyện chiếc áo
              </h2>
              <p className="body-lg mb-6" style={{ maxWidth: 440, color: 'rgba(255, 253, 248, 0.75)' }}>
                Mỗi trang phục mang một câu chuyện. Hiểu bối cảnh giúp bạn phối đồ tự tin hơn — và tôn trọng giá trị văn hóa đằng sau mỗi chiếc áo.
              </p>
              <div className="story-card" style={{ maxWidth: 440 }}>
                <div className="story-card-header">
                  <h3 className="heading-sm" style={{ color: 'var(--color-crimson)' }}>Áo dài</h3>
                </div>
                <div className="story-card-body">
                  <div className="story-card-section">
                    <p className="story-card-section-title">Bối cảnh</p>
                    <p className="body-sm">Áo dài phát triển qua nhiều giai đoạn lịch sử, gắn liền với hình ảnh Việt Nam.</p>
                  </div>
                  <div className="story-card-section">
                    <p className="story-card-section-title">Lưu ý khi remix</p>
                    <p className="body-sm">Giữ cấu trúc hai tà và phom dáng dài để trang phục vẫn được nhận diện.</p>
                  </div>
                </div>
                <div className="story-card-footer">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-success" style={{ background: '#E8F5E9', color: '#1B5E20', border: '1px solid #A5D6A7', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      ✓ Đã thẩm định học thuật
                    </span>
                    <Link to="/culture" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-crimson)' }}>Đọc thêm</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal" style={{ display: 'flex', justifyContent: 'center', '--d': '0.2s' } as React.CSSProperties}>
              {/* Dấu Ấn Việt Nam mái đình eave image with heritage frame (Hình 2) */}
              <div style={{ maxWidth: 320, width: '100%' }}>
                <div className="heritage-image-frame" style={{ marginBottom: 'var(--space-4)', background: '#FAF6EF' }}>
                  <img
                    src="/images/heritage/dau-an-vietnam-roof.jpg"
                    alt="Dấu Ấn Việt Nam - Mái ngói rồng cổ"
                    style={{ aspectRatio: '16/9', objectFit: 'contain', padding: '8px' }}
                  />
                </div>
                {/* Small Áo ngũ thân preview */}
                <div className="sq-frame" style={{
                  background: 'rgba(197, 151, 44, 0.1)',
                  padding: 'var(--space-4)',
                  position: 'relative',
                }}>
                  {/* Emblem */}
                  <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', zIndex: 4 }}>
                    <HeritageOrnament variant="emblem" size={40} />
                  </div>
                  <div style={{
                    background: 'var(--color-cream-warm)',
                    padding: 'var(--space-5)',
                    position: 'relative',
                  }}>
                    <OutfitMiniVis garment="ao-ngu-than" colors={['navy', 'cream']} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Heritage Pattern Divider Strip ── */}
      <div className="heritage-pattern-strip">
        <img src="/images/ornamental-divider.jpg" alt="" aria-hidden="true" />
      </div>

      {/* ── CTA CUỐI — Lanterns, turning drum and a blossom burst ── */}
      <section className="cta-final">
        {/* Heritage pattern background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/heritage-pattern-bg.jpg)',
          backgroundSize: '600px',
          opacity: 0.04,
          pointerEvents: 'none',
        }} aria-hidden="true" />

        {/* Đông Sơn drum rings */}
        <div className="cta-rings" aria-hidden="true">
          <DongSonDrum size="100%" />
        </div>

        {/* Swinging lanterns */}
        <Lantern className="cta-lantern cta-lantern--left" size={84} />
        <Lantern className="cta-lantern cta-lantern--right" size={68} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="cta-box sq-frame reveal">
            <StarEmblem size={56} />
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-4xl)',
              fontWeight: 700,
              color: 'var(--color-crimson-deep)',
              marginTop: 'var(--space-6)',
              marginBottom: 'var(--space-4)',
            }}>
              Sẵn sàng thử?
            </h2>
            <p className="body-lg" style={{
              color: 'var(--color-ink-tertiary)',
              maxWidth: 440,
              margin: '0 auto var(--space-8)',
            }}>
              Tạo bộ outfit Việt phục đầu tiên — chỉ mất vài phút.
            </p>
            <div className="cta-btn-wrap">
              <button onClick={handleFinalCta} className="btn btn-lg btn-gold">
                ★ Thử demo ngay
              </button>
              {burst > 0 && (
                <div key={burst} className="burst" aria-hidden="true">
                  {Array.from({ length: 22 }).map((_, i) => (
                    <span
                      key={i}
                      className="burst-petal"
                      style={{ '--a': `${(i * 360) / 22}deg`, '--dist': `${90 + (i % 4) * 30}px` } as React.CSSProperties}
                    >
                      <MaiBlossom color={i % 3 === 0 ? '#F5B7C5' : '#F4D03F'} />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-gold-bright)',
                marginBottom: 'var(--space-1)',
                fontSize: 'var(--text-lg)',
              }}>
                Việt Phục Remix
              </p>
              <p className="caption" style={{ color: 'rgba(255, 253, 248, 0.5)' }}>
                Bản demo — không phải sản phẩm chính thức
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/sources" className="nav-link" style={{ fontSize: 'var(--text-sm)' }}>Nguồn tham khảo</Link>
              <Link to="/culture" className="nav-link" style={{ fontSize: 'var(--text-sm)' }}>Về văn hóa</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
