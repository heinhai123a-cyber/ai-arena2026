import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const SourcesPage: React.FC = () => {
  useDocumentTitle('Nguồn tham khảo');
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 'var(--content-width)', margin: '0 auto' }}>
        <div className="page-header animate-fadeInUp">
          <span className="label mb-3" style={{ display: 'block', color: 'var(--color-tape-dark)' }}>
            Minh bạch
          </span>
          <h1 className="display-lg mb-4">Nguồn tham khảo & Trạng thái nội dung</h1>
        </div>

        {/* Status overview */}
        <div className="animate-fadeInUp stagger-1" style={{
          padding: 'var(--space-6)',
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-8)',
        }}>
          <h2 className="heading-md mb-4">Trạng thái hiện tại</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="flex items-center gap-3">
              <span className="badge badge-yellow">Bản nháp</span>
              <span className="body-sm">Tất cả nội dung văn hóa trong bản demo này</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge badge-yellow">Chưa có nguồn</span>
              <span className="body-sm">Chưa có nguồn chính thức nào được trích dẫn — đang là bản nháp.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge badge-yellow">Chưa thẩm định</span>
              <span className="body-sm">Chưa có chuyên gia thẩm định — toàn bộ nội dung ở trạng thái bản nháp.</span>
            </div>
          </div>
        </div>

        {/* What this means */}
        <div className="animate-fadeInUp stagger-2" style={{
          padding: 'var(--space-6)',
          background: 'var(--color-warning-bg)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-8)',
          border: '1px solid rgba(184, 134, 11, 0.2)',
        }}>
          <h3 className="heading-sm mb-3" style={{ color: 'var(--color-warning)' }}>Điều này nghĩa là gì?</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              'Nội dung được viết dựa trên hiểu biết chung, không phải từ nghiên cứu học thuật.',
              'Không có sách, tác giả, bảo tàng, hay URL nào được trích dẫn vì chưa kiểm chứng.',
              'Tất cả cultural notes đều ở trạng thái "draft" và chưa ai review.',
              'Hướng tra cứu là gợi ý để con người tìm hiểu thêm — không phải trích dẫn.',
              'Đây là bản demo, không phải tài liệu tham khảo chính thức.',
            ].map((text, i) => (
              <li key={i} className="body-sm" style={{
                padding: 'var(--space-2) 0',
                paddingLeft: 'var(--space-4)',
                borderLeft: '2px solid var(--color-warning)',
              }}>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* How to contribute */}
        <div className="animate-fadeInUp stagger-3" style={{
          padding: 'var(--space-6)',
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-8)',
        }}>
          <h2 className="heading-md mb-4">Cần gì để chuyển sang "Đã thẩm định"?</h2>
          <p className="body-sm text-muted mb-4">
            Một cultural note chỉ được đánh dấu "Đã thẩm định" khi đồng thời đáp ứng:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { label: 'status', desc: '"reviewed"' },
              { label: 'reviewedBy', desc: 'Tên người thẩm định (không phải null)' },
              { label: 'reviewedAt', desc: 'Ngày thẩm định (không phải null)' },
              { label: 'sources', desc: 'Ít nhất một nguồn chính thức' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-ivory-warm)',
                borderRadius: 'var(--radius-md)',
              }}>
                <code style={{
                  fontSize: 'var(--text-xs)',
                  background: 'var(--color-cream)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginRight: 'var(--space-2)',
                }}>{item.label}</code>
                <span className="body-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center" style={{ padding: 'var(--space-8) 0' }}>
          <Link to="/culture" className="btn btn-secondary">
            Đọc Chuyện chiếc áo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SourcesPage;
