import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { garments } from '../content/garments';
import { events, styles, colorOptions, accessories } from '../content/catalog';
import { PRESET_MATRIX } from '../content/presets';
import { OutfitVisualization } from '../components/OutfitVisualization';
import type { GarmentId, EventId, StyleId, ColorId, AccessoryId, RemixPreferences } from '../types';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const TOTAL_STEPS = 6;

const RemixStudioPage: React.FC = () => {
  useDocumentTitle('Remix Studio');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  const presetKey = searchParams.get('preset');
  const activePreset = presetKey && PRESET_MATRIX[presetKey] ? PRESET_MATRIX[presetKey] : null;

  // State
  const [step, setStep] = useState(() => (isDemo || activePreset ? 6 : 1));
  const [prefs, setPrefs] = useState<RemixPreferences>(() => {
    if (activePreset) {
      return { ...activePreset.prefs };
    }
    if (isDemo) {
      return {
        garment: 'ao-dai',
        event: 'tet',
        region: 'trung-bo',
        style: 'toi-gian',
        colors: ['ivory', 'burgundy'],
        accessories: ['trang-suc', 'tui'],
        remixLevel: 70,
      };
    }
    const garmentId = (searchParams.get('garment') as GarmentId) || null;
    const garment = garmentId ? garments.find(g => g.id === garmentId) : null;
    return {
      garment: garmentId,
      event: (searchParams.get('event') as EventId) || null,
      region: garment ? garment.region[0] : null,
      style: (searchParams.get('style') as StyleId) || null,
      colors: [],
      accessories: [],
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
    // Simulate processing time for the generating animation
    setTimeout(() => {
      const params = new URLSearchParams();
      params.set('garment', prefs.garment || 'ao-dai');
      params.set('event', prefs.event || 'tet');
      params.set('region', prefs.region || 'bac-bo');
      params.set('style', prefs.style || 'toi-gian');
      params.set('colors', prefs.colors.join(','));
      params.set('accessories', prefs.accessories.join(','));
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
    setPrefs(p => ({
      ...p,
      accessories: p.accessories.includes(id)
        ? p.accessories.filter(a => a !== id)
        : [...p.accessories, id],
    }));
  };

  const remixLabel = prefs.remixLevel <= 33 ? 'Nguyên bản' : prefs.remixLevel <= 66 ? 'Cách tân' : 'Remix mạnh';

  // Generating state
  if (isGenerating) {
    return (
      <div className="page" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
      }}>
        <div className="text-center animate-fadeIn">
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '3px solid var(--color-silver-light)',
            borderTopColor: 'var(--color-ink)',
            margin: '0 auto var(--space-6)',
            animation: 'spin 1s linear infinite',
          }} />
          <p className="heading-md mb-2">Đang kết hợp trang phục...</p>
          <p className="text-muted body-sm">Cân chỉnh phong cách và bối cảnh văn hóa</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const stepTitles = [
    'Bạn muốn mặc gì?',
    'Bạn mặc trong dịp nào?',
    'Vibe của bạn?',
    'Chọn màu sắc',
    'Phụ kiện?',
    'Giữ truyền thống đến đâu?',
  ];

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Progress — measuring tape metaphor */}
        <div className="progress-steps mb-4">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`progress-step ${i + 1 <= step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleBack} className="btn btn-ghost" disabled={step === 1} aria-label="Bước trước">
            <ArrowLeft size={16} />
            Quay lại
          </button>
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--color-ink-tertiary)',
            letterSpacing: 'var(--tracking-wide)',
          }}>Bước {step} / {TOTAL_STEPS}</span>
          <div style={{ width: 100 }} /> {/* Spacer */}
        </div>

        {/* Step Content */}
        <div className="studio-step-pane" key={step}>
          <h1 className="display-md mb-8 text-center">{stepTitles[step - 1]}</h1>

          {/* Step 1: Garment */}
          {step === 1 && (
            <div className="grid-2" style={{ maxWidth: 640, margin: '0 auto' }}>
              {garments.map(g => (
                <button
                  key={g.id}
                  onClick={() => setPrefs(p => ({ ...p, garment: g.id, region: g.region[0] }))}
                  className={`selection-card ${prefs.garment === g.id ? 'selected' : ''}`}
                >
                  <div style={{
                    width: 60,
                    height: 80,
                    marginBottom: 'var(--space-3)',
                    background: 'var(--color-cream)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}>
                    <svg viewBox="0 0 400 560" width="100%" height="100%">
                      <ellipse cx="200" cy="85" rx="25" ry="30" fill="#D4A574" />
                      <rect x="155" y="136" width="90" height="140" rx="3" fill="var(--color-ink)" opacity="0.4" />
                    </svg>
                  </div>
                  <p className="card-title">{g.name}</p>
                  <p className="card-desc">{g.shortDescription.substring(0, 60)}...</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Event */}
          {step === 2 && (
            <div className="grid-3" style={{ maxWidth: 720, margin: '0 auto' }}>
              {events.map(e => (
                <button
                  key={e.id}
                  onClick={() => setPrefs(p => ({ ...p, event: e.id }))}
                  className={`selection-card ${prefs.event === e.id ? 'selected' : ''}`}
                >
                  <div style={{ fontSize: '24px', marginBottom: 'var(--space-2)' }}>{e.icon}</div>
                  <p className="card-title">{e.name}</p>
                  <p className="card-desc">{e.description.substring(0, 50)}...</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Style */}
          {step === 3 && (
            <div className="grid-2" style={{ maxWidth: 560, margin: '0 auto' }}>
              {styles.map(s => (
                <button
                  key={s.id}
                  onClick={() => setPrefs(p => ({ ...p, style: s.id }))}
                  className={`selection-card ${prefs.style === s.id ? 'selected' : ''}`}
                >
                  <p className="card-title">{s.name}</p>
                  <p className="card-desc">{s.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Colors (fabric swatch metaphor) */}
          {step === 4 && (
            <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
              <p className="body-sm text-muted mb-6">Chọn tối đa 3 mẫu vải</p>
              <div className="flex gap-4 justify-center flex-wrap mb-8">
                {colorOptions.map(c => (
                  <div key={c.id} style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => toggleColor(c.id)}
                      className={`color-swatch ${prefs.colors.includes(c.id) ? 'selected' : ''}`}
                      style={{ background: c.hex }}
                      aria-label={`${c.name}: ${c.description}`}
                      title={c.description}
                    >
                      {prefs.colors.includes(c.id) && (
                        <Check size={16} style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: c.id === 'ivory' || c.id === 'cream' || c.id === 'pastel' ? 'var(--color-ink)' : 'var(--color-white)',
                        }} />
                      )}
                    </button>
                    <p className="caption" style={{ marginTop: 'var(--space-2)' }}>{c.name}</p>
                  </div>
                ))}
              </div>
              {prefs.colors.length > 0 && (
                <div className="flex gap-3 justify-center items-center">
                  <span className="body-sm text-muted">Đã chọn:</span>
                  <div className="palette">
                    {prefs.colors.map(colorId => {
                      const color = colorOptions.find(c => c.id === colorId);
                      return color && (
                        <div key={colorId} className="palette-swatch" style={{ background: color.hex }} title={color.name} />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Accessories */}
          {step === 5 && (
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
              <p className="body-sm text-muted mb-6 text-center">Chọn phụ kiện bạn muốn (không bắt buộc)</p>
              <div className="grid-3">
                {accessories.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => toggleAccessory(acc.id)}
                    className={`selection-card ${prefs.accessories.includes(acc.id) ? 'selected' : ''}`}
                    style={{ textAlign: 'center', position: 'relative' }}
                  >
                    {prefs.accessories.includes(acc.id) && (
                      <div style={{
                        position: 'absolute',
                        top: 'var(--space-2)',
                        right: 'var(--space-2)',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'var(--color-ink)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Check size={12} />
                      </div>
                    )}
                    <p className="card-title">{acc.name}</p>
                    <p className="card-desc">{acc.category}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Remix Level — Thước Remix */}
          {step === 6 && (
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              {/* Preview */}
              <div className="flex justify-center mb-8">
                <OutfitVisualization
                  garment={prefs.garment || 'ao-dai'}
                  primaryColor={prefs.colors[0] || 'ivory'}
                  secondaryColor={prefs.colors[1] || 'burgundy'}
                  remixLevel={prefs.remixLevel}
                  size="sm"
                />
              </div>

              {/* Thước Remix — Signature Tailor's Measuring Tape */}
              <div className="remixtape-board">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Tape icon */}
                    <div style={{
                      width: 28,
                      height: 28,
                      background: 'var(--color-tape)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--color-ink)',
                      border: '1px solid rgba(29, 47, 74, 0.15)',
                    }}>R</div>
                    <span className="heading-sm">Thước Remix</span>
                  </div>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: prefs.remixLevel <= 33 ? 'var(--color-success-bg)' : prefs.remixLevel <= 66 ? 'var(--color-tape-muted)' : 'var(--color-vermillion-muted)',
                    color: prefs.remixLevel <= 33 ? 'var(--color-success)' : prefs.remixLevel <= 66 ? 'var(--color-tape-dark)' : 'var(--color-vermillion)',
                    border: `1px solid ${prefs.remixLevel <= 33 ? 'rgba(63, 122, 82, 0.3)' : prefs.remixLevel <= 66 ? 'rgba(242, 194, 48, 0.35)' : 'rgba(214, 64, 47, 0.3)'}`,
                  }}>
                    {remixLabel} ({prefs.remixLevel}%)
                  </span>
                </div>

                {/* Measuring Tape Ticks */}
                <div className="remixtape-ruler" aria-hidden="true">
                  <span className="remixtape-tick major" />
                  <span className="remixtape-tick" />
                  <span className="remixtape-tick" />
                  <span className="remixtape-tick major" />
                  <span className="remixtape-tick" />
                  <span className="remixtape-tick" />
                  <span className="remixtape-tick major" />
                  <span className="remixtape-tick" />
                  <span className="remixtape-tick" />
                  <span className="remixtape-tick major" />
                  <span className="remixtape-tick" />
                  <span className="remixtape-tick" />
                  <span className="remixtape-tick major" />
                  <span className="remixtape-tick" />
                  <span className="remixtape-tick" />
                  <span className="remixtape-tick major" />
                </div>

                {/* Track with solid segments & tailor notches */}
                <div className="remixtape-track-wrapper">
                  <div className="remixtape-segments">
                    <div className="remixtape-seg seg-orig" />
                    <div className="remixtape-seg seg-mod" />
                    <div className="remixtape-seg seg-remix" />
                  </div>
                  <div className="remixtape-notch notch-1" title="Ngưỡng Nguyên bản (33%)" />
                  <div className="remixtape-notch notch-2" title="Ngưỡng Cách tân (66%)" />
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

                {/* Level Selectors */}
                <div className="flex justify-between" style={{ marginTop: 'var(--space-2)' }}>
                  <button
                    type="button"
                    onClick={() => setPrefs(p => ({ ...p, remixLevel: 20 }))}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px 6px',
                      cursor: 'pointer',
                      fontSize: 'var(--text-xs)',
                      fontWeight: prefs.remixLevel <= 33 ? 700 : 400,
                      color: prefs.remixLevel <= 33 ? 'var(--color-success)' : 'var(--color-ink-secondary)',
                      textDecoration: prefs.remixLevel <= 33 ? 'underline' : 'none',
                      textUnderlineOffset: '4px',
                    }}
                  >
                    Nguyên bản (0–33%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefs(p => ({ ...p, remixLevel: 50 }))}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px 6px',
                      cursor: 'pointer',
                      fontSize: 'var(--text-xs)',
                      fontWeight: prefs.remixLevel > 33 && prefs.remixLevel <= 66 ? 700 : 400,
                      color: prefs.remixLevel > 33 && prefs.remixLevel <= 66 ? 'var(--color-tape-dark)' : 'var(--color-ink-secondary)',
                      textDecoration: prefs.remixLevel > 33 && prefs.remixLevel <= 66 ? 'underline' : 'none',
                      textUnderlineOffset: '4px',
                    }}
                  >
                    Cách tân (34–66%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefs(p => ({ ...p, remixLevel: 80 }))}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px 6px',
                      cursor: 'pointer',
                      fontSize: 'var(--text-xs)',
                      fontWeight: prefs.remixLevel > 66 ? 700 : 400,
                      color: prefs.remixLevel > 66 ? 'var(--color-vermillion)' : 'var(--color-ink-secondary)',
                      textDecoration: prefs.remixLevel > 66 ? 'underline' : 'none',
                      textUnderlineOffset: '4px',
                    }}
                  >
                    Remix mạnh (67–100%)
                  </button>
                </div>

                <div style={{
                  marginTop: 'var(--space-4)',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: `3px solid ${prefs.remixLevel <= 33 ? 'var(--color-success)' : prefs.remixLevel <= 66 ? 'var(--color-tape)' : 'var(--color-vermillion)'}`,
                  borderTop: '1px solid var(--color-silver-light)',
                  borderRight: '1px solid var(--color-silver-light)',
                  borderBottom: '1px solid var(--color-silver-light)',
                }}>
                  <p className="body-sm" style={{ margin: 0 }}>
                    {prefs.remixLevel <= 33
                      ? 'Giữ nguyên silhouette và các thành phần chính của trang phục. Phụ kiện truyền thống.'
                      : prefs.remixLevel <= 66
                      ? 'Giữ cấu trúc chính nhưng hiện đại hóa một số thành phần. Phụ kiện linh hoạt hơn.'
                      : 'Nhiều biến đổi hiện đại, giữ yếu tố nhận diện chính. Cho phép phối phụ kiện đương đại.'}
                  </p>
                </div>
              </div>

              {/* Remix DNA */}
              <div style={{
                marginTop: 'var(--space-6)',
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                border: '1px solid var(--color-silver-light)',
              }}>
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-ink-tertiary)',
                  letterSpacing: 'var(--tracking-wide)',
                  display: 'block',
                  marginBottom: 'var(--space-4)',
                }}>Outfit DNA</span>
                {[
                  { label: 'Truyền thống', value: 100 - prefs.remixLevel },
                  { label: 'Hiện đại', value: prefs.remixLevel },
                  { label: 'Tối giản', value: prefs.style === 'toi-gian' ? 80 : prefs.style === 'streetwear' ? 30 : 50 },
                  { label: 'Trang trọng', value: prefs.event === 'tet' || prefs.event === 'le-hoi' ? 75 : 40 },
                ].map(item => (
                  <div key={item.label} className="dna-bar">
                    <span className="dna-label">{item.label}</span>
                    <div className="dna-track">
                      <div className="dna-fill" style={{ width: `${item.value}%` }} />
                      <div className="dna-dot" style={{ left: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{
          position: 'sticky',
          bottom: 0,
          background: 'rgba(233, 238, 242, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: 'var(--space-4) 0',
          borderTop: '1px solid var(--color-silver-light)',
          marginTop: 'var(--space-12)',
          zIndex: 10,
        }}>
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="btn btn-secondary"
              disabled={step === 1}
            >
              <ArrowLeft size={16} />
              Quay lại
            </button>

            <button
              onClick={handleNext}
              className="btn btn-primary"
              disabled={!canContinue()}
            >
              {step === TOTAL_STEPS ? (
                <>
                  Tạo outfit
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Tiếp tục
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemixStudioPage;
