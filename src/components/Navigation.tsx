import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bookmark, Search } from 'lucide-react';
import { getLookbook } from '../lib/storage';
import { LotusLogo } from './LotusLogo';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(() => getLookbook().length);

  const updateCount = useCallback(() => {
    setSavedCount(getLookbook().length);
  }, []);

  useEffect(() => {
    // Listen for storage events (other tabs) and custom events
    window.addEventListener('storage', updateCount);
    window.addEventListener('lookbook-updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('lookbook-updated', updateCount);
    };
  }, [updateCount]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/explore', label: 'Khám phá' },
    { path: '/remix', label: 'Remix Studio' },
    { path: '/ai-try-on', label: 'Thử đồ AI' },
    { path: '/culture', label: 'Chuyện chiếc áo' },
    { path: '/lookbook', label: 'Lookbook' },
    { path: '/sources', label: 'Nguồn tham khảo' },
  ];

  return (
    <nav className="nav" role="navigation" aria-label="Điều hướng chính">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="Trang chủ Việt Phục Remix" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <LotusLogo size={28} />
          <span style={{ letterSpacing: '0.04em' }}>Việt Phục Remix</span>
        </Link>

        <div className="nav-links">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <Link
            to="/explore"
            className="btn btn-icon btn-ghost"
            aria-label="Tìm kiếm"
            title="Tìm kiếm"
          >
            <Search size={18} />
          </Link>
          <Link
            to="/lookbook"
            className="btn btn-icon btn-ghost"
            aria-label={`Lookbook (${savedCount} outfit đã lưu)`}
            title="Lookbook"
            style={{ position: 'relative' }}
          >
            <Bookmark size={18} />
            {savedCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 17,
                height: 17,
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-gold)',
                color: 'var(--color-crimson)',
                fontSize: '10px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeInUp 300ms ease-out both',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              }}>
                {savedCount}
              </span>
            )}
          </Link>

          <button
            className="btn btn-icon nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`} role="dialog" aria-label="Menu điều hướng">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
