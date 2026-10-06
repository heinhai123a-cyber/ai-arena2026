import React from 'react';
import { Link } from 'react-router-dom';
import { HeritageOrnament } from '../components/heritage/HeritageOrnament';
import { LotusLogo } from '../components/LotusLogo';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { Home, Compass } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  useDocumentTitle('404 — Lạc Bước');

  return (
    <div className="page" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: 'var(--space-8) 0',
    }}>
      <div className="text-center animate-fadeInUp" style={{
        background: 'var(--color-white)',
        border: '2px solid var(--color-gold)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-12) var(--space-8)',
        maxWidth: 520,
        width: '90%',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
      }}>
        {/* Corner Ornaments */}
        <HeritageOrnament variant="corner" size={40} style={{ position: 'absolute', top: 6, left: 6 }} />
        <HeritageOrnament variant="corner" size={40} style={{ position: 'absolute', top: 6, right: 6, transform: 'rotate(90deg)' }} />
        <HeritageOrnament variant="corner" size={40} style={{ position: 'absolute', bottom: 6, right: 6, transform: 'rotate(180deg)' }} />
        <HeritageOrnament variant="corner" size={40} style={{ position: 'absolute', bottom: 6, left: 6, transform: 'rotate(270deg)' }} />

        <div style={{ marginBottom: 'var(--space-2)' }}>
          <LotusLogo size={52} />
        </div>

        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(64px, 12vw, 96px)',
          fontWeight: 700,
          color: 'var(--color-crimson)',
          lineHeight: 1,
          margin: '0 0 var(--space-2) 0',
          textShadow: '0 2px 10px rgba(139, 26, 26, 0.15)',
        }}>
          404
        </p>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          color: 'var(--color-crimson)',
          marginBottom: 'var(--space-3)',
        }}>
          Lạc Bước Chốn Điển Cố
        </h1>

        <p className="body-sm text-muted mb-8" style={{ maxWidth: 380, margin: '0 auto var(--space-8)', lineHeight: 'var(--leading-relaxed)' }}>
          Trang bạn đang tìm kiếm không tồn tại trong kho lưu trữ hoặc lối đi đã thay đổi. Xin mời quay về chính điện hoặc tiếp tục khám phá kho tàng di sản.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: 'var(--space-3) var(--space-6)' }}>
            <Home size={16} />
            Về Trang Chủ
          </Link>
          <Link to="/explore" className="btn btn-secondary" style={{ borderRadius: 'var(--radius-full)', padding: 'var(--space-3) var(--space-6)' }}>
            <Compass size={16} />
            Khám Phá Việt Phục
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
