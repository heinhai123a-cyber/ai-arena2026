import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, CheckCircle, AlertCircle, Sparkles, Wand2 } from 'lucide-react';
import { garments } from '../content/garments';
import { events, styles, colorOptions, accessories } from '../content/catalog';
import { PRESET_MATRIX } from '../content/presets';
import { CharacterPortrait, OutfitVisualization } from '../components/OutfitVisualization';
import { RemixTapeBadge } from '../components/RemixTapeBadge';
import { HeritageOrnament } from '../components/heritage/HeritageOrnament';
import { HeritagePattern } from '../components/heritage/HeritagePattern';
import { LotusLogo } from '../components/LotusLogo';
import { validateCulturalContext } from '../lib/culturalValidation';
import { calculateColorHarmony } from '../lib/colorHarmony';
import type { CharacterId, GarmentId, EventId, StyleId, ColorId, AccessoryId, RemixPreferences, WeatherId } from '../types';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getSuggestedGarmentsForEvent, getWeatherAdvice, weatherOptions } from '../lib/outfitGuidance';
import { DEFAULT_CHARACTER_ID, representativeCharacters } from '../content/characters';

const TOTAL_STEPS = 6;

const garmentCardTints: Record<string, string> = {
  'ao-dai': 'var(--color-red-soft)',
  'ao-ngu-than': 'var(--color-gold-soft)',
  'ao-tu-than': 'var(--color-jade-soft)',
  'ao-ba-ba': 'var(--color-indigo-soft)',
};

const garmentRealImages: Record<string, { src: string; title: string; caption: string; source: string; tags: string[] }> = {
  'ao-dai': {
    src: '/images/outfits/ao-dai-red.jpg',
    title: 'Áo Dài Truyền Thống Hoàng Cung',
    caption: 'Áo dài lụa tơ tằm thêu hoa mai hoàng cung, phối kiềng bạc & nón lá bài thơ',
    source: 'Nguồn tham khảo: BST Áo Dài NEM Fashion (nemshop.vn) & Duyên Hà',
    tags: ['Lụa tơ tằm', 'Kiềng bạc', 'Nón lá', 'Mấn hoàng gia'],
  },
  'ao-ngu-than': {
    src: '/images/outfits/ao-ngu-than.jpg',
    title: 'Áo Ngũ Thân Lập Lĩnh Cổ Phục',
    caption: 'Áo ngũ thân lập lĩnh gấm xanh ngọc, khăn đóng chỉn chu trang trọng',
    source: 'Nguồn tham khảo: 15 Trang phục truyền thống Việt Nam (vanhoavn.blog)',
    tags: ['Gấm hoa', 'Khăn đóng', 'Cổ đứng', 'Ngũ thân'],
  },
  'ao-tu-than': {
    src: '/images/outfits/ao-tu-than.jpg',
    title: 'Áo Tứ Thân Mớ Ba Mớ Bảy',
    caption: 'Áo tứ thân Kinh Bắc mớ ba mớ bảy, yếm đào thắm sắc & nón quai thao trẩy hội Quan Họ',
    source: 'Nguồn tham khảo: Di sản văn hóa Bắc Bộ (vanhoavn.blog)',
    tags: ['Yếm đào', 'Nón quai thao', 'Váy đụp', 'Khăn mỏ quạ'],
  },
  'ao-ba-ba': {
    src: '/images/outfits/ao-ba-ba.jpg',
    title: 'Áo Bà Ba Duyên Dáng Nam Bộ',
    caption: 'Áo bà ba lụa mềm mại, khăn rằn Nam Bộ và nón lá duyên dáng sông nước',
    source: 'Nguồn tham khảo: Trang phục Duyên Hà & Văn hóa sông nước Nam Bộ',
    tags: ['Khăn rằn', 'Quần lá tọa', 'Nón lá', 'Guốc mộc'],
  },
};

