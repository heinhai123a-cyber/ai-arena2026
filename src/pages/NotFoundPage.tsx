import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const NotFoundPage: React.FC = () => {
  useDocumentTitle('404 — Trang không tồn tại');
  return (
    <div className="page" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <div className="text-center animate-fadeInUp">
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '120px',
          fontWeight: 600,
          color: 'var(--color-warm-gray-lighter)',
          lineHeight: 1,
          marginBottom: 'var(--space-4)',
        }}>
          404
        </p>
        <h1 className="heading-lg mb-3">Trang không tồn tại</h1>
        <p className="body-sm text-muted mb-8" style={{ maxWidth: 360, margin: '0 auto var(--space-8)' }}>
          Có thể đường dẫn đã thay đổi hoặc trang này chưa được tạo.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn btn-primary">Về trang chủ</Link>
          <Link to="/explore" className="btn btn-secondary">Khám phá Việt phục</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
