import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bookmark, Search } from 'lucide-react';
import { getLookbook } from '../lib/storage';

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
    { path: '/culture', label: 'Chuyện chiếc áo' },
    { path: '/lookbook', label: 'Lookbook' },
  ];

  return (
    <nav className="nav" role="navigation" aria-label="Điều hướng chính">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="Trang chủ Việt Phục Remix">
          Việt Phục Remix
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
                top: 2,
                right: 2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'var(--color-tape)',
                color: 'var(--color-ink)',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeInUp 300ms ease-out both',
                boxShadow: '0 1px 4px rgba(29, 47, 74, 0.2)',
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
