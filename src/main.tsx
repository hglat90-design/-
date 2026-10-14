import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { safeStorage } from './utils/safeStorage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Al-Muslim App Crash Caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    safeStorage.removeItem('almuslim_settings');
    safeStorage.removeItem('almuslim_saved_city');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617',
          color: '#f8fafc',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'Cairo, system-ui, -apple-system, sans-serif',
          direction: 'rtl'
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🕋</div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
              تطبيق «المسلم»
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
              حدثت استعادة للنظام لتفادي أي تعليق في WebView أو المتصفح. يمكنك المتابعة الآن مباشرة.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                backgroundColor: '#10b981',
                color: '#020617',
                fontWeight: 'bold',
                fontSize: '14px',
                padding: '10px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              دخول التطبيق الآن
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Android WebView & Sketchware compatibility handler:
// If running in a WebView or if the standalone lightweight engine is active,
// preserve the instant, zero-dependency pure Vanilla HTML/CSS DOM to prevent freezing.
const isWebView = typeof navigator !== 'undefined' && (
  /wv|Android.*Version\/[0-9.]+|Sketchware|AppCreator24/i.test(navigator.userAgent) || 
  (typeof window !== 'undefined' && window.location.protocol === 'file:')
);

const isVanillaMode = typeof window !== 'undefined' && (
  (window as any).__STANDALONE_WEBVIEW_MODE__ && (isWebView || window.location.search.includes('vanilla=true') || !window.location.search.includes('react=true'))
);

if (!isVanillaMode) {
  try {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      createRoot(rootElement).render(
        <React.StrictMode>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </React.StrictMode>
      );
    }
  } catch (mountError) {
    console.error('Initial React Mount Error:', mountError);
  }
} else {
  console.log('Al-Muslim: Running in ultra-lightweight Vanilla HTML/CSS/JS mode for 100% Android WebView compatibility.');
}
