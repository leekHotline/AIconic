'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

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
    <footer ref={footerRef} style={{
      position: 'relative', padding: '80px 48px 40px',
      background: 'transparent', zIndex: 1
    }}>
      {/* 顶部分隔线 - 渐变淡化 */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)'
      }} />

      <div className="footer-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 主要内容 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '60px',
          marginBottom: '60px'
        }}>
          {/* 品牌区 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99,102,241,0.3)'
              }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '20px' }}>A</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: '22px', color: '#111' }}>AIconic</span>
            </div>
            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7, maxWidth: '300px' }}>
              AI 驱动的下一代图标生成器，让每个应用都拥有专业级的视觉标识。
            </p>
          </div>

          {/* 链接区 */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '20px', letterSpacing: '1px' }}>
              产品
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['图标生成', '风格定制', 'API 接口', '批量导出'].map((item, idx) => (
                <a key={idx} href="#" style={{
                  fontSize: '14px', color: '#64748b', textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '20px', letterSpacing: '1px' }}>
              资源
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['设计规范', '使用教程', '更新日志', '常见问题'].map((item, idx) => (
                <a key={idx} href="#" style={{
                  fontSize: '14px', color: '#64748b', textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '20px', letterSpacing: '1px' }}>
              关于
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['关于我们', '联系方式', '隐私政策', '服务条款'].map((item, idx) => (
                <a key={idx} href="#" style={{
                  fontSize: '14px', color: '#64748b', textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '32px', borderTop: '1px solid rgba(0,0,0,0.05)'
        }}>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            © 2025 AIconic. All rights reserved.
          </p>
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
