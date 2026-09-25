import React, { useState, useMemo } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { Bookmark, BookOpen, ArrowLeft, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Share2, Download, X } from 'lucide-react';
import { generateOutfit } from '../lib/remixEngine';
import { calculateColorHarmony } from '../lib/colorHarmony';
import { saveLook, getLook } from '../lib/storage';
import { garments } from '../content/garments';
import { OutfitVisualization } from '../components/OutfitVisualization';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { RemixPreferences, GarmentId, EventId, RegionId, StyleId, ColorId, AccessoryId, OutfitResult } from '../types';

const ResultPage: React.FC = () => {
  useDocumentTitle('Kết quả outfit');
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
        event: savedLook.outfit.outfit.event,
        region: savedLook.outfit.outfit.region,
        style: savedLook.outfit.outfit.style,
        colors: (savedLook.outfit.palette.map(p => p.name.toLowerCase().replace(' ', '-')) as ColorId[]),
        accessories: [],
        remixLevel: savedLook.outfit.remixLevel,
      };
    }
    return {
      garment: (searchParams.get('garment') as GarmentId) || 'ao-dai',
      event: (searchParams.get('event') as EventId) || 'tet',
      region: (searchParams.get('region') as RegionId) || 'bac-bo',
      style: (searchParams.get('style') as StyleId) || 'toi-gian',
      colors: (searchParams.get('colors')?.split(',').filter(Boolean) as ColorId[]) || ['ivory', 'burgundy'],
      accessories: (searchParams.get('accessories')?.split(',').filter(Boolean) as AccessoryId[]) || [],
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
    // Phase 5 §35: block save when cultural status is RED + Nguyên bản
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
    showToast('Đã lưu vào Lookbook ✓');
    window.dispatchEvent(new CustomEvent('lookbook-updated'));
  };

  const handleOpenExport = () => {
    // §35 EXPORT LABEL SAFETY: Block export if RED + Nguyên bản
    if (outfit.culturalContext.status === 'red' && outfit.remixLabel === 'Nguyên bản') {
      showToast('Không thể xuất thẻ với nhãn "Nguyên bản" khi có cảnh báo đỏ. Hãy đổi mức Remix hoặc sửa phối đồ.');
      return;
    }
    setShowExportModal(true);
  };

  // Cultural traffic light handler
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

  // Section 43: INVALID LOOKBOOK ID safe error / empty state
  if (outfitId && !savedLook) {
    return (
      <div className="page">
        <div className="container text-center" style={{ padding: 'var(--space-20) 0' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-paper)',
            color: 'var(--color-ink-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-6)',
          }}>
            <AlertCircle size={32} />
          </div>
          <h1 className="display-md mb-3">Không tìm thấy outfit</h1>
          <p className="body-lg text-muted mb-8" style={{ maxWidth: 460, margin: '0 auto var(--space-8)' }}>
            Outfit với mã định danh &ldquo;{outfitId}&rdquo; không tồn tại hoặc đã bị xóa khỏi Lookbook.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/studio" className="btn btn-primary btn-lg">
              Tạo outfit mới tại Studio
            </Link>
            <Link to="/lookbook" className="btn btn-secondary btn-lg">
              Về Lookbook
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    green: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', icon: <CheckCircle size={16} />, label: 'Phù hợp' },
    yellow: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', icon: <AlertCircle size={16} />, label: 'Cần cân nhắc' },
    red: { bg: 'var(--color-error-bg)', color: 'var(--color-error)', icon: <AlertCircle size={16} />, label: 'Cần xem xét' },
    unknown: { bg: 'var(--color-silver-light)', color: 'var(--color-ink-tertiary)', icon: <AlertCircle size={16} />, label: 'Chưa xác định' },
  };

  const status = statusConfig[outfit.culturalContext.status];

  return (
    <div className="page">
      <div className="container">
        {/* Back */}
        <button onClick={() => navigate('/remix')} className="btn btn-ghost mb-6">
          <ArrowLeft size={16} /> Remix lại
        </button>

        {/* Main Result */}
        <div className="two-col animate-fadeInUp">
          {/* LEFT: Visual — dominant */}
          <div>
            <div style={{
              background: 'var(--color-cream)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-8)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid var(--color-silver-light)',
            }}>
              {/* Remix label badge */}
              <div style={{
                position: 'absolute',
                top: 'var(--space-4)',
                right: 'var(--space-4)',
                zIndex: 2,
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: outfit.remixLabel === 'Nguyên bản' ? 'var(--color-success-bg)' : outfit.remixLabel === 'Cách tân' ? 'var(--color-tape-muted)' : 'var(--color-vermillion-muted)',
                  color: outfit.remixLabel === 'Nguyên bản' ? 'var(--color-success)' : outfit.remixLabel === 'Cách tân' ? 'var(--color-tape-dark)' : 'var(--color-vermillion)',
                }}>
                  {outfit.remixLabel}
                </span>
              </div>

              <OutfitVisualization
                garment={prefs.garment || 'ao-dai'}
                primaryColor={prefs.colors[0] || 'ivory'}
                secondaryColor={prefs.colors[1] || 'burgundy'}
                remixLevel={prefs.remixLevel}
                size="lg"
              />
            </div>

            {/* Palette — fabric swatch display */}
            <div style={{
              marginTop: 'var(--space-5)',
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-5)',
              border: '1px solid var(--color-silver-light)',
            }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-ink-tertiary)',
                letterSpacing: 'var(--tracking-wide)',
                display: 'block',
                marginBottom: 'var(--space-3)',
              }}>Bảng màu</span>
              <div className="flex items-center gap-4">
                {outfit.palette.map(color => (
                  <div key={color.name} className="flex items-center gap-2">
                    <div style={{
                      width: 40,
                      height: 40,
                      background: color.hex,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: 'var(--shadow-sm)',
                    }} />
                    <div>
                      <p style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{color.name}</p>
                      <p className="caption">{color.role === 'primary' ? 'Chủ đạo' : color.role === 'secondary' ? 'Phụ' : 'Điểm nhấn'}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Color Harmony */}
              <div style={{
                marginTop: 'var(--space-4)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px dashed var(--color-silver-light)',
              }}>
                <div className="flex items-center justify-between">
                  <span className="body-sm text-muted">Hài hòa màu sắc</span>
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: 80,
                      height: 4,
                      background: 'var(--color-silver-light)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${harmony.score}%`,
                        height: '100%',
                        background: harmony.score >= 60 ? 'var(--color-success)' : 'var(--color-warning)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width var(--transition-slow)',
                      }} />
                    </div>
                    <span className="caption">{harmony.score}/100</span>
                  </div>
                </div>
                <p className="caption" style={{ marginTop: 'var(--space-1)' }}>{harmony.description}</p>
                {/* Phase 5 §27: color score is aesthetic only, not cultural */}
                <p className="caption" style={{ marginTop: 'var(--space-2)', fontStyle: 'italic', color: 'var(--color-ink-tertiary)' }}>
                  Điểm này là gợi ý về thẩm mỹ, không phải đúng sai về văn hóa.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Information */}
          <div>
            <h1 className="display-lg mb-3" style={{ letterSpacing: 'var(--tracking-tight)' }}>{outfit.title}</h1>
            <div className="flex gap-2 flex-wrap mb-6">
              {outfit.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            {/* Item Breakdown — compact rows */}
            <div className="mb-8">
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-ink-tertiary)',
                letterSpacing: 'var(--tracking-wide)',
                display: 'block',
                marginBottom: 'var(--space-4)',
              }}>Thành phần</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {outfit.items.map((item, i) => (
                  <div key={i} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-white)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-silver-light)',
                  }}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{item.name}</span>
                      <span className="caption">{
                        item.category === 'garment' ? 'Trang phục' :
                        item.category === 'bottom' ? 'Quần / Váy' :
                        item.category === 'footwear' ? 'Giày dép' :
                        item.category === 'bag' ? 'Túi' :
                        item.category === 'headwear' ? 'Đội đầu' : 'Phụ kiện'
                      }</span>
                    </div>
                    <p className="caption">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cultural Traffic Light — studio annotation */}
            <div className="mb-6">
              <div className={`traffic-light ${outfit.culturalContext.status}`}>
                <span className="traffic-dot" />
                {status.icon}
                <span style={{ fontWeight: 500 }}>{outfit.culturalContext.message}</span>
              </div>

              {outfit.culturalContext.reasons.length > 0 && (
                <div style={{
                  marginTop: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  background: status.bg,
                  borderRadius: 'var(--radius-md)',
                }}>
                  {outfit.culturalContext.reasons.map((reason, i) => (
                    <div key={i} style={{ marginBottom: i < outfit.culturalContext.reasons.length - 1 ? 'var(--space-4)' : 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
                        {reason.what}
                      </p>
                      <p className="body-sm" style={{ marginBottom: 'var(--space-2)' }}>{reason.why}</p>
                      {reason.howToFix && (
                        <button
                          onClick={() => handleFixSuggestion(reason.howToFix)}
                          className="btn btn-sm"
                          style={{
                            background: 'var(--color-white)',
                            color: status.color,
                            border: `1px solid ${status.color}`,
                          }}
                        >
                          Sửa giúp mình
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Why This Look */}
            <div className="mb-6">
              <button
                onClick={() => setShowWhyThisLook(!showWhyThisLook)}
                className="btn btn-ghost w-full"
                style={{
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-silver-light)',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Vì sao bộ này được gợi ý?
                </span>
                {showWhyThisLook ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showWhyThisLook && (
                <div className="animate-fadeIn" style={{
                  padding: 'var(--space-5)',
                  background: 'var(--color-white)',
                  borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                  borderTop: '1px dashed var(--color-silver-light)',
                  border: '1px solid var(--color-silver-light)',
                  borderTopWidth: 0,
                }}>
                  <p className="body-sm" style={{ lineHeight: 'var(--leading-relaxed)' }}>
                    {outfit.stylingReason}
                  </p>
                  <p className="caption" style={{ marginTop: 'var(--space-3)', fontStyle: 'italic' }}>
                    Đây là gợi ý dựa trên logic phối đồ của hệ thống, không phải quy tắc bắt buộc.
                  </p>
                </div>
              )}
            </div>

            {/* Chuyện chiếc áo */}
            <div className="mb-8">
              <button
                onClick={() => setShowCulturalDetail(!showCulturalDetail)}
                className="btn btn-ghost w-full"
                style={{
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-silver-light)',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Chuyện chiếc áo — {garment?.name}
                </span>
                {showCulturalDetail ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showCulturalDetail && garment && (
                <div className="animate-fadeIn story-card" style={{ borderRadius: '0 0 var(--radius-md) var(--radius-md)', borderTop: 'none' }}>
                  <div className="story-card-body">
                    <div className="story-card-section">
                      <p className="story-card-section-title">Bối cảnh</p>
                      <p className="body-sm">{garment.culturalNote.context}</p>
                    </div>
                    <div className="story-card-section">
                      <p className="story-card-section-title">Đặc điểm</p>
                      <p className="body-sm">{garment.culturalNote.characteristics}</p>
                    </div>
                    <div className="story-card-section">
                      <p className="story-card-section-title">Ngữ cảnh sử dụng</p>
                      <p className="body-sm">{garment.culturalNote.usage}</p>
                    </div>
                    <div className="story-card-section">
                      <p className="story-card-section-title">Lưu ý khi remix</p>
                      <p className="body-sm">{garment.culturalNote.remixAdvice}</p>
                    </div>
                  </div>
                  <div className="story-card-footer">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-yellow" style={{ fontSize: '10px' }}>Bản nháp — chờ thẩm định</span>
                      <Link to={`/garments/${garment.id}`} className="btn btn-ghost btn-sm">Đọc đầy đủ</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleSave}
                className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
                disabled={saved}
                title={outfit.culturalContext.status === 'red' && outfit.remixLabel === 'Nguyên bản'
                  ? 'Không thể lưu Nguyên bản khi có cảnh báo đỏ'
                  : undefined}
              >
                <Bookmark size={16} />
                {saved ? 'Đã lưu' : 'Lưu vào Lookbook'}
              </button>
              <Link to="/lookbook" className="btn btn-secondary">
                <BookOpen size={16} />
                Xem Lookbook
              </Link>
              <button
                onClick={handleOpenExport}
                className="btn btn-secondary"
                aria-label="Xuất thẻ outfit"
                title="Xuất thẻ outfit"
              >
                <Download size={16} />
                Xuất thẻ
              </button>
              <button
                onClick={() => {
                  const url = window.location.href;
                  if (navigator.share) {
                    navigator.share({ title: outfit.title, url }).catch(() => {
                      // Fallback to clipboard
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(url).then(() => showToast('Đã sao chép link ✓'));
                      } else {
                        showToast('Không thể chia sẻ — thử sao chép URL từ thanh địa chỉ.');
                      }
                    });
                  } else if (navigator.clipboard?.writeText) {
                    navigator.clipboard.writeText(url).then(() => showToast('Đã sao chép link ✓'));
                  } else {
                    showToast('Không thể chia sẻ — thử sao chép URL từ thanh địa chỉ.');
                  }
                }}
                className="btn btn-secondary"
              >
                <Share2 size={16} />
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Card Modal (§33, §34, §35, §36, §37) */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xuất thẻ outfit"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(29, 47, 74, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 'var(--space-4)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowExportModal(false);
          }}
        >
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 480,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'var(--space-6)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              position: 'relative',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="heading-md">Xuất thẻ outfit</h3>
                <p className="caption text-muted">Chọn tỷ lệ thẻ và in hoặc tải về</p>
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
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                className={`btn btn-sm ${exportRatio === '4:5' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setExportRatio('4:5')}
              >
                4:5 (1080×1350)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${exportRatio === '9:16' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setExportRatio('9:16')}
              >
                9:16 (1080×1920)
              </button>
            </div>

            {/* Printable Card Frame */}
            <div
              id="exportable-outfit-card"
              className="export-card-frame"
              style={{
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-6)',
                aspectRatio: exportRatio === '4:5' ? '4/5' : '9/16',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Corner Tailor Crop Marks */}
              <span className="tailor-crop-mark tl" aria-hidden="true">+</span>
              <span className="tailor-crop-mark tr" aria-hidden="true">+</span>
              <span className="tailor-crop-mark bl" aria-hidden="true">+</span>
              <span className="tailor-crop-mark br" aria-hidden="true">+</span>

              {/* Faint Giấy Dó / Cutting Table Watermark Pattern */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.035 }} aria-hidden="true">
                <pattern id="giay-do-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 20 L 40 20 M 20 0 L 20 40" stroke="var(--color-ink)" strokeWidth="0.5" strokeDasharray="2,6" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#giay-do-pattern)" />
              </svg>

              {/* Header */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-tape-dark)', textTransform: 'uppercase' }}>
                      Việt Phục Remix · Lookbook Việt phục
                    </span>
                    <h4 className="heading-sm" style={{ color: 'var(--color-ink)', marginTop: 2 }}>{outfit.title}</h4>
                  </div>
                  {/* §36 Hang tag: Bản nháp */}
                  <span className="badge badge-draft" style={{ fontSize: '9px' }}>
                    Bản nháp
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="tag" style={{ fontSize: '10px' }}>{outfit.outfit.regionName}</span>
                  <span className="tag" style={{ fontSize: '10px' }}>{outfit.outfit.eventName}</span>
                  <span className="tag" style={{ fontSize: '10px' }}>{outfit.outfit.styleName}</span>
                  <span className={`badge ${outfit.remixLabel === 'Nguyên bản' ? 'badge-green' : outfit.remixLabel === 'Cách tân' ? 'badge-gold' : 'badge-burgundy'}`} style={{ fontSize: '10px' }}>
                    {outfit.remixLabel} ({outfit.remixLevel}%)
                  </span>
                </div>
              </div>

              {/* Character Visual */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--space-2) 0' }}>
                <OutfitVisualization
                  garment={prefs.garment || 'ao-dai'}
                  primaryColor={prefs.colors[0] || 'ivory'}
                  secondaryColor={prefs.colors[1] || 'burgundy'}
                  remixLevel={prefs.remixLevel}
                  size="sm"
                />
              </div>

              {/* Swatches & Items */}
              <div>
                {/* Palette */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="caption" style={{ fontWeight: 600 }}>Bảng màu:</span>
                  {outfit.palette.map(c => (
                    <div
                      key={c.name}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        background: c.hex,
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                      title={`${c.name} (${c.hex})`}
                    />
                  ))}
                  <span className="caption text-muted" style={{ marginLeft: 'auto' }}>Hài hòa: {harmony.score}/100</span>
                </div>

                {/* Items (max 6 lines) */}
                <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <p className="caption" style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>Thành phần phối:</p>
                  <ul style={{ fontSize: '11px', lineHeight: 1.4, color: 'var(--color-ink-secondary)', margin: 0, paddingLeft: 14 }}>
                    {outfit.items.slice(0, 6).map((item, idx) => (
                      <li key={idx}><strong>{item.name}</strong>{item.color ? ` (${item.color})` : ''}</li>
                    ))}
                  </ul>
                </div>

                {/* Cultural Reason */}
                {outfit.culturalContext.message && (
                  <p className="caption" style={{ fontSize: '10px', color: 'var(--color-ink-tertiary)', marginBottom: 'var(--space-2)' }}>
                    {outfit.culturalContext.message}
                  </p>
                )}

                {/* §37 Footer status note for Remix */}
                <div style={{ borderTop: '1px dashed var(--color-silver-light)', paddingTop: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', color: 'var(--color-ink-tertiary)', fontStyle: 'italic' }}>
                    {outfit.remixLabel !== 'Nguyên bản'
                      ? 'Bản remix, không phải trang phục nguyên bản'
                      : 'Trang phục nguyên bản theo ngữ cảnh truyền thống'}
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-ink-secondary)' }}>
                    phoiviet.lookbook
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

      {/* Toast — aria-live for accessibility */}
      {toastMessage && (
        <div className="toast" role="alert" aria-live="polite" aria-atomic="true">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ResultPage;
