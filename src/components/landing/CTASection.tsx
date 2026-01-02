'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 80, opacity: 0, scale: 0.95, duration: 1, ease: 'power3.out'
      });

      gsap.from('.cta-particle', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        scale: 0, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'back.out(1.7)'
      });

      // 粒子浮动
      gsap.to('.cta-particle', {
        y: 'random(-20, 20)', x: 'random(-15, 15)',
        duration: 'random(2, 4)', repeat: -1, yoyo: true, ease: 'sine.inOut',
        stagger: { each: 0.3, from: 'random' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      position: 'relative', padding: '140px 48px', background: 'transparent', zIndex: 1
    }}>
      {/* 装饰粒子 */}
      <div className="cta-particle" style={{ position: 'absolute', top: '15%', left: '10%', fontSize: '32px', opacity: 0.4 }}>✨</div>
      <div className="cta-particle" style={{ position: 'absolute', top: '25%', right: '15%', fontSize: '28px', opacity: 0.3 }}>🎨</div>
      <div className="cta-particle" style={{ position: 'absolute', bottom: '20%', left: '15%', fontSize: '24px', opacity: 0.3 }}>💎</div>
      <div className="cta-particle" style={{ position: 'absolute', bottom: '30%', right: '10%', fontSize: '30px', opacity: 0.4 }}>🚀</div>

      <div className="cta-card" style={{
        maxWidth: '900px', margin: '0 auto', textAlign: 'center',
        padding: '80px 60px', position: 'relative',
        background: 'rgba(255,255,255,0.6)', borderRadius: '40px',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 16px 64px rgba(99,102,241,0.08)',
        border: '1px solid rgba(255,255,255,0.8)'
      }}>
        {/* 背景渐变 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.03) 0%, rgba(236,72,153,0.03) 100%)',
          borderRadius: '40px'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* 图标组 */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px'
          }}>
            {['🎨', '⚡', '✨'].map((emoji, idx) => (
              <div key={idx} style={{
                width: '64px', height: '64px', borderRadius: '18px',
                background: idx === 1 
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                  : 'rgba(99,102,241,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px',
                transform: idx === 1 ? 'scale(1.2)' : 'scale(1)',
                boxShadow: idx === 1 ? '0 12px 32px rgba(99,102,241,0.3)' : 'none'
              }}>
                {emoji}
              </div>
            ))}
          </div>

          <h2 style={{
            fontSize: '44px', fontWeight: 700, color: '#111', marginBottom: '20px', lineHeight: 1.2
          }}>
            准备好创造
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}> 惊艳图标 </span>
            了吗？
          </h2>

          <p style={{
            fontSize: '18px', color: '#64748b', marginBottom: '40px',
            maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.6
          }}>
            立即开始，让 AI 为你的应用打造独一无二的专业图标，提升品牌形象
          </p>

          {/* 按钮组 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button
              onClick={() => router.push('/icon')}
              style={{
                padding: '18px 40px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontSize: '17px', fontWeight: 600, borderRadius: '16px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 12px 32px rgba(99,102,241,0.4)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(99,102,241,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.4)';
              }}
            >
              免费开始创作
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '18px 32px',
                background: 'rgba(99,102,241,0.08)',
                color: '#6366f1', fontSize: '17px', fontWeight: 600, borderRadius: '16px',
                border: '1px solid rgba(99,102,241,0.2)', cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              查看案例
            </button>
          </div>

          {/* 信任标识 */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px',
            marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(0,0,0,0.05)'
          }}>
            {[
              { icon: '🔒', text: '安全可靠' },
              { icon: '⚡', text: '秒级生成' },
              { icon: '💯', text: '免费使用' },
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '14px', color: '#64748b'
              }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
