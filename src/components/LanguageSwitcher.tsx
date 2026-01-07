'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#f3f4f6', border: '1px solid #e5e7eb',
          cursor: 'pointer', transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#6b7280'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
        title={locale === 'zh' ? 'Switch Language' : '切换语言'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </button>

      {showMenu && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 100 }} 
            onClick={() => setShowMenu(false)} 
          />
          <div style={{
            position: 'absolute', top: '44px', right: 0, zIndex: 101,
            background: '#fff', borderRadius: '8px', padding: '4px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #e5e7eb',
            minWidth: '120px'
          }}>
            <button
              onClick={() => { setLocale('zh'); setShowMenu(false); }}
              style={{
                width: '100%', padding: '8px 12px', border: 'none',
                background: locale === 'zh' ? '#eef2ff' : 'transparent',
                borderRadius: '6px', cursor: 'pointer', textAlign: 'left',
                fontSize: '14px', color: locale === 'zh' ? '#6366f1' : '#374151',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              🇨🇳 中文
            </button>
            <button
              onClick={() => { setLocale('en'); setShowMenu(false); }}
              style={{
                width: '100%', padding: '8px 12px', border: 'none',
                background: locale === 'en' ? '#eef2ff' : 'transparent',
                borderRadius: '6px', cursor: 'pointer', textAlign: 'left',
                fontSize: '14px', color: locale === 'en' ? '#6366f1' : '#374151',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              🇺🇸 English
            </button>
          </div>
        </>
      )}
    </div>
  );
}
