'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const showcaseItems = [
  { gradient: 'linear-gradient(135deg, #667eea, #764ba2)', icon: '🎨', label: '创意设计' },
  { gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', icon: '💎', label: '奢华品质' },
  { gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', icon: '⚡', label: '极速体验' },
  { gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', icon: '�', labbel: '自然生态' },
  { gradient: 'linear-gradient(135deg, #fa709a, #fee140)', icon: '�', label:  '热门趋势' },
  { gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)', icon: '✨', label: '梦幻星光' },
];

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          setAnimated(true);
          
          gsap.fromTo('.showcase-label', 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
          );
          gsap.fromTo('.showcase-title', 
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: 'power3.out' }
          );
          gsap.fromTo('.showcase-subtitle', 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power3.out' }
          );
          gsap.fromTo('.showcase-item', 
            { y: 50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, delay: 0.3, ease: 'back.out(1.3)' }
          );
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <section ref={sectionRef} id="showcase" style={{
      position: 'relative', padding: '120px 48px', background: 'transparent', zIndex: 1
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="showcase-label" style={{
            display: 'inline-block', padding: '8px 20px',
            background: 'rgba(236,72,153,0.08)',
            borderRadius: '30px', fontSize: '13px', color: '#ec4899', fontWeight: 600,
            marginBottom: '20px', letterSpacing: '2px',
            border: '1px solid rgba(236,72,153,0.12)',
            opacity: animated ? 1 : 0
          }}>
            SHOWCASE
          </span>
          <h2 className="showcase-title" style={{
            fontSize: '44px', fontWeight: 700, color: '#111', marginBottom: '16px',
            opacity: animated ? 1 : 0
          }}>
            AI 创作展示
          </h2>
          <p className="showcase-subtitle" style={{ 
            fontSize: '17px', color: '#64748b', maxWidth: '400px', margin: '0 auto',
            opacity: animated ? 1 : 0
          }}>
            每一个图标都是 AI 的艺术创作
          </p>
        </div>

        {/* 图标网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {showcaseItems.map((item, idx) => (
            <div
              key={idx}
              className="showcase-item"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position: 'relative', 
                aspectRatio: '1', 
                borderRadius: '24px',
                background: item.gradient, 
                cursor: 'pointer', 
                overflow: 'hidden',
                boxShadow: hoveredIdx === idx 
                  ? '0 20px 40px rgba(0,0,0,0.15)' 
                  : '0 6px 24px rgba(0,0,0,0.06)',
                transform: hoveredIdx === idx 
                  ? 'scale(1.05) translateY(-4px)' 
                  : hoveredIdx !== null 
                    ? 'scale(0.98)' 
                    : 'scale(1)',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: hoveredIdx !== null && hoveredIdx !== idx ? 'blur(1px)' : 'none',
                opacity: hoveredIdx !== null && hoveredIdx !== idx ? 0.75 : (animated ? 1 : 0)
              }}
            >
              {/* 光泽效果 */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)',
                opacity: hoveredIdx === idx ? 1 : 0.7,
                transition: 'opacity 0.3s'
              }} />

              {/* 图标 */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: hoveredIdx === idx 
                  ? 'translate(-50%, -50%) scale(1.12)' 
                  : 'translate(-50%, -50%) scale(1)',
                fontSize: '52px', 
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                {item.icon}
              </div>

              {/* 标签 */}
              <div style={{
                position: 'absolute', bottom: '14px', left: '14px', right: '14px',
                padding: '10px 12px', 
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '10px', 
                backdropFilter: 'blur(10px)',
                transform: hoveredIdx === idx ? 'translateY(0)' : 'translateY(60px)',
                opacity: hoveredIdx === idx ? 1 : 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{item.label}</div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>AI Generated</div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', 
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '20px', 
            fontSize: '12px', 
            color: '#64748b',
            backdropFilter: 'blur(10px)', 
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <span>✨</span>
            悬停查看更多
          </p>
        </div>
      </div>
    </section>
  );
}
