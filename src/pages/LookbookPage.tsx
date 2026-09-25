import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Copy, ArrowRight, Bookmark } from 'lucide-react';
import { getLookbook, removeLook, duplicateLook, saveLook } from '../lib/storage';
import { OutfitMiniVis } from '../components/OutfitVisualization';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { LookbookEntry, ColorId } from '../types';

const LookbookPage: React.FC = () => {
  useDocumentTitle('Lookbook');
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
      showToast('Lookbook đã đầy (12 outfit). Xóa một outfit để nhân bản.');
      return;
    }
    refresh();
    window.dispatchEvent(new CustomEvent('lookbook-updated'));
    showToast('Đã tạo bản sao');
  };

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="page">
        <div className="container text-center" style={{ padding: 'var(--space-20) 0' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-burgundy-muted)',
            color: 'var(--color-burgundy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-6)',
          }}>
            <Bookmark size={32} />
          </div>
          <h1 className="display-md mb-3">Lookbook của bạn đang trống.</h1>
          <p className="body-lg text-muted mb-8" style={{ maxWidth: 400, margin: '0 auto var(--space-8)' }}>
            Remix một outfit đầu tiên và lưu vào đây.
          </p>
          <Link to="/remix" className="btn btn-primary btn-lg">
            Bắt đầu remix
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header animate-fadeInUp">
          <span className="label mb-3" style={{ display: 'block', color: 'var(--color-tape-dark)' }}>
            Lookbook
          </span>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="display-lg mb-2">Lookbook</h1>
              <p className="text-muted">{entries.length} outfit đã lưu</p>
            </div>
            <Link to="/remix" className="btn btn-primary">
              Tạo outfit mới
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="lookbook-grid">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className={`card animate-fadeInUp stagger-${(i % 6) + 1}`}
              style={{ position: 'relative' }}
            >
              {/* Visual */}
              <div
                style={{
                  aspectRatio: '3/4',
                  background: 'var(--color-paper-soft)',
                  padding: 'var(--space-4)',
                  cursor: 'pointer',
                  position: 'relative',
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
                {/* Remix label */}
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-3)',
                  right: 'var(--space-3)',
                }}>
                  <span className={`badge ${entry.outfit.remixLabel === 'Nguyên bản' ? 'badge-green' : entry.outfit.remixLabel === 'Cách tân' ? 'badge-gold' : 'badge-burgundy'}`}>
                    {entry.outfit.remixLabel}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="card-body">
                <h3 className="heading-sm mb-2">{entry.outfit.title}</h3>
                <div className="flex gap-2 flex-wrap mb-3">
                  {entry.outfit.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                {/* Palette */}
                <div className="flex items-center gap-2 mb-3">
                  {entry.outfit.palette.map(color => (
                    <div
                      key={color.name}
                      className="palette-swatch"
                      style={{ background: color.hex, width: 24, height: 24 }}
                      title={color.name}
                    />
                  ))}
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDuplicate(entry.id); }}
                    className="btn btn-ghost btn-sm"
                    aria-label={`Nhân bản ${entry.outfit.title}`}
                    title="Nhân bản"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(entry.id); }}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--color-error)' }}
                    aria-label={`Xóa ${entry.outfit.title}`}
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {entry.note && (
                  <p className="caption" style={{ marginTop: 'var(--space-2)', fontStyle: 'italic' }}>{entry.note}</p>
                )}
                <p className="caption" style={{ marginTop: 'var(--space-2)' }}>
                  Lưu lúc {new Date(entry.savedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {deletedItem ? (
        <div className="toast" role="alert" aria-live="polite" aria-atomic="true" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span>Đã xóa &ldquo;{deletedItem.entry.outfit.title}&rdquo;</span>
          <button
            onClick={handleUndo}
            className="btn btn-sm"
            style={{
              background: 'var(--color-tape)',
              color: 'var(--color-ink)',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: 700,
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
