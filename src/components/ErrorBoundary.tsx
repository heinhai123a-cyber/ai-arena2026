import React, { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
          <div style={{ textAlign: 'center', maxWidth: 440 }}>
            <p style={{
              fontSize: '3rem',
              marginBottom: '1rem',
            }}>
              😔
            </p>
            <h2 style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}>
              Chưa thể hiển thị lúc này
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-ink-tertiary)',
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}>
              Đã có lỗi xảy ra. Thử tải lại trang hoặc quay về trang chủ.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="btn btn-primary"
              >
                Tải lại
              </button>
              <Link to="/" className="btn btn-secondary" onClick={() => this.setState({ hasError: false, error: null })}>
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
