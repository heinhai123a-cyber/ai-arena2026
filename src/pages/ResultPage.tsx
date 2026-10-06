import React, { useState, useMemo } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { Bookmark, BookOpen, ArrowLeft, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Share2, Download, X, Sparkles } from 'lucide-react';
import { generateOutfit } from '../lib/remixEngine';
import { calculateColorHarmony } from '../lib/colorHarmony';
import { saveLook, getLook } from '../lib/storage';
import { garments } from '../content/garments';
import { OutfitVisualization } from '../components/OutfitVisualization';
import { RemixTapeBadge } from '../components/RemixTapeBadge';
import { HeritageOrnament } from '../components/heritage/HeritageOrnament';
import { HeritagePattern } from '../components/heritage/HeritagePattern';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { RemixPreferences, CharacterId, GarmentId, EventId, RegionId, StyleId, ColorId, AccessoryId, OutfitResult, WeatherId } from '../types';
import { getCulturalPresentationGuidance, getSuggestedGarmentsForEvent, getWeatherAdvice, getWeatherLabel, weatherOptions } from '../lib/outfitGuidance';
import { DEFAULT_CHARACTER_ID, getRepresentativeCharacter } from '../content/characters';

const ResultPage: React.FC = () => {
  useDocumentTitle('Kết Quả Bản Phối — Di Sản Việt Phục');
  const [searchParams] = useSearchParams();
  const { outfitId } = useParams<{ outfitId?: string }>();
  const navigate = useNavigate();

  // If outfitId is in URL, attempt to load saved look
  const savedLook = useMemo(() => outfitId ? getLook(outfitId) : undefined, [outfitId]);

  const [showCulturalDetail, setShowCulturalDetail] = useState(false);
  const [showWhyThisLook, setShowWhyThisLook] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportRatio, setExportRatio] = useState<'4:5' | '9:16'>('4:5');
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Parse preferences from URL (or from saved look)
  const prefs: RemixPreferences = useMemo(() => {
    if (savedLook) {
      return {
        garment: savedLook.outfit.outfit.garment,
        character: savedLook.outfit.outfit.character || DEFAULT_CHARACTER_ID,
        event: savedLook.outfit.outfit.event,
        weather: savedLook.outfit.outfit.weather || 'unspecified',
        region: savedLook.outfit.outfit.region,
        style: savedLook.outfit.outfit.style,
        colors: (savedLook.outfit.palette.map(p => p.name.toLowerCase().replace(' ', '-')) as ColorId[]),
        accessories: [],
        accessoryVariants: savedLook.outfit.outfit.accessoryVariants || [],
        remixLevel: savedLook.outfit.remixLevel,
      };
    }
    const requestedWeather = searchParams.get('weather') as WeatherId | null;
    const requestedCharacter = searchParams.get('character') as CharacterId | undefined;
    return {
      garment: (searchParams.get('garment') as GarmentId) || 'ao-dai',
      character: getRepresentativeCharacter(requestedCharacter).id,
      event: (searchParams.get('event') as EventId) || 'tet',
      weather: weatherOptions.some(option => option.id === requestedWeather) ? requestedWeather || 'unspecified' : 'unspecified',
      region: (searchParams.get('region') as RegionId) || 'bac-bo',
      style: (searchParams.get('style') as StyleId) || 'toi-gian',
      colors: (searchParams.get('colors')?.split(',').filter(Boolean) as ColorId[]) || ['ivory', 'burgundy'],
      accessories: (searchParams.get('accessories')?.split(',').filter(Boolean) as AccessoryId[]) || [],
      accessoryVariants: searchParams.get('accessoryVariants')?.split(',').filter(Boolean) || [],
      remixLevel: parseInt(searchParams.get('remix') || '50'),
    };
  }, [searchParams, savedLook]);

  const outfit: OutfitResult = useMemo(() => {
    if (savedLook) return savedLook.outfit;
    return generateOutfit(prefs);
  }, [prefs, savedLook]);

  const harmony = useMemo(() => calculateColorHarmony(prefs.colors), [prefs.colors]);
  const garment = garments.find(g => g.id === prefs.garment) || garments[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleSave = () => {
    if (saved) return;
    if (outfit.culturalContext.status === 'red' && outfit.remixLabel === 'Nguyên bản') {
      showToast('Không thể lưu Nguyên bản khi có cảnh báo đỏ. Thay đổi mức Remix hoặc sửa phối đồ.');
      return;
    }
    const result = saveLook(outfit);
    if (result === null) {
      showToast('Lookbook đã đầy (12 outfit). Xóa một outfit để lưu thêm.');
      return;
    }
    setSaved(true);
    showToast('Đã lưu vào Tủ đồ Di sản ✓');
    window.dispatchEvent(new CustomEvent('lookbook-updated'));
  };

  const handleOpenExport = () => {
    if (outfit.culturalContext.status === 'red' && outfit.remixLabel === 'Nguyên bản') {
      showToast('Không thể xuất thẻ với nhãn "Nguyên bản" khi có cảnh báo đỏ. Hãy đổi mức Remix hoặc sửa phối đồ.');
      return;
    }
    setShowExportModal(true);
  };

  const handleFixSuggestion = (suggestion: string) => {
    const params = new URLSearchParams(searchParams);

    if (suggestion.includes('Giảm mức Remix')) {
      params.set('remix', '50');
    }
    if (suggestion.includes('Bắc Bộ')) {
      params.set('region', 'bac-bo');
    }
    if (suggestion.includes('Nam Bộ')) {
      params.set('region', 'nam-bo');
    }
    if (suggestion.includes('nón lá') || suggestion.includes('Bỏ nón') || suggestion.includes('nón quai thao')) {
      const currentAcc = (params.get('accessories') || '').split(',').filter(a => a !== 'non' && Boolean(a));
      params.set('accessories', currentAcc.join(','));
    }
    if (suggestion.includes('khăn mỏ quạ') || suggestion.includes('Bỏ khăn') || suggestion.includes('khăn rằn')) {
      const currentAcc = (params.get('accessories') || '').split(',').filter(a => a !== 'khan' && Boolean(a));
      params.set('accessories', currentAcc.join(','));
    }
    if (suggestion.includes('Cách tân') || suggestion.includes('tăng mức Remix')) {
      params.set('remix', '50');
    }

    navigate(`/result?${params.toString()}`);
    showToast('Đã điều chỉnh outfit ✓');
  };

  if (outfitId && !savedLook) {
    return (
      <div className="page">
        <div className="container text-center" style={{ padding: 'var(--space-20) 0' }}>
          <div style={{
            width: 76, height: 76,
            borderRadius: '50%',
            background: 'var(--color-red-soft)',
            color: 'var(--color-crimson)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-6)',
            fontSize: '32px',
          }}>
            📜
          </div>
          <h1 className="display-md mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-crimson)' }}>
            Không tìm thấy bản phối
          </h1>
          <p className="body-lg text-muted mb-8" style={{ maxWidth: 460, margin: '0 auto var(--space-8)' }}>
            Outfit mã định danh &ldquo;{outfitId}&rdquo; không tồn tại hoặc đã được chuyển khỏi Tủ đồ Di sản.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/studio" className="btn btn-primary btn-lg">
              Tạo outfit mới tại Xưởng
            </Link>
            <Link to="/lookbook" className="btn btn-secondary btn-lg">
              Về Tủ đồ Di sản
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    green: { bg: 'var(--color-green-soft)', color: 'var(--color-success)', icon: <CheckCircle size={16} />, label: 'Hài hòa di sản' },
    yellow: { bg: 'var(--color-yellow-soft)', color: 'var(--color-warning)', icon: <AlertCircle size={16} />, label: 'Cần cân nhắc ngữ cảnh' },
    red: { bg: 'var(--color-red-soft)', color: 'var(--color-error)', icon: <AlertCircle size={16} />, label: 'Cần xem xét lễ tục' },
    unknown: { bg: 'var(--color-silver-light)', color: 'var(--color-ink-tertiary)', icon: <AlertCircle size={16} />, label: 'Chưa xác định' },
  };

  const status = statusConfig[outfit.culturalContext.status];

  return (
    <div className="page" style={{ paddingBottom: 'var(--space-16)' }}>
      {/* ── Imperial Banner Header with Dragon Pattern (Hình 4) ── */}
      <section style={{
        background: 'linear-gradient(160deg, #4A0D0D 0%, #7A1414 45%, #5C0F0F 100%)',
        borderBottom: '2px solid var(--color-gold)',
        padding: 'var(--space-6) 0 var(--space-8)',
        marginTop: 'calc(-1 * var(--space-6))',
        position: 'relative',
        overflow: 'hidden',
        color: 'var(--color-white)',
        marginBottom: 'var(--space-8)',
      }}>
        {/* Full-bleed dragon pattern */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/images/heritage/royal-dragon-phoenix-bg.jpg"
            alt="Hoa văn rồng phượng hoàng triều"
            aria-hidden="true"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, filter: 'saturate(1.2)' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(160deg, rgba(74,13,13,0.85) 0%, rgba(122,20,20,0.75) 45%, rgba(60,8,8,0.92) 100%)',
          }} />
        </div>

        <HeritagePattern opacity={0.05} />
        <HeritageOrnament variant="corner" size={54} style={{ position: 'absolute', top: 6, left: 6, zIndex: 2 }} />
        <HeritageOrnament variant="corner" size={54} style={{ position: 'absolute', top: 6, right: 6, zIndex: 2, transform: 'rotate(90deg)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => navigate('/remix')}
              className="btn btn-ghost"
              style={{
                color: 'var(--color-gold-bright)',
                borderColor: 'rgba(197, 151, 44, 0.4)',
                background: 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <ArrowLeft size={16} /> Cân chỉnh lại tại Xưởng
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <img
                src="/images/heritage/dau-an-vietnam-roof.jpg"
                alt="Dấu Ấn Việt Nam"
                style={{ height: 26, width: 'auto', objectFit: 'contain' }}
              />
              <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold-bright)', fontWeight: 700 }}>
                KHO TÀNG PHỐI Y PHỤC
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Main Result Editorial Grid */}
        <div className="two-col animate-fadeInUp" style={{ alignItems: 'start', gap: 'var(--space-8)' }}>
          {/* LEFT: Master Visual Stage */}
          <div>
            <div style={{
              background: 'var(--color-white)',
              border: '2px solid var(--color-gold)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-4)',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
            }}>
              {/* Corner Ornaments */}
              <HeritageOrnament variant="corner" size={44} style={{ position: 'absolute', top: 6, left: 6, zIndex: 3 }} />
              <HeritageOrnament variant="corner" size={44} style={{ position: 'absolute', top: 6, right: 6, zIndex: 3, transform: 'rotate(90deg)' }} />
              <HeritageOrnament variant="corner" size={44} style={{ position: 'absolute', bottom: 6, right: 6, zIndex: 3, transform: 'rotate(180deg)' }} />
              <HeritageOrnament variant="corner" size={44} style={{ position: 'absolute', bottom: 6, left: 6, zIndex: 3, transform: 'rotate(270deg)' }} />

              {/* Tape Badge */}
              <div style={{
                position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', zIndex: 4,
              }}>
                <RemixTapeBadge level={outfit.remixLevel} label={outfit.remixLabel} width={154} />
              </div>

              {/* Stage Visualizer Box */}
              <div style={{
                background: 'linear-gradient(180deg, #FBF8F2 0%, #F5EDE0 100%)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8) 0',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 460,
              }}>
                <OutfitVisualization
                  garment={prefs.garment || 'ao-dai'}
                  character={prefs.character || DEFAULT_CHARACTER_ID}
                  accessoryVariants={prefs.accessoryVariants || []}
                  primaryColor={prefs.colors[0] || 'ivory'}
                  secondaryColor={prefs.colors[1] || 'burgundy'}
                  remixLevel={prefs.remixLevel}
                  event={prefs.event}
                  size="lg"
                />
              </div>
            </div>

            {/* Silk Palette Ribbon */}
            <div style={{
              marginTop: 'var(--space-4)',
              background: 'var(--color-white)',
              border: '1.5px solid var(--color-gold)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <span style={{
                fontSize: 'var(--text-xs)', fontWeight: 700,
                color: 'var(--color-crimson)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                display: 'block', marginBottom: 'var(--space-3)',
              }}>
                Sắc lụa truyền thống cấu thành
              </span>

              <div className="flex items-center gap-4 flex-wrap">
                {outfit.palette.map(color => (
                  <div key={color.name} className="flex items-center gap-2">
                    <div style={{
                      width: 36, height: 36,
                      background: color.hex,
                      borderRadius: 'var(--radius-sm)',
                      border: '2px solid var(--color-gold)',
                      boxShadow: 'var(--shadow-sm)',
                    }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0, color: 'var(--color-ink)' }}>
                        {color.name}
                      </p>
                      <p className="caption" style={{ margin: 0, color: 'var(--color-ink-tertiary)' }}>
                        {color.role === 'primary' ? 'Chủ đạo' : color.role === 'secondary' ? 'Phối phụ' : 'Điểm nhấn'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Color Harmony Meter */}
              <div style={{
                marginTop: 'var(--space-4)',
                paddingTop: 'var(--space-3)',
                borderTop: '1px solid var(--color-gold-soft)',
              }}>
                <div className="flex items-center justify-between">
                  <span className="body-sm" style={{ fontWeight: 600, color: 'var(--color-ink-secondary)' }}>
                    Hài hòa sắc phục
                  </span>
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: 70, height: 6,
                      background: 'var(--color-silver-light)',
                      borderRadius: 'var(--radius-full)', overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${harmony.score}%`, height: '100%',
                        background: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-crimson) 100%)',
                        borderRadius: 'var(--radius-full)',
                      }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-crimson)' }}>
                      {harmony.score}/100
                    </span>
                  </div>
                </div>
                <p className="caption text-muted" style={{ marginTop: 'var(--space-1)' }}>
                  {harmony.description} · Gợi ý thẩm mỹ đương đại kết hợp tinh hoa lụa Việt.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Detailed Information & Actions */}
          <div>
            {/* ── 1. Title Header Card (Khối Bản Tuyên Phục Sức) ── */}
            <div className="royal-treasure-card" style={{ marginBottom: 'var(--space-6)' }}>
              {/* Silk bookmark tag */}
              <div className="silk-bookmark-ribbon" title="Bản Phối Di Sản Chuẩn Lễ" />
              <HeritageOrnament variant="corner" size={36} style={{ position: 'absolute', top: 4, left: 4, zIndex: 2 }} />

              <div style={{ position: 'relative', zIndex: 3 }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span style={{
                      display: 'inline-block',
                      width: 7, height: 7,
                      borderRadius: '50%',
                      background: 'var(--color-crimson)',
                      boxShadow: '0 0 8px rgba(139, 26, 26, 0.4)',
                    }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold-dark)' }}>
                      CHIẾU THƯ BẢN PHỐI DI SẢN
                    </span>
                  </div>

                  {/* Royal Vermilion Seal Stamp */}
                  <div className="vermilion-seal" style={{ padding: '3px 10px', fontSize: '11px' }}>
                    <span>印</span>
                    <span>PHỤNG KHẢO BAN THƯỞNG</span>
                  </div>
                </div>

                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 2.6vw, 2.5rem)',
                  color: 'var(--color-crimson)',
                  margin: 'var(--space-2) 0 var(--space-4)',
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}>
                  {outfit.title}
                </h1>

                {/* Silk Ribbon Garment Tags */}
                <div className="flex gap-2 flex-wrap items-center">
                  {outfit.tags.map(tag => (
                    <span
                      key={tag}
                      className="silk-garment-tag"
                      style={{
                        background: 'linear-gradient(135deg, #FFFDF8 0%, #FAF5EC 100%)',
                        color: 'var(--color-crimson)',
                        border: '1px solid var(--color-gold)',
                      }}
                    >
                      <span>✦</span>
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 2. Components Item Breakdown (Bản Kê Xiêm Y Cung Đình) ── */}
            <div className="royal-treasure-card" style={{ marginBottom: 'var(--space-6)' }}>
              <HeritageOrnament variant="corner" size={32} style={{ position: 'absolute', top: 4, right: 4, zIndex: 2, transform: 'rotate(90deg)' }} />

              <div style={{ position: 'relative', zIndex: 3 }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '20px' }}>👘</span>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-lg)',
                      color: 'var(--color-crimson)',
                      margin: 0,
                      fontWeight: 700,
                    }}>
                      Cấu Thành Xiêm Y & Điển Lễ
                    </h3>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--color-gold-dark)',
                    background: 'var(--color-gold-soft)',
                    border: '1px solid var(--color-gold)',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    {outfit.items.length} THÀNH TỐ CHUẨN
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {outfit.items.map((item, i) => {
                    const categoryLabel =
                      item.category === 'garment' ? 'ÁO CHỦ' :
                      item.category === 'bottom' ? 'QUẦN LỤA' :
                      item.category === 'footwear' ? 'HÀI GUỐC' :
                      item.category === 'bag' ? 'TÚI VẢI' :
                      item.category === 'headwear' ? 'MŨ KHĂN' : 'TƯ TRANG';

                    return (
                      <div key={i} className="wardrobe-tablet-item">
                        <div style={{ flex: 1 }}>
                          <div className="flex items-center gap-2">
                            <span style={{ color: 'var(--color-gold-dark)', fontSize: '11px' }}>✦</span>
                            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
                              {item.name}
                            </span>
                          </div>
                          <p className="caption text-muted" style={{ margin: '2px 0 0 16px', lineHeight: 1.5 }}>
                            {item.description}
                          </p>
                        </div>

                        <span className="category-tablet-stamp">
                          {categoryLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── 3. Cultural Traffic Light (Chiếu Chỉ Giám Định Lễ Tục) ── */}
            <div className="royal-protocol-decree" style={{ marginBottom: 'var(--space-6)' }}>
              <HeritageOrnament variant="corner" size={32} style={{ position: 'absolute', top: 4, left: 4, zIndex: 2 }} />

              <div style={{ position: 'relative', zIndex: 3 }}>
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="royal-wax-seal" style={{ width: 46, height: 46, fontSize: '10px' }} title="Triện Định Lễ Cung Đình">
                      <span>ĐIỂN</span>
                      <span style={{ fontWeight: 900 }}>LỄ</span>
                    </div>

                    <div>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        color: 'var(--color-crimson)',
                        textTransform: 'uppercase',
                        display: 'block',
                      }}>
                        ÁP PHÊ THẨM ĐỊNH LỄ TỤC
                      </span>
                      <h4 style={{
                        fontFamily: 'var(--font-display)',
                        margin: 0,
                        color: status.color,
                        fontSize: 'var(--text-base)',
                        fontWeight: 700,
                      }}>
                        {status.label}
                      </h4>
                    </div>
                  </div>

                  <div className="vermilion-seal" style={{ borderColor: status.color, color: status.color }}>
                    <span>{status.icon}</span>
                    <span>{outfit.culturalContext.status === 'green' ? 'CHUẨN HÒA HỢP' : 'LƯU TÂM CHỈNH ĐỐI'}</span>
                  </div>
                </div>

                <div className={`traffic-light ${outfit.culturalContext.status}`} style={{ margin: '0 0 var(--space-3)' }}>
                  <span className="traffic-dot" />
                  <span style={{ fontWeight: 600 }}>{outfit.culturalContext.message}</span>
                </div>

                {outfit.culturalContext.reasons.length > 0 && (
                  <div style={{
                    marginTop: 'var(--space-3)',
                    padding: 'var(--space-4)',
                    background: status.bg,
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${status.color}`,
                  }}>
                    {outfit.culturalContext.reasons.map((reason, i) => (
                      <div key={i} style={{ marginBottom: i < outfit.culturalContext.reasons.length - 1 ? 'var(--space-3)' : 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)', color: 'var(--color-ink)' }}>
                          ✦ {reason.what}
                        </p>
                        <p className="body-sm" style={{ marginBottom: 'var(--space-2)', lineHeight: 1.55 }}>
                          {reason.why}
                        </p>
                        {reason.howToFix && (
                          <button
                            onClick={() => handleFixSuggestion(reason.howToFix)}
                            className="btn btn-sm"
                            style={{
                              background: 'var(--color-white)',
                              color: status.color,
                              border: `1.5px solid ${status.color}`,
                              borderRadius: 'var(--radius-full)',
                              fontWeight: 700,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                            }}
                          >
                            <Sparkles size={13} />
                            Phụng mệnh điều chỉnh tự động
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── 4. Weather & Event Guidance (Tiết Khí Lịch Pháp & Dịp Lễ Dân Gian) ── */}
            <section aria-labelledby="weather-outfit-guidance" className="traditional-almanac-box" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '20px' }}>🎋</span>
                  <h2 id="weather-outfit-guidance" style={{
                    margin: 0,
                    fontSize: 'var(--text-base)',
                    fontFamily: 'var(--font-display)',
                    color: '#1B5E20',
                    fontWeight: 700,
                  }}>
                    Tiết Khí Lịch Pháp & Dịp Lễ Truyền Thống
                  </h2>
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#2E6B56',
                  background: 'rgba(46, 107, 86, 0.12)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  TIỆN NGHI THỜI KHÍ
                </span>
              </div>

              <p className="body-sm" style={{ margin: '0 0 var(--space-2)', fontWeight: 600, color: 'var(--color-ink)' }}>
                Dịp lễ: <span style={{ color: 'var(--color-crimson)' }}>{outfit.outfit.eventName}</span> · Thời khí: <span style={{ color: '#2E6B56' }}>{getWeatherLabel(prefs.weather)}</span>
              </p>
              <p className="caption" style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-ink-secondary)' }}>
                {getWeatherAdvice(prefs.weather)}
              </p>

              {getSuggestedGarmentsForEvent(prefs.event).length > 0 && (
                <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px dashed rgba(46, 107, 86, 0.3)' }}>
                  <p className="caption" style={{ margin: '0 0 var(--space-2)', fontWeight: 700, color: '#1B5E20' }}>
                    Y phục hòa hợp nhất cho dịp này:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {getSuggestedGarmentsForEvent(prefs.event).map(suggestion => (
                      <Link
                        key={suggestion.id}
                        to={`/remix?garment=${suggestion.id}&event=${prefs.event}&weather=${prefs.weather || 'unspecified'}`}
                        className="silk-garment-tag"
                        style={{
                          background: 'var(--color-white)',
                          color: '#2E6B56',
                          border: '1px solid #2E6B56',
                        }}
                      >
                        <span>✦</span>
                        <span>{suggestion.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ── 5. Cultural Presentation Guidance (Cẩm Nang Thể Hiện Văn Hóa) ── */}
            <section aria-labelledby="cultural-presentation-guidance" className="heritage-scholarly-box" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: '20px' }}>📜</span>
                <h2 id="cultural-presentation-guidance" style={{
                  margin: 0,
                  fontSize: 'var(--text-base)',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-crimson)',
                  fontWeight: 700,
                }}>
                  Cẩm Nang Thể Hiện Tinh Hoa Việt Phục
                </h2>
              </div>
              <p className="caption" style={{ margin: '0 0 var(--space-3) 0', color: 'var(--color-ink-secondary)' }}>
                Nguyên tắc ứng xử và truyền tải đúng hồn cốt văn hóa khi mặc hoặc giới thiệu bản phối:
              </p>
              <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', listStyle: 'none' }}>
                {getCulturalPresentationGuidance(garment.id, outfit.culturalContext.status, prefs.remixLevel).map((guidance, idx) => (
                  <li key={guidance} className="body-sm" style={{
                    marginTop: idx === 0 ? 0 : 'var(--space-2)',
                    lineHeight: 1.55,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px',
                  }}>
                    <span style={{ color: 'var(--color-gold-dark)', fontWeight: 800 }}>✦</span>
                    <span>{guidance}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── 6. Why This Look Accordion (Trục Mở Lý Do Tạo Bản Phối) ── */}
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <button
                onClick={() => setShowWhyThisLook(!showWhyThisLook)}
                className="brocade-accordion-trigger"
              >
                <div className="flex items-center gap-2">
                  <span>📜</span>
                  <span>Điển Tích Thiết Kế: Vì sao bản phối này được đề xuất?</span>
                </div>
                {showWhyThisLook ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showWhyThisLook && (
                <div className="animate-fadeIn" style={{
                  padding: 'var(--space-4) var(--space-5)',
                  background: 'linear-gradient(180deg, #FFFDF8 0%, #F5EDE0 100%)',
                  borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
                  border: '1.5px solid var(--color-gold)',
                  borderTop: 'none',
                }}>
                  <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)', margin: 0, color: 'var(--color-ink)' }}>
                    « {outfit.stylingReason} »
                  </p>
                </div>
              )}
            </div>

            {/* ── 7. Ancient Scroll Story Accordion (Chuyện Chiếc Áo Cổ Thư) ── */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <button
                onClick={() => setShowCulturalDetail(!showCulturalDetail)}
                className="brocade-accordion-trigger"
              >
                <div className="flex items-center gap-2">
                  <span>🪷</span>
                  <span>Chuyện Chiếc Áo — Điển Tích & Hồn Cốt {garment?.name}</span>
                </div>
                {showCulturalDetail ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showCulturalDetail && garment && (
                <div className="animate-fadeIn story-card" style={{
                  borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
                  borderTop: 'none',
                  border: '1.5px solid var(--color-gold)',
                  background: 'linear-gradient(180deg, #FFFEFB 0%, #FAF5EC 100%)',
                }}>
                  <div className="story-card-body" style={{ padding: 'var(--space-5)' }}>
                    <div className="story-card-section mb-3">
                      <p className="story-card-section-title" style={{ color: 'var(--color-crimson)', fontWeight: 700 }}>✦ Bối Cảnh Lịch Sử</p>
                      <p className="body-sm" style={{ lineHeight: 1.6 }}>{garment.culturalNote.context}</p>
                    </div>
                    <div className="story-card-section mb-3">
                      <p className="story-card-section-title" style={{ color: 'var(--color-gold-dark)', fontWeight: 700 }}>✦ Cấu Trúc Đặc Điểm Phục Sức</p>
                      <p className="body-sm" style={{ lineHeight: 1.6 }}>{garment.culturalNote.characteristics}</p>
                    </div>
                    <div className="story-card-section">
                      <p className="story-card-section-title" style={{ color: 'var(--color-jade, #2E6B56)', fontWeight: 700 }}>✦ Giới Hạn Sáng Tạo Khi Remix</p>
                      <p className="body-sm" style={{ lineHeight: 1.6 }}>{garment.culturalNote.remixAdvice}</p>
                    </div>
                  </div>
                  <div className="story-card-footer" style={{
                    background: 'var(--color-paper-soft)',
                    padding: 'var(--space-3) var(--space-5)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                    borderTop: '1px dashed rgba(197, 151, 44, 0.4)',
                  }}>
                    <span className="vermilion-seal" style={{ fontSize: '10px' }}>
                      <span>印</span>
                      <span>ĐÃ THẨM ĐỊNH HỌC THUẬT</span>
                    </span>
                    <Link to={`/garments/${garment.id}`} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-crimson)', fontWeight: 700 }}>
                      Xem toàn thư chuyên khảo →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleSave}
                className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
                disabled={saved}
                style={{
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-md)',
                  padding: 'var(--space-3) var(--space-5)',
                }}
              >
                <Bookmark size={16} />
                {saved ? 'Đã lưu vào Tủ đồ' : 'Lưu vào Tủ đồ Di sản'}
              </button>

              <Link to="/lookbook" className="btn btn-secondary" style={{ borderRadius: 'var(--radius-full)' }}>
                <BookOpen size={16} />
                Xem Tủ đồ Lookbook
              </Link>

              <button
                onClick={handleOpenExport}
                className="btn btn-secondary"
                aria-label="Xuất thẻ di sản"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <Download size={16} />
                Xuất Thẻ Di Sản
              </button>

              <button
                onClick={() => {
                  const url = window.location.href;
                  if (navigator.share) {
                    navigator.share({ title: outfit.title, url }).catch(() => {
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(url).then(() => showToast('Đã sao chép liên kết ✓'));
                      }
                    });
                  } else if (navigator.clipboard?.writeText) {
                    navigator.clipboard.writeText(url).then(() => showToast('Đã sao chép liên kết ✓'));
                  }
                }}
                className="btn btn-secondary"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <Share2 size={16} />
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Export Card Modal: Imperial Museum-Grade Collectible Poster ── */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xuất thẻ di sản"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(40, 10, 10, 0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: 'var(--space-4)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowExportModal(false);
          }}
        >
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-2xl)',
              maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto',
              padding: 'var(--space-6)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              border: '2px solid var(--color-gold)',
              position: 'relative',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-crimson)', margin: 0 }}>
                  Thẻ Sưu Tập Di Sản
                </h3>
                <p className="caption text-muted">Bản in kỹ thuật số có chứng nhận tỷ lệ cách tân</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="btn btn-icon btn-ghost"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {/* Ratio selection */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                className={`btn btn-sm ${exportRatio === '4:5' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
                onClick={() => setExportRatio('4:5')}
              >
                Tỷ lệ 4:5 (Bản poster lưu niệm)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${exportRatio === '9:16' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
                onClick={() => setExportRatio('9:16')}
              >
                Tỷ lệ 9:16 (Story di động)
              </button>
            </div>

            {/* Collectible Card Frame */}
            <div
              id="exportable-outfit-card"
              className="export-card-frame"
              style={{
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                aspectRatio: exportRatio === '4:5' ? '4/5' : '9/16',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(180deg, #FFFDF8 0%, #F5EDE0 100%)',
                border: '2px solid var(--color-gold)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* Corner Ornaments */}
              <HeritageOrnament variant="corner" size={36} style={{ position: 'absolute', top: 4, left: 4, zIndex: 3 }} />
              <HeritageOrnament variant="corner" size={36} style={{ position: 'absolute', top: 4, right: 4, zIndex: 3, transform: 'rotate(90deg)' }} />
              <HeritageOrnament variant="corner" size={36} style={{ position: 'absolute', bottom: 4, right: 4, zIndex: 3, transform: 'rotate(180deg)' }} />
              <HeritageOrnament variant="corner" size={36} style={{ position: 'absolute', bottom: 4, left: 4, zIndex: 3, transform: 'rotate(270deg)' }} />

              {/* Card Header */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-crimson)', textTransform: 'uppercase' }}>
                      BỘ SƯU TẬP VIỆT PHỤC DI SẢN
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-ink)', margin: '2px 0 0 0' }}>
                      {outfit.title}
                    </h4>
                  </div>

                  {/* Stamp */}
                  <span style={{
                    border: '1.5px solid var(--color-crimson)',
                    color: 'var(--color-crimson)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}>
                    {outfit.remixLabel === 'Nguyên bản' ? 'NGUYÊN BẢN' : 'BẢN REMIX'}
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap mb-2">
                  <span className="tag" style={{ fontSize: '9px', padding: '1px 8px' }}>{outfit.outfit.regionName}</span>
                  <span className="tag" style={{ fontSize: '9px', padding: '1px 8px' }}>{outfit.outfit.eventName}</span>
                  <span className="tag" style={{ fontSize: '9px', padding: '1px 8px' }}>{outfit.outfit.styleName}</span>
                </div>
              </div>

              {/* Character Illustration */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--space-1) 0', position: 'relative', zIndex: 2 }}>
                <OutfitVisualization
                  garment={prefs.garment || 'ao-dai'}
                    character={prefs.character || DEFAULT_CHARACTER_ID}
                    accessoryVariants={prefs.accessoryVariants || []}
                  primaryColor={prefs.colors[0] || 'ivory'}
                  secondaryColor={prefs.colors[1] || 'burgundy'}
                  remixLevel={prefs.remixLevel}
                  event={prefs.event}
                  size="sm"
                />
              </div>

              {/* Palette & Items Footprint */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="caption" style={{ fontWeight: 700, fontSize: '10px', color: 'var(--color-crimson)' }}>Sắc lụa:</span>
                  {outfit.palette.map(c => (
                    <div
                      key={c.name}
                      style={{
                        width: 14, height: 14, borderRadius: 2,
                        background: c.hex, border: '1px solid var(--color-gold)',
                      }}
                      title={`${c.name}`}
                    />
                  ))}
                  <span className="caption text-muted" style={{ marginLeft: 'auto', fontSize: '10px' }}>
                    Hòa hợp: {harmony.score}/100
                  </span>
                </div>

                <div style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-2) var(--space-3)',
                  border: '1px solid var(--color-gold-soft)',
                  marginBottom: 'var(--space-2)',
                }}>
                  <p className="caption" style={{ fontWeight: 700, fontSize: '10px', margin: '0 0 2px 0', color: 'var(--color-ink)' }}>
                    Thành phần y phục:
                  </p>
                  <ul style={{ fontSize: '10px', lineHeight: 1.3, color: 'var(--color-ink-secondary)', margin: 0, paddingLeft: 12 }}>
                    {outfit.items.slice(0, 5).map((item, idx) => (
                      <li key={idx}><strong>{item.name}</strong>{item.color ? ` (${item.color})` : ''}</li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  borderTop: '1px dashed var(--color-gold)',
                  paddingTop: 'var(--space-2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '8px', color: 'var(--color-ink-tertiary)', fontStyle: 'italic' }}>
                    {outfit.remixLabel !== 'Nguyên bản'
                      ? 'Bản phối cách tân tôn vinh di sản'
                      : 'Trang phục nguyên bản theo điển lệ'}
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-crimson)' }}>
                    phoiviet.heritage
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end mt-4">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowExportModal(false)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  window.print();
                  showToast('Đang mở hộp thoại in / xuất PDF ✓');
                }}
              >
                In / Tải PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast" role="alert" aria-live="polite" aria-atomic="true">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ResultPage;
