import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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
    localStorage.removeItem('almuslim_settings');
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
          fontFamily: 'system-ui, -apple-system, sans-serif',
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
              حدث خطأ أثناء تحميل بعض البيانات. يمكنك إعادة تحميل الصفحة وإعادة ضبط الإعدادات للبدء من جديد.
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
              إعادة تحميل التطبيق
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
