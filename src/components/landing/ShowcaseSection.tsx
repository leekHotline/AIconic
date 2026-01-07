'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useI18n } from '@/lib/i18n';

// 社区示例图标
const communityExamples = [
  { id: 'agent_center', name: 'Agent Center', src: '/community_example/agent_center.svg' },
  { id: 'aiconic-logo', name: 'AIconic Logo', src: '/community_example/aiconic-logo.svg' },
  { id: 'cloud-storage', name: 'Cloud Storage', src: '/community_example/cloud-storage.svg' },
  { id: 'data-analytics', name: 'Data Analytics', src: '/community_example/data-analytics.svg' },
  { id: 'data-table', name: 'Data Table', src: '/community_example/data-table.svg' },
  { id: 'security-shield', name: 'Security Shield', src: '/community_example/security-shield.svg' },
];

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          setAnimated(true);
          gsap.fromTo('.showcase-label', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
          gsap.fromTo('.showcase-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: 'power3.out' });
          gsap.fromTo('.showcase-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power3.out' });
          gsap.fromTo('.showcase-item', { y: 50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, delay: 0.3, ease: 'back.out(1.3)' });
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <section ref={sectionRef} id="showcase" style={{ position: 'relative', padding: '120px 48px', background: 'transparent', zIndex: 1 }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="showcase-label" style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(236,72,153,0.08)', borderRadius: '30px', fontSize: '13px', color: '#ec4899', fontWeight: 600, marginBottom: '20px', letterSpacing: '2px', border: '1px solid rgba(236,72,153,0.12)', opacity: animated ? 1 : 0 }}>
            SHOWCASE
          </span>
          <h2 className="showcase-title" style={{ fontSize: '44px', fontWeight: 700, color: '#111', marginBottom: '16px', opacity: animated ? 1 : 0 }}>
            {t('showcase.title')}
          </h2>
          <p className="showcase-subtitle" style={{ fontSize: '17px', color: '#64748b', maxWidth: '400px', margin: '0 auto', opacity: animated ? 1 : 0 }}>
            {t('showcase.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {communityExamples.map((item, idx) => (
            <div key={item.id} className="showcase-item" onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position: 'relative', aspectRatio: '1', borderRadius: '24px',
                background: '#f8fafc',
                cursor: 'pointer', overflow: 'hidden',
                boxShadow: hoveredIdx === idx ? '0 20px 40px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0,0,0,0.04)',
                transform: hoveredIdx === idx ? 'scale(1.05) translateY(-4px)' : hoveredIdx !== null ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: hoveredIdx !== null && hoveredIdx !== idx ? 'blur(1px)' : 'none',
                opacity: hoveredIdx !== null && hoveredIdx !== idx ? 0.75 : (animated ? 1 : 0),
                border: '1px solid rgba(0,0,0,0.06)'
              }}>
              
              {/* 图标展示 */}
              <div style={{ 
                position: 'absolute', top: '50%', left: '50%', 
                transform: hoveredIdx === idx ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%)',
                width: '70%', height: '70%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <img src={item.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>

              {/* 悬停信息卡片 */}
              <div style={{ 
                position: 'absolute', bottom: '14px', left: '14px', right: '14px', 
                padding: '12px 14px', background: 'rgba(255,255,255,0.95)', borderRadius: '12px', 
                backdropFilter: 'blur(10px)', 
                transform: hoveredIdx === idx ? 'translateY(0)' : 'translateY(60px)', 
                opacity: hoveredIdx === idx ? 1 : 0, 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{item.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Community</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.7)', borderRadius: '20px', fontSize: '12px', color: '#64748b', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <span>✨</span>{t('showcase.hover')}
          </p>
        </div>
      </div>
    </section>
  );
}
