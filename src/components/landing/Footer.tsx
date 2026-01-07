'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/lib/i18n';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const { t, locale } = useI18n();

  const productLinks = locale === 'zh' 
    ? ['图标生成', '风格定制', 'API 接口', '批量导出']
    : ['Icon Generation', 'Style Customization', 'API Access', 'Batch Export'];
  
  const resourceLinks = locale === 'zh'
    ? ['设计规范', '使用教程', '更新日志', '常见问题']
    : ['Design Guidelines', 'Tutorials', 'Changelog', 'FAQ'];
  
  const aboutLinks = locale === 'zh'
    ? ['关于我们', '联系方式', '隐私政策', '服务条款']
    : ['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-content', {
        scrollTrigger: { trigger: footerRef.current, start: 'top 95%' },
        y: 30, opacity: 0, duration: 0.8
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} style={{ position: 'relative', padding: '80px 48px 40px', background: 'transparent', zIndex: 1 }}>
      <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)' }} />

      <div className="footer-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '60px', marginBottom: '60px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img src="/icon.svg" alt="Logo" style={{ height: '40px', width: '40px', borderRadius: '12px' }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '22px', color: '#111' }}>AIconic</span>
            </div>
            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7, maxWidth: '300px' }}>
              {t('hero.title1')}{t('hero.title2')}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '20px', letterSpacing: '1px' }}>
              {t('footer.product')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {productLinks.map((item, idx) => (
                <a key={idx} href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '20px', letterSpacing: '1px' }}>
              {t('footer.support')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {resourceLinks.map((item, idx) => (
                <a key={idx} href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '20px', letterSpacing: '1px' }}>
              {t('footer.legal')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {aboutLinks.map((item, idx) => (
                <a key={idx} href="#" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '32px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>{t('footer.copyright')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Made with</span>
            <span style={{ color: '#ec4899' }}>♥</span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>by AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