const RemixStudioPage: React.FC = () => {
  useDocumentTitle('Xưởng May Di Sản — Remix Studio');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  const presetKey = searchParams.get('preset');
  const activePreset = presetKey && PRESET_MATRIX[presetKey] ? PRESET_MATRIX[presetKey] : null;

  // State
  const [step, setStep] = useState(() => (isDemo || activePreset ? 6 : 1));
  const [previewMode, setPreviewMode] = useState<'svg' | 'real'>('svg');
  const [prefs, setPrefs] = useState<RemixPreferences>(() => {
    if (activePreset) {
      return { ...activePreset.prefs, character: activePreset.prefs.character || DEFAULT_CHARACTER_ID };
    }
    if (isDemo) {
      return {
        garment: 'ao-dai',
        character: 'ha',
        event: 'tet',
        region: 'trung-bo',
        style: 'toi-gian',
        colors: ['ivory', 'burgundy'],
        accessories: ['trang-suc', 'tui'],
        weather: 'unspecified',
        remixLevel: 70,
      };
    }
    const garmentId = (searchParams.get('garment') as GarmentId) || null;
    const garment = garmentId ? garments.find(g => g.id === garmentId) : null;
    const requestedCharacter = searchParams.get('character') as CharacterId | null;
    return {
      garment: garmentId,
      character: representativeCharacters.some(character => character.id === requestedCharacter) ? requestedCharacter || DEFAULT_CHARACTER_ID : DEFAULT_CHARACTER_ID,
      event: (searchParams.get('event') as EventId) || null,
      weather: (searchParams.get('weather') as WeatherId) || 'unspecified',
      region: garment ? garment.region[0] : null,
      style: (searchParams.get('style') as StyleId) || null,
      colors: [],
      accessories: [],
      accessoryVariants: searchParams.get('accessoryVariants')?.split(',').filter(Boolean) || [],
      remixLevel: 50,
    };
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const canContinue = useCallback((): boolean => {
    switch (step) {
      case 1: return prefs.garment !== null;
      case 2: return prefs.event !== null;
      case 3: return prefs.style !== null;
      case 4: return prefs.colors.length > 0;
      case 5: return true; // Accessories are optional
      case 6: return true; // Slider always has a value
      default: return false;
    }
  }, [step, prefs]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const params = new URLSearchParams();
      params.set('garment', prefs.garment || 'ao-dai');
      params.set('character', prefs.character || DEFAULT_CHARACTER_ID);
      params.set('event', prefs.event || 'tet');
      params.set('weather', prefs.weather || 'unspecified');
      params.set('region', prefs.region || 'bac-bo');
      params.set('style', prefs.style || 'toi-gian');
      params.set('colors', prefs.colors.join(','));
      params.set('accessories', prefs.accessories.join(','));
      params.set('accessoryVariants', (prefs.accessoryVariants || []).join(','));
      params.set('remix', prefs.remixLevel.toString());
      navigate(`/result?${params.toString()}`);
    }, 1800);
  };

  const toggleColor = (id: ColorId) => {
    setPrefs(p => {
      const colors = p.colors.includes(id)
        ? p.colors.filter(c => c !== id)
        : p.colors.length < 3 ? [...p.colors, id] : [p.colors[1], p.colors[2], id];
      return { ...p, colors };
    });
  };

  const toggleAccessory = (id: AccessoryId) => {
    const accessory = accessories.find(candidate => candidate.id === id);
    setPrefs(p => {
      const isSelected = p.accessories.includes(id);
      const firstCompatible = accessory?.variants.find(v => v.compatibleGarments.includes(p.garment || 'ao-dai')) || accessory?.variants[0];
      return {
        ...p,
        accessories: isSelected ? p.accessories.filter(item => item !== id) : [...p.accessories, id],
        accessoryVariants: isSelected
          ? (p.accessoryVariants || []).filter(variantId =>
              !accessory?.variants.some(variant => variant.id === variantId)
            )
          : firstCompatible
          ? [...(p.accessoryVariants || []), firstCompatible.id]
          : (p.accessoryVariants || []),
      };
    });
  };

  const toggleAccessoryVariant = (accessoryId: AccessoryId, variantId: string) => {
    const accessory = accessories.find(candidate => candidate.id === accessoryId);
    if (!accessory) return;
    setPrefs(p => {
      const groupVariantIds = new Set(accessory.variants.map(variant => variant.id));
      const remainingVariants = (p.accessoryVariants || []).filter(id => !groupVariantIds.has(id));
      const isSelected = p.accessoryVariants?.includes(variantId) || false;
      return {
        ...p,
        accessories: isSelected ? p.accessories.filter(id => id !== accessoryId) : p.accessories.includes(accessoryId) ? p.accessories : [...p.accessories, accessoryId],
        accessoryVariants: isSelected ? remainingVariants : [...remainingVariants, variantId],
      };
    });
  };

  const remixLabel = prefs.remixLevel <= 33 ? 'Nguyên bản' : prefs.remixLevel <= 66 ? 'Cách tân' : 'Remix mạnh';

  // ═══════════════════════════════════════
  // GENERATING STATE — Imperial Ritual Screen
  // ═══════════════════════════════════════
  if (isGenerating) {
    return (
      <div className="page generating-ritual">
        <div className="generating-ritual-card animate-fadeIn">
          {/* Lotus Spinner Ring */}
          <div className="lotus-spinner-ring">
            <div className="ring" />
            <div className="center">
              <LotusLogo size={38} />
            </div>
          </div>

          <span style={{
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-dark)',
            display: 'block', marginBottom: 'var(--space-2)',
          }}>
            XƯỞNG MAY HOÀNG CUNG
          </span>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            color: 'var(--color-crimson)',
            marginBottom: 'var(--space-3)',
          }}>
            Đang dệt phối phục trang...
          </h2>

          <p className="text-muted body-sm" style={{ lineHeight: 'var(--leading-relaxed)' }}>
            Hệ thống đang đối chiếu quy chuẩn văn hóa, tính hài hòa của sắc lụa và tỷ lệ cách tân di sản.
          </p>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const stepTitles = [
    'Nhân Vật & Trang Phục',
    'Không Gian & Điển Lễ',
    'Định Hình Phong Cách',
    'Mẫu Lụa & Sắc Phục',
    'Điểm Xuyết Phụ Trang',
    'Bàn Cân Chỉnh Di Sản & Mức Remix',
  ];

  const stepSubtitles = [
    'Chọn nhân vật đại diện và trang phục truyền thống Việt Nam bạn muốn phối',
    'Dịp xuất hiện quyết định tinh thần và phép tắc của bộ y phục',
    'Khí chất thẩm mỹ bạn muốn truyền tải qua bộ xiêm y',
    'Chọn tối đa 3 sắc thái lụa truyền thống hài hòa',
    'Phụ kiện hoàn thiện phong thái người mặc (tùy chọn)',
    'Kéo Thước Remix để điều hòa giữa gìn giữ nguyên bản và hơi thở đương đại',
  ];

  const removeAccessoryVariant = (variantId: string) => {
    setPrefs(p => {
      const newVariants = (p.accessoryVariants || []).filter(id => id !== variantId);
      const remainingAccessories = accessories
        .filter(acc => acc.variants.some(v => newVariants.includes(v.id)))
        .map(acc => acc.id);
      return {
        ...p,
        accessories: remainingAccessories,
        accessoryVariants: newVariants,
      };
    });
  };

  // ═══════════════════════════════════════
  // BRONZE MIRROR — Live Preview Panel
  // ═══════════════════════════════════════
  const renderLivePreview = () => {
    const currentGarment = garments.find(g => g.id === prefs.garment) || garments[0];
    const currentEvent = events.find(e => e.id === prefs.event);
    const realImageInfo = garmentRealImages[prefs.garment || 'ao-dai'] || garmentRealImages['ao-dai'];
    const activeVariantsCount = prefs.accessoryVariants?.length || 0;

    return (
      <div className="bronze-mirror-panel" style={{ position: 'relative' }}>
        {/* Heritage Corner Ornaments */}
        <HeritageOrnament variant="corner" size={36} style={{ position: 'absolute', top: 4, left: 4, zIndex: 3 }} />
        <HeritageOrnament variant="corner" size={36} style={{ position: 'absolute', top: 4, right: 4, zIndex: 3, transform: 'rotate(90deg)' }} />

        {/* Mirror Title Plate */}
        <div className="mirror-title-plate">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LotusLogo size={18} />
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-crimson)',
            }}>
              Gương Đồng Thử Đồ
            </span>
          </div>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            color: '#2E7D32',
            padding: '2px 10px',
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            border: '1px solid rgba(46, 125, 50, 0.2)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2E7D32', display: 'inline-block' }} />
            Đang hiển thị
          </span>
        </div>

        {/* Mode Switch: SVG vs Real Photo */}
        <div className="mirror-mode-switch">
          <button
            type="button"
            onClick={() => setPreviewMode('svg')}
            className={`mirror-mode-tab ${previewMode === 'svg' ? 'active' : ''}`}
          >
            🎨 Minh họa tương tác
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('real')}
            className={`mirror-mode-tab ${previewMode === 'real' ? 'active' : ''}`}
          >
            📸 Ảnh di sản thực tế
          </button>
        </div>

        {/* Canvas Display */}
        <div className="mirror-canvas">
          {previewMode === 'svg' ? (
            <OutfitVisualization
              garment={prefs.garment || 'ao-dai'}
              character={prefs.character || DEFAULT_CHARACTER_ID}
              accessoryVariants={prefs.accessoryVariants || []}
              primaryColor={prefs.colors[0] || 'ivory'}
              secondaryColor={prefs.colors[1] || 'burgundy'}
              remixLevel={prefs.remixLevel}
              event={prefs.event}
              size="md"
            />
          ) : (
            <div style={{ padding: 'var(--space-2)', width: '100%' }}>
              <div style={{
                width: '100%',
                height: 290,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                position: 'relative',
              }}>
                <img
                  src={realImageInfo.src}
                  alt={realImageInfo.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(20,8,8,0.92))',
                  padding: '16px 12px 8px',
                  color: 'var(--color-white)',
                  textAlign: 'left',
                }}>
                  <strong style={{ fontSize: '12px', display: 'block', color: 'var(--color-gold-bright)', marginBottom: 2 }}>
                    {realImageInfo.title}
                  </strong>
                  <p style={{ margin: 0, fontSize: '11px', lineHeight: 1.35, opacity: 0.9 }}>
                    {realImageInfo.caption}
                  </p>
                  <span style={{ fontSize: '9px', opacity: 0.75, display: 'block', marginTop: 4 }}>
                    {realImageInfo.source}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Config Ribbon Strip */}
        <div style={{ marginTop: 'var(--space-3)' }}>
          <div className="config-ribbon-strip">
            <span className="config-ribbon garment">
              👘 {currentGarment.name}
            </span>
            {currentEvent ? (
              <span className="config-ribbon event">
                {currentEvent.icon} {currentEvent.name}
              </span>
            ) : (
              <span style={{
                fontSize: '10px',
                color: 'var(--color-ink-tertiary)',
                background: 'var(--color-paper-soft)',
                padding: '3px 10px',
                borderRadius: '999px',
              }}>
                📅 Chưa chọn dịp (Hồi 2)
              </span>
            )}
            {prefs.colors.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 'auto' }}>
                {prefs.colors.map(cId => {
                  const col = colorOptions.find(c => c.id === cId);
                  return (
                    <span
                      key={cId}
                      style={{
                        width: 14, height: 14, borderRadius: '50%',
                        background: col?.hex || '#ccc',
                        border: '1.5px solid var(--color-gold)',
                        display: 'inline-block',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      }}
                      title={col?.name}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Equipped Accessories Tray */}
          <div className="accessories-tray">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-crimson)' }}>
                Phụ kiện hiển thị trên ảnh ({activeVariantsCount}):
              </span>
            </div>
            {activeVariantsCount > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {prefs.accessoryVariants?.map(variantId => {
                  let variantName = variantId;
                  for (const acc of accessories) {
                    const found = acc.variants.find(v => v.id === variantId);
                    if (found) {
                      variantName = found.name;
                      break;
                    }
                  }
                  return (
                    <span key={variantId} className="accessory-pill">
                      ✦ {variantName}
                      <button
                        type="button"
                        onClick={() => removeAccessoryVariant(variantId)}
                        className="remove-btn"
                        title={`Bỏ ${variantName}`}
                        aria-label={`Bỏ ${variantName}`}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-ink-tertiary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                💡 Hãy chọn Nón lá, Khăn rằn, Kiềng bạc, Quạt lụa... ở Hồi 5 để trang phục hiển thị phụ kiện tương ứng!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════
  return (
    <div className="page" style={{ paddingBottom: 'var(--space-16)' }}>
      {/* ── IMPERIAL ATELIER BANNER ── */}
      <div className="atelier-banner" style={{
        marginTop: 'calc(-1 * var(--space-6))',
        marginBottom: 'var(--space-6)',
      }}>
        {/* Full-bleed dragon pattern background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/images/heritage/royal-dragon-phoenix-bg.jpg"
            alt="Hoa văn rồng phượng hoàng triều"
            aria-hidden="true"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, filter: 'saturate(1.2)' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(160deg, rgba(42,6,6,0.88) 0%, rgba(92,15,15,0.78) 30%, rgba(74,13,13,0.9) 100%)',
          }} />
        </div>

        <HeritagePattern opacity={0.04} />
        <HeritageOrnament variant="corner" size={56} style={{ position: 'absolute', top: 6, left: 6, zIndex: 2 }} />
        <HeritageOrnament variant="corner" size={56} style={{ position: 'absolute', top: 6, right: 6, zIndex: 2, transform: 'rotate(90deg)' }} />
        <HeritageOrnament variant="corner" size={56} style={{ position: 'absolute', bottom: 6, left: 6, zIndex: 2, transform: 'rotate(-90deg)' }} />
        <HeritageOrnament variant="corner" size={56} style={{ position: 'absolute', bottom: 6, right: 6, zIndex: 2, transform: 'rotate(180deg)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 3, maxWidth: 960 }}>
          {/* Roof eave motif */}
          <div style={{ maxWidth: 220, marginBottom: '8px' }}>
            <img
              src="/images/heritage/dau-an-vietnam-roof.jpg"
              alt="Dấu Ấn Việt Nam"
              style={{ width: '100%', height: 28, objectFit: 'contain', opacity: 0.7 }}
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-bright)',
                display: 'block',
                marginBottom: '6px',
              }}>
                ✦ KHÔNG GIAN SÁNG TẠO DI SẢN ✦
              </span>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                color: 'var(--color-gold-bright)',
                margin: 0,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
              }}>
                Xưởng May Di Sản
              </h1>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 243, 209, 0.75)',
                margin: 'var(--space-1) 0 0',
                fontStyle: 'italic',
              }}>
                Phòng Thử Xiêm Y Hoàng Cung · AI Virtual Try-On
              </p>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1.5px solid var(--color-gold)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              backdropFilter: 'blur(8px)',
            }}>
              <Sparkles size={16} style={{ color: 'var(--color-gold-bright)' }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold-bright)', fontWeight: 700 }}>
                Hồi {step} / {TOTAL_STEPS}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1180, margin: '0 auto' }}>
        {/* ── ORNATE MEDALLION PROGRESS BAR ── */}
        <div style={{
          background: 'linear-gradient(180deg, #FFFEFB 0%, #FAF5EC 100%)',
          border: '2px solid var(--color-gold)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-5) var(--space-6)',
          marginBottom: 'var(--space-8)',
          boxShadow: '0 6px 20px rgba(197, 151, 44, 0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Inner dashed border */}
          <div style={{
            position: 'absolute', inset: '4px',
            border: '1px solid rgba(197, 151, 44, 0.2)',
            borderRadius: 'calc(var(--radius-2xl) - 4px)',
            pointerEvents: 'none',
          }} />

          {/* Back button + Step title */}
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
            <button
              onClick={handleBack}
              className="btn btn-ghost btn-sm"
              disabled={step === 1}
              style={{
                color: step === 1 ? 'var(--color-ink-tertiary)' : 'var(--color-crimson)',
                fontWeight: 700,
              }}
              aria-label="Bước trước"
            >
              <ArrowLeft size={16} />
              Trở lại
            </button>

            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              color: 'var(--color-crimson)',
              letterSpacing: '0.06em',
              background: 'linear-gradient(135deg, rgba(197, 151, 44, 0.1) 0%, rgba(197, 151, 44, 0.05) 100%)',
              border: '1.5px solid var(--color-gold)',
              padding: '5px 16px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-display)',
            }}>
              {stepTitles[step - 1]}
            </span>

            <div style={{ width: 70, textAlign: 'right' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-gold-dark)',
              }}>
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
          </div>

          {/* Medallion Step Indicators */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            padding: '0 var(--space-2)',
          }}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <React.Fragment key={i}>
                <div className={`atelier-step-medallion ${
                  i + 1 < step ? 'completed' : i + 1 === step ? 'active' : 'upcoming'
                }`}>
                  {i + 1 < step ? <Check size={18} strokeWidth={3} /> : i + 1}
                </div>
                {i < TOTAL_STEPS - 1 && (
                  <div className={`atelier-step-cord ${i + 1 < step ? 'filled' : 'empty'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── STEP CONTENT PANE ── */}
        <div className="studio-step-pane" key={step}>
          <div className="text-center mb-8">
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              color: 'var(--color-crimson)',
              marginBottom: 'var(--space-2)',
            }}>
              {stepTitles[step - 1]}
            </h2>
            <p className="text-muted body-sm" style={{ maxWidth: 540, margin: '0 auto' }}>
              {stepSubtitles[step - 1]}
            </p>
          </div>

          {/* STEPS 1-5: WORKSPACE WITH BRONZE MIRROR */}
          {step < TOTAL_STEPS && (
            <div className="studio-workspace-grid">
              <div style={{ minWidth: 0 }}>
                {/* ═══ STEP 1: CHARACTER & GARMENT ═══ */}
                {step === 1 && (
                  <div style={{ width: '100%' }}>
                    {/* Character Picker */}
                    <section aria-labelledby="character-picker-heading" style={{ marginBottom: 'var(--space-6)' }}>
                      <h3 id="character-picker-heading" style={{
                        margin: '0 0 var(--space-3)',
                        fontSize: 'var(--text-base)',
                        color: 'var(--color-crimson)',
                        fontFamily: 'var(--font-display)',
                      }}>
                        Nhân vật đại diện · minh họa
                      </h3>
                      <div role="group" aria-label="Chọn nhân vật đại diện" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(112px, 1fr))',
                        gap: 'var(--space-3)',
                      }}>
                        {representativeCharacters.map(character => {
                          const isSelected = (prefs.character || DEFAULT_CHARACTER_ID) === character.id;
                          return (
                            <button
                              key={character.id}
                              type="button"
                              aria-pressed={isSelected}
                              aria-label={`${character.name}, ${character.description}`}
                              onClick={() => setPrefs(current => ({ ...current, character: character.id }))}
                              className={`lacquer-selection-card ${isSelected ? 'selected' : ''}`}
                              style={{
                                minHeight: 132,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                padding: 'var(--space-3)',
                              }}
                            >
                              {isSelected && (
                                <div className="lacquer-seal-check">
                                  <Check size={14} strokeWidth={3} />
                                </div>
                              )}
                              <CharacterPortrait character={character.id} size={66} />
                              <strong style={{ fontSize: 'var(--text-sm)', color: isSelected ? 'var(--color-crimson)' : 'var(--color-ink)' }}>{character.name}</strong>
                              <span className="caption text-muted">{character.description}</span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="caption text-muted" style={{ margin: 'var(--space-2) 0 0' }}>
                        Đây là silhouette minh họa để thử phối đồ, không đại diện cho chuẩn hình thể của mọi người.
                      </p>
                    </section>

                    {/* Garment Picker */}
                    <h3 style={{
                      margin: '0 0 var(--space-3)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--color-crimson)',
                      fontFamily: 'var(--font-display)',
                    }}>
                      Chọn trang phục
                    </h3>
                    <div className="grid-2" style={{ gap: 'var(--space-5)' }}>
                      {garments.map(g => {
                        const isSelected = prefs.garment === g.id;
                        return (
                          <button
                            key={g.id}
                            onClick={() => setPrefs(p => ({ ...p, garment: g.id, region: g.region[0] }))}
                            className={`lacquer-selection-card ${isSelected ? 'selected' : ''}`}
                            style={{
                              padding: 'var(--space-5)',
                              textAlign: 'left',
                              display: 'flex',
                              gap: 'var(--space-4)',
                              alignItems: 'center',
                            }}
                          >
                            {isSelected && (
                              <div className="lacquer-seal-check">
                                <Check size={14} strokeWidth={3} />
                              </div>
                            )}

                            <div className="garment-thumb-frame" style={{
                              background: garmentCardTints[g.id] || 'var(--color-gold-soft)',
                            }}>
                              <div style={{ transform: 'scale(0.85)' }}>
                                <OutfitVisualization
                                  garment={g.id as GarmentId}
                                  character={prefs.character || DEFAULT_CHARACTER_ID}
                                  primaryColor="ivory"
                                  secondaryColor="burgundy"
                                  remixLevel={20}
                                  size="sm"
                                />
                              </div>
                            </div>

                            <div>
                              <h3 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--text-lg)',
                                color: isSelected ? 'var(--color-crimson)' : 'var(--color-ink)',
                                margin: '0 0 var(--space-1) 0',
                              }}>
                                {g.name}
                              </h3>
                              <p className="caption text-muted" style={{ margin: 0, lineHeight: 1.4 }}>
                                {g.shortDescription}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ═══ STEP 2: EVENT & WEATHER ═══ */}
                {step === 2 && (
                  <div style={{ maxWidth: 840, margin: '0 auto' }}>
                    <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
                      {events.map(e => {
                        const isSelected = prefs.event === e.id;
                        return (
                          <button
                            key={e.id}
                            onClick={() => setPrefs(p => ({ ...p, event: e.id }))}
                            className={`ceremony-card ${isSelected ? 'selected' : ''}`}
                          >
                            {isSelected && (
                              <div className="lacquer-seal-check">
                                <Check size={14} strokeWidth={3} />
                              </div>
                            )}
                            <div className="icon-disc">{e.icon}</div>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: 'var(--text-base)',
                              color: isSelected ? 'var(--color-crimson)' : 'var(--color-ink)',
                              marginBottom: 'var(--space-1)',
                            }}>
                              {e.name}
                            </h3>
                            <p className="caption text-muted" style={{ margin: 0 }}>
                              {e.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Weather Oracle */}
                    <section aria-labelledby="weather-guidance-heading" className="weather-oracle" style={{ marginTop: 'var(--space-6)' }}>
                      <h3 id="weather-guidance-heading" style={{
                        margin: '0 0 var(--space-3)',
                        color: '#1B5E20',
                        fontSize: 'var(--text-base)',
                        fontFamily: 'var(--font-display)',
                      }}>
                        🌿 Tiết Khí · Thời tiết dự kiến
                      </h3>
                      <div role="group" aria-label="Chọn thời tiết" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        {weatherOptions.map(option => (
                          <button
                            key={option.id}
                            type="button"
                            aria-pressed={(prefs.weather || 'unspecified') === option.id}
                            onClick={() => setPrefs(current => ({ ...current, weather: option.id }))}
                            className={`weather-chip ${(prefs.weather || 'unspecified') === option.id ? 'active' : ''}`}
                          >
                            <span aria-hidden="true">{option.icon}</span>{option.label}
                          </button>
                        ))}
                      </div>
                      <p className="body-sm" style={{ margin: 'var(--space-3) 0 0', lineHeight: 'var(--leading-relaxed)' }}>
                        {getWeatherAdvice(prefs.weather)}
                      </p>
                      {prefs.event && getSuggestedGarmentsForEvent(prefs.event).length > 0 && (
                        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid rgba(46, 107, 86, 0.2)' }}>
                          <p className="caption" style={{ margin: '0 0 var(--space-2)', fontWeight: 700, color: '#1B5E20' }}>
                            Trang phục gợi ý theo dịp · chọn để thay áo hiện tại
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                            {getSuggestedGarmentsForEvent(prefs.event).map(garment => (
                              <button
                                key={garment.id}
                                type="button"
                                aria-pressed={prefs.garment === garment.id}
                                onClick={() => setPrefs(current => ({
                                  ...current,
                                  garment: garment.id,
                                  region: current.region && garment.region.includes(current.region) ? current.region : garment.region[0],
                                }))}
                                className={`weather-chip ${prefs.garment === garment.id ? 'active' : ''}`}
                              >
                                {garment.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="caption text-muted" style={{ margin: 'var(--space-3) 0 0' }}>
                        Gợi ý thời tiết tập trung vào sự thoải mái; không thay đổi hay xác nhận đặc trưng lịch sử của trang phục.
                      </p>
                    </section>
                  </div>
                )}

                {/* ═══ STEP 3: STYLE ═══ */}
                {step === 3 && (
                  <div className="grid-2" style={{ maxWidth: 680, margin: '0 auto', gap: 'var(--space-5)' }}>
                    {styles.map(s => {
                      const isSelected = prefs.style === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setPrefs(p => ({ ...p, style: s.id }))}
                          className={`aesthetic-card ${isSelected ? 'selected' : ''}`}
                        >
                          {isSelected && (
                            <div className="lacquer-seal-check">
                              <Check size={14} strokeWidth={3} />
                            </div>
                          )}
                          <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-lg)',
                            color: isSelected ? 'var(--color-crimson)' : 'var(--color-ink)',
                            marginBottom: 'var(--space-2)',
                          }}>
                            {s.name}
                          </h3>
                          <p className="body-sm text-muted" style={{ margin: 0, lineHeight: 'var(--leading-relaxed)' }}>
                            {s.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ═══ STEP 4: COLORS ═══ */}
                {step === 4 && (
                  <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
                    <div className="silk-dyeing-chamber">
                      <div className="chamber-title">
                        BẢNG MÀU LỤA TỰ NHIÊN
                      </div>
                      <p className="body-sm text-muted mt-1 mb-6">
                        Chọn từ 1 đến 3 sắc thái lụa truyền thống để phối dệt y phục
                      </p>

                      <div className="flex gap-4 justify-center flex-wrap mb-8">
                        {colorOptions.map(c => {
                          const isSelected = prefs.colors.includes(c.id);
                          return (
                            <div key={c.id} style={{ textAlign: 'center' }}>
                              <button
                                onClick={() => toggleColor(c.id)}
                                className={`silk-swatch-circle ${isSelected ? 'selected' : ''}`}
                                style={{ background: c.hex }}
                                aria-label={`${c.name}: ${c.description}`}
                                title={c.description}
                              >
                                {isSelected && (
                                  <div className="check-overlay">
                                    <Check size={20} strokeWidth={3} style={{
                                      color: c.id === 'ivory' || c.id === 'cream' || c.id === 'pastel' ? 'var(--color-ink)' : 'var(--color-white)',
                                    }} />
                                  </div>
                                )}
                              </button>
                              <p className="caption" style={{ marginTop: 'var(--space-2)', fontWeight: 600, fontSize: '11px' }}>{c.name}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected Palette Strip */}
                      {prefs.colors.length > 0 && (
                        <div className="silk-palette-display">
                          <span className="body-sm" style={{ fontWeight: 700, color: 'var(--color-crimson)' }}>
                            Dải lụa đã chọn ({prefs.colors.length}/3):
                          </span>
                          <div className="palette" style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            {prefs.colors.map(colorId => {
                              const color = colorOptions.find(c => c.id === colorId);
                              return color && (
                                <div
                                  key={colorId}
                                  style={{
                                    width: 26, height: 26,
                                    borderRadius: '50%',
                                    background: color.hex,
                                    border: '2px solid var(--color-gold)',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                  }}
                                  title={color.name}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ═══ STEP 5: ACCESSORIES ═══ */}
                {step === 5 && (
                  <div style={{ maxWidth: 760, margin: '0 auto' }}>
                    <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
                      {accessories.map(acc => {
                        const isSelected = prefs.accessories.includes(acc.id);
                        return (
                          <button
                            key={acc.id}
                            onClick={() => toggleAccessory(acc.id)}
                            className={`treasure-accessory-card ${isSelected ? 'selected' : ''}`}
                          >
                            {isSelected && (
                              <div className="lacquer-seal-check">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                            <p style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 700,
                              color: isSelected ? 'var(--color-crimson)' : 'var(--color-ink)',
                              margin: '0 0 var(--space-1)',
                            }}>
                              {acc.name}
                            </p>
                            <p style={{ color: 'var(--color-ink-tertiary)', fontSize: '11px', margin: 0 }}>
                              {acc.category}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    {accessories.filter(accessory => prefs.accessories.includes(accessory.id)).map(accessory => (
                      <fieldset key={accessory.id} className="variant-scroll-fieldset">
                        <legend>
                          Chọn biến thể: {accessory.name}
                        </legend>
                        <div className="grid-2" style={{ gap: 'var(--space-2)' }}>
                          {accessory.variants.map(variant => {
                            const isSelected = prefs.accessoryVariants?.includes(variant.id) || false;
                            const matchesGarment = variant.compatibleGarments.includes(prefs.garment || 'ao-dai');
                            const matchesRemix = prefs.remixLevel >= variant.remixRange[0] && prefs.remixLevel <= variant.remixRange[1];
                            const isOutsideCatalogMatch = !matchesGarment || !matchesRemix;
                            return (
                              <button
                                key={variant.id}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => toggleAccessoryVariant(accessory.id, variant.id)}
                                className={`variant-chip ${isSelected ? 'selected' : ''}`}
                              >
                                <strong style={{ display: 'block', fontSize: 'var(--text-xs)' }}>{variant.name}</strong>
                                <span className="caption" style={{ display: 'block', marginTop: 2, lineHeight: 1.4 }}>{variant.description}</span>
                                {isSelected && (
                                  <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                    marginTop: 4, fontSize: '10px',
                                    color: 'var(--color-crimson)', fontWeight: 700,
                                  }}>
                                    ✓ Đang hiển thị trên ảnh
                                  </span>
                                )}
                                {isOutsideCatalogMatch && (
                                  <span className="caption" style={{
                                    display: 'block', marginTop: 3,
                                    color: 'var(--color-warning)', fontWeight: 700,
                                  }}>
                                    Ngoài tổ hợp tương thích trong catalog · sẽ được cảnh báo ngữ cảnh
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                )}
              </div>
              <aside className="studio-live-preview-col">
                {renderLivePreview()}
              </aside>
            </div>
          )}

          {/* ═══ STEP 6: WORKBENCH — REMIX CALIBRATION ═══ */}
          {step === 6 && (() => {
            const culturalContext = validateCulturalContext({
              garment: prefs.garment || 'ao-dai',
              event: prefs.event || 'tet',
              region: prefs.region || 'bac-bo',
              style: prefs.style || 'toi-gian',
              remixLevel: prefs.remixLevel,
              accessories: prefs.accessories,
              accessoryVariants: prefs.accessoryVariants,
            });
            const harmony = calculateColorHarmony(prefs.colors);

            return (
              <div className="studio-stage-grid" style={{ alignItems: 'start', gap: 'var(--space-8)' }}>
                {/* LEFT: Master Visual Stage */}
                <div>
                  <div style={{
                    background: 'linear-gradient(180deg, #FFFEFB 0%, #FAF5EC 100%)',
                    border: '2.5px solid var(--color-gold)',
                    borderRadius: 'var(--radius-2xl)',
                    padding: 'var(--space-4)',
                    boxShadow: '0 12px 36px rgba(197, 151, 44, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Inner dashed border */}
                    <div style={{
                      position: 'absolute', inset: '4px',
                      border: '1px solid rgba(197, 151, 44, 0.25)',
                      borderRadius: 'calc(var(--radius-2xl) - 4px)',
                      pointerEvents: 'none',
                    }} />

                    {/* Corner Ornaments */}
                    <HeritageOrnament variant="corner" size={40} style={{ position: 'absolute', top: 6, left: 6, zIndex: 3 }} />
                    <HeritageOrnament variant="corner" size={40} style={{ position: 'absolute', top: 6, right: 6, zIndex: 3, transform: 'rotate(90deg)' }} />

                    {/* Level Badge */}
                    <div style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', zIndex: 4 }}>
                      <RemixTapeBadge level={prefs.remixLevel} label={remixLabel} width={140} />
                    </div>

                    <div style={{
                      background: 'linear-gradient(180deg, #FBF8F2 0%, #F5EDE0 100%)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--space-6) 0',
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'relative',
                      minHeight: 380,
                    }}>
                      <OutfitVisualization
                        garment={prefs.garment || 'ao-dai'}
                        character={prefs.character || DEFAULT_CHARACTER_ID}
                        accessoryVariants={prefs.accessoryVariants || []}
                        primaryColor={prefs.colors[0] || 'ivory'}
                        secondaryColor={prefs.colors[1] || 'burgundy'}
                        remixLevel={prefs.remixLevel}
                        event={prefs.event}
                        size="md"
                      />
                    </div>
                  </div>

                  {/* Selected Silk Swatches Strip */}
                  {prefs.colors.length > 0 && (
                    <div style={{
                      marginTop: 'var(--space-4)',
                    }}>
                      <div className="silk-palette-display" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <span className="caption" style={{ fontWeight: 700, color: 'var(--color-crimson)' }}>
                          Sắc lụa phối:
                        </span>
                        <div className="flex gap-2">
                          {prefs.colors.map(colorId => {
                            const color = colorOptions.find(c => c.id === colorId);
                            return color && (
                              <div
                                key={colorId}
                                style={{
                                  width: 26, height: 26,
                                  borderRadius: '50%',
                                  background: color.hex,
                                  border: '2px solid var(--color-gold)',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                }}
                                title={color.name}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT: Imperial Workbench */}
                <div>
                  <div className="imperial-workbench">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div style={{
                          width: 40, height: 40,
                          background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '20px',
                          color: 'var(--color-white)',
                          boxShadow: '0 3px 8px rgba(197, 151, 44, 0.35)',
                          border: '2px solid var(--color-gold-dark)',
                        }}>
                          ⚖️
                        </div>
                        <div>
                          <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 700,
                            color: 'var(--color-crimson)',
                            display: 'block',
                          }}>
                            Thước Đo Cách Tân
                          </span>
                          <span className="caption" style={{ color: 'var(--color-ink-tertiary)' }}>
                            Kéo để cân bằng giữa gìn giữ di sản và hơi thở mới
                          </span>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, rgba(197, 151, 44, 0.15) 0%, rgba(197, 151, 44, 0.05) 100%)',
                        border: '1.5px solid var(--color-gold)',
                        color: 'var(--color-crimson)',
                        padding: '4px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--font-display)',
                      }}>
                        {prefs.remixLevel}%
                      </span>
                    </div>

                    {/* Track */}
                    <div className="remixtape-track-wrapper" style={{ margin: 'var(--space-4) 0' }}>
                      <div className="remixtape-segments">
                        <div className="remixtape-seg seg-orig" title="Nguyên bản (0–33%)" />
                        <div className="remixtape-seg seg-mod" title="Cách tân (34–66%)" />
                        <div className="remixtape-seg seg-remix" title="Remix mạnh (67–100%)" />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={prefs.remixLevel}
                        onChange={(e) => setPrefs(p => ({ ...p, remixLevel: parseInt(e.target.value) }))}
                        className="remix-slider"
                        aria-label={`Mức Remix: ${prefs.remixLevel}%`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={prefs.remixLevel}
                        aria-valuetext={`${remixLabel}, ${prefs.remixLevel}%`}
                      />
                    </div>

                    {/* Zone Selector Buttons */}
                    <div className="flex justify-between gap-2" style={{ marginTop: 'var(--space-3)' }}>
                      {[
                        { label: 'Nguyên bản', range: '0–33%', isActive: prefs.remixLevel <= 33, onClick: () => setPrefs(p => ({ ...p, remixLevel: 20 })), color: 'var(--color-jade, #2E6B56)' },
                        { label: 'Cách tân', range: '34–66%', isActive: prefs.remixLevel > 33 && prefs.remixLevel <= 66, onClick: () => setPrefs(p => ({ ...p, remixLevel: 50 })), color: 'var(--color-gold-dark, #A07818)' },
                        { label: 'Remix mạnh', range: '67–100%', isActive: prefs.remixLevel > 66, onClick: () => setPrefs(p => ({ ...p, remixLevel: 80 })), color: 'var(--color-crimson, #8B1A1A)' },
                      ].map((zone) => (
                        <button
                          key={zone.label}
                          type="button"
                          onClick={zone.onClick}
                          className={`remix-zone-btn ${zone.isActive ? 'active' : ''}`}
                          style={{
                            borderColor: zone.isActive ? zone.color : undefined,
                          }}
                        >
                          <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: zone.isActive ? zone.color : 'var(--color-ink)' }}>
                            {zone.label}
                          </span>
                          <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-ink-tertiary)' }}>
                            {zone.range}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Cultural Interpretation Message */}
                    <div style={{
                      marginTop: 'var(--space-4)',
                      padding: 'var(--space-4)',
                      background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF5EC 100%)',
                      borderRadius: 'var(--radius-lg)',
                      borderLeft: `4px solid ${prefs.remixLevel <= 33 ? 'var(--color-jade, #2E6B56)' : prefs.remixLevel <= 66 ? 'var(--color-gold)' : 'var(--color-crimson)'}`,
                      border: `1px solid ${prefs.remixLevel <= 33 ? 'rgba(46, 107, 86, 0.2)' : prefs.remixLevel <= 66 ? 'rgba(197, 151, 44, 0.2)' : 'rgba(139, 26, 26, 0.2)'}`,
                      borderLeftWidth: '4px',
                    }}>
                      <p className="body-sm" style={{ margin: 0, lineHeight: 1.5 }}>
                        {prefs.remixLevel <= 33
                          ? 'Bảo lưu phom dáng chuẩn mực, giữ trọn silhouette và thành phần cổ điển.'
                          : prefs.remixLevel <= 66
                          ? 'Duy trì cấu trúc di sản then chốt, dung hòa màu sắc và chi tiết linh hoạt theo thời đại.'
                          : 'Sáng tạo đột phá dựa trên cảm hứng cổ truyền, phối hòa phong cách đương đại.'}
                      </p>
                    </div>

                    {/* Cultural Validation Oracle */}
                    <div className={`cultural-oracle ${culturalContext.status}`} style={{ marginTop: 'var(--space-4)' }}>
                      {culturalContext.status === 'green' ? (
                        <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      ) : (
                        <AlertCircle size={18} style={{ color: culturalContext.status === 'red' ? 'var(--color-error)' : 'var(--color-warning)', flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink)' }}>
                        {culturalContext.message}
                      </span>
                    </div>

                    {/* Harmony Gauge */}
                    <div className="harmony-gauge">
                      <span className="caption" style={{ color: 'var(--color-ink-secondary)' }}>
                        Độ hòa hợp sắc lụa:
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="harmony-bar">
                          <div className="fill" style={{ width: `${harmony.score}%` }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-crimson)', fontFamily: 'var(--font-display)' }}>
                          {harmony.score}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── STEP NAVIGATION DOCK ── */}
        <div className="step-nav-dock">
          <button
            onClick={handleBack}
            className="btn btn-secondary"
            disabled={step === 1}
            style={{
              borderRadius: 'var(--radius-full)',
              borderColor: 'var(--color-gold)',
            }}
          >
            <ArrowLeft size={16} />
            Bước trước
          </button>

          <button
            onClick={handleNext}
            className="btn btn-primary btn-lg"
            disabled={!canContinue()}
            style={{
              borderRadius: 'var(--radius-full)',
              padding: 'var(--space-3) var(--space-8)',
              boxShadow: '0 6px 18px rgba(139, 26, 26, 0.3)',
              background: 'linear-gradient(135deg, #8B1A1A 0%, #C2272D 100%)',
              border: '1.5px solid var(--color-gold)',
            }}
          >
            {step === TOTAL_STEPS ? (
              <>
                <Wand2 size={18} />
                Hoàn tất & Khởi tạo Bản Phối
              </>
            ) : (
              'Tiếp theo →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemixStudioPage;
