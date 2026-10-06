import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Copy, Bookmark, Sparkles, Plus } from 'lucide-react';
import { getLookbook, removeLook, duplicateLook, saveLook } from '../lib/storage';
import { OutfitMiniVis } from '../components/OutfitVisualization';
import { RemixTapeBadge } from '../components/RemixTapeBadge';
import { HeritageOrnament } from '../components/heritage/HeritageOrnament';
import { HeritagePattern } from '../components/heritage/HeritagePattern';
import { LotusLogo } from '../components/LotusLogo';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { LookbookEntry, ColorId } from '../types';

const cardTints = [
  'var(--color-red-soft)',
  'var(--color-gold-soft)',
  'var(--color-jade-soft)',
  'var(--color-indigo-soft)',
  'var(--color-cream-warm)',
  'var(--color-ink-soft)',
];

const LookbookPage: React.FC = () => {
  useDocumentTitle('Tủ Đồ Di Sản — Lookbook');
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LookbookEntry[]>(() => getLookbook());
  const [toastMessage, setToastMessage] = useState('');
  const [deletedItem, setDeletedItem] = useState<{ entry: LookbookEntry; timer: ReturnType<typeof setTimeout> } | null>(null);

  const refresh = useCallback(() => {
    setEntries(getLookbook());
  }, []);

  useEffect(() => {
    window.addEventListener('lookbook-updated', refresh);
    return () => {
      window.removeEventListener('lookbook-updated', refresh);
      if (deletedItem) clearTimeout(deletedItem.timer);
    };
  }, [refresh, deletedItem]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleRemove = (id: string) => {
    const itemToRemove = entries.find(e => e.id === id);
    if (!itemToRemove) return;

    if (deletedItem) {
      clearTimeout(deletedItem.timer);
    }

    removeLook(id);
    refresh();
    window.dispatchEvent(new CustomEvent('lookbook-updated'));

    const timer = setTimeout(() => {
      setDeletedItem(null);
    }, 5000);

    setDeletedItem({ entry: itemToRemove, timer });
  };

  const handleUndo = () => {
    if (!deletedItem) return;
    clearTimeout(deletedItem.timer);
    saveLook(deletedItem.entry.outfit, deletedItem.entry.note);
    setDeletedItem(null);
    refresh();
    window.dispatchEvent(new CustomEvent('lookbook-updated'));
    showToast('Đã khôi phục outfit ✓');
  };

  const handleDuplicate = (id: string) => {
    const result = duplicateLook(id);
    if (result === null) {
      showToast('Tủ đồ đã đầy (12 outfit). Xóa bớt để nhân bản.');
      return;
    }
    refresh();
    window.dispatchEvent(new CustomEvent('lookbook-updated'));
    showToast('Đã nhân bản bản phối ✓');
  };

  return (
    <div className="page" style={{ paddingBottom: 'var(--space-16)' }}>
      {/* ── Imperial Banner Header ── */}
      <section style={{
        background: 'linear-gradient(160deg, #4A0D0D 0%, #7A1414 45%, #5C0F0F 100%)',
        borderBottom: '2px solid var(--color-gold)',
        padding: 'var(--space-10) 0 var(--space-8)',
        marginTop: 'calc(-1 * var(--space-6))',
        position: 'relative',
        overflow: 'hidden',
        color: 'var(--color-white)',
        marginBottom: 'var(--space-8)',
      }}>
        <HeritagePattern opacity={0.04} />
        <HeritageOrnament variant="corner" size={60} style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }} />
        <HeritageOrnament variant="corner" size={60} style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, transform: 'rotate(90deg)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <span style={{
                  display: 'inline-block',
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: 'var(--color-gold)',
                }} />
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold-bright)',
                }}>
                  BỘ SƯU TẬP CỦA BẠN
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                color: 'var(--color-gold-bright)',
                margin: 0,
              }}>
                Tủ Đồ Di Sản
              </h1>

              <p style={{
                fontSize: 'var(--text-base)',
                color: 'rgba(255, 253, 248, 0.85)',
                margin: 'var(--space-2) 0 0 0',
                maxWidth: 520,
              }}>
                Nơi lưu giữ những bản phối Việt phục do bạn tự tay sáng tạo và cân chỉnh.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--color-gold)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 18px',
                color: 'var(--color-gold-bright)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
              }}>
                {entries.length} / 12 bộ y phục
              </div>

              <Link
                to="/remix"
                className="btn btn-primary"
                style={{
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-md)',
                  padding: 'var(--space-2) var(--space-5)',
                }}
              >
                <Plus size={16} />
                Tạo bản phối mới
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Empty State */}
        {entries.length === 0 ? (
          <div className="text-center" style={{ padding: 'var(--space-16) 0' }}>
            <div style={{
              position: 'relative',
              width: 140, height: 160,
              margin: '0 auto var(--space-6)',
              background: 'linear-gradient(180deg, #FFFDF8 0%, #F5EDE0 100%)',
              border: '2px solid var(--color-gold)',
              borderRadius: 'var(--radius-2xl)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
            }}>
              <HeritageOrnament variant="corner" size={30} style={{ position: 'absolute', top: 4, left: 4 }} />
              <HeritageOrnament variant="corner" size={30} style={{ position: 'absolute', top: 4, right: 4, transform: 'rotate(90deg)' }} />
              <LotusLogo size={46} style={{ marginBottom: 'var(--space-2)' }} />
              <Bookmark size={28} style={{ color: 'var(--color-crimson)' }} />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              color: 'var(--color-crimson)',
              marginBottom: 'var(--space-2)',
            }}>
              Rương Di Sản Đang Trống
            </h2>

            <p className="body-lg text-muted mb-8" style={{ maxWidth: 440, margin: '0 auto var(--space-8)' }}>
              Hãy đến Xưởng May Di Sản để remix bản phối đầu tiên và lưu vào bộ sưu tập cá nhân của bạn.
            </p>

            <Link
              to="/remix"
              className="btn btn-primary btn-lg"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-3) var(--space-8)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <Sparkles size={18} />
              Bắt đầu tạo bản phối
            </Link>
          </div>
        ) : (
          /* Cards Grid */
          <div className="lookbook-grid" style={{ gap: 'var(--space-6)' }}>
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                className={`card animate-fadeInUp stagger-${(i % 6) + 1}`}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-2xl)',
                  border: '2px solid var(--color-gold)',
                  boxShadow: 'var(--shadow-md)',
                  background: 'var(--color-white)',
                  overflow: 'hidden',
                  transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                }}
              >
                {/* Corner ornaments */}
                <HeritageOrnament
                  variant="corner"
                  size={32}
                  style={{ position: 'absolute', top: 4, left: 4, zIndex: 4 }}
                />
                <HeritageOrnament
                  variant="corner"
                  size={32}
                  style={{ position: 'absolute', top: 4, right: 4, zIndex: 4, transform: 'rotate(90deg)' }}
                />

                {/* Visual Stage */}
                <div
                  style={{
                    aspectRatio: '3/4',
                    background: cardTints[i % cardTints.length],
                    padding: 'var(--space-4)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set('garment', entry.outfit.outfit.garment);
                    params.set('event', entry.outfit.outfit.event);
                    params.set('region', entry.outfit.outfit.region);
                    params.set('style', entry.outfit.outfit.style);
                    params.set('colors', entry.outfit.palette.map(p => p.name.toLowerCase().replace(' ', '-')).join(','));
                    params.set('remix', entry.outfit.remixLevel.toString());
                    navigate(`/result?${params.toString()}`);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Xem outfit: ${entry.outfit.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const params = new URLSearchParams();
                      params.set('garment', entry.outfit.outfit.garment);
                      params.set('event', entry.outfit.outfit.event);
                      params.set('remix', entry.outfit.remixLevel.toString());
                      navigate(`/result?${params.toString()}`);
                    }
                  }}
                >
                  <OutfitMiniVis
                    garment={entry.outfit.outfit.garment}
                    colors={entry.outfit.palette.slice(0, 2).map(p => p.name.toLowerCase().replace(' ', '-') as ColorId)}
                  />

                  {/* Remix badge */}
                  <div style={{
                    position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)', zIndex: 3,
                  }}>
                    <RemixTapeBadge level={entry.outfit.remixLevel} label={entry.outfit.remixLabel} width={130} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body" style={{ padding: 'var(--space-5)' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-crimson)',
                    marginBottom: 'var(--space-2)',
                  }}>
                    {entry.outfit.title}
                  </h3>

                  <div className="flex gap-2 flex-wrap mb-3">
                    {entry.outfit.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag" style={{ fontSize: '10px', padding: '2px 8px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Palette Swatches */}
                  <div className="flex items-center gap-2 mb-4">
                    {entry.outfit.palette.map(color => (
                      <div
                        key={color.name}
                        className="palette-swatch"
                        style={{
                          background: color.hex,
                          width: 22, height: 22,
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--color-gold)',
                        }}
                        title={color.name}
                      />
                    ))}
                    <span className="caption text-muted" style={{ marginLeft: 'auto', fontSize: '11px' }}>
                      {new Date(entry.savedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between" style={{
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--color-silver-light)',
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const params = new URLSearchParams();
                        params.set('garment', entry.outfit.outfit.garment);
                        params.set('event', entry.outfit.outfit.event);
                        params.set('region', entry.outfit.outfit.region);
                        params.set('style', entry.outfit.outfit.style);
                        params.set('colors', entry.outfit.palette.map(p => p.name.toLowerCase().replace(' ', '-')).join(','));
                        params.set('remix', entry.outfit.remixLevel.toString());
                        navigate(`/result?${params.toString()}`);
                      }}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--color-crimson)', fontWeight: 600, padding: '4px 8px' }}
                    >
                      Chi tiết & Xuất thẻ →
                    </button>

                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDuplicate(entry.id); }}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '6px' }}
                        aria-label={`Nhân bản ${entry.outfit.title}`}
                        title="Nhân bản bản phối"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(entry.id); }}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-error)', padding: '6px' }}
                        aria-label={`Xóa ${entry.outfit.title}`}
                        title="Xóa khỏi tủ đồ"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Undo Toast */}
      {deletedItem ? (
        <div className="toast" role="alert" aria-live="polite" aria-atomic="true" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span>Đã gỡ &ldquo;{deletedItem.entry.outfit.title}&rdquo; khỏi Tủ đồ</span>
          <button
            onClick={handleUndo}
            className="btn btn-sm"
            style={{
              background: 'var(--color-gold)',
              color: 'var(--color-crimson)',
              padding: '2px 10px',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
            }}
          >
            Hoàn tác
          </button>
        </div>
      ) : toastMessage ? (
        <div className="toast" role="alert" aria-live="polite" aria-atomic="true">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
};

export default LookbookPage;
