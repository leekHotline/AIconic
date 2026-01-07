'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export default function HeroSection() {
  const router = useRouter();
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const quickTags = [
    { icon: '🚀', textKey: 'tag.rocket', color: '#f97316' },
    { icon: '🔒', textKey: 'tag.security', color: '#22c55e' },
    { icon: '💰', textKey: 'tag.finance', color: '#eab308' },
    { icon: '☁️', textKey: 'tag.cloud', color: '#3b82f6' },
    { icon: '🎵', textKey: 'tag.music', color: '#ec4899' },
    { icon: '📸', textKey: 'tag.camera', color: '#8b5cf6' },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (prompt.trim()) {
      sessionStorage.setItem('iconPrompt', prompt.trim());
      router.push('/icon');
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { x: e.clientX - 150, y: e.clientY - 150, duration: 0.8, ease: 'power2.out' });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-badge', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' })
        .from('.hero-title-line', { y: 80, opacity: 0, stagger: 0.15, duration: 0.8 }, '-=0.3')
        .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.hero-input', { y: 40, opacity: 0, scale: 0.95, duration: 0.7 }, '-=0.3')
        .from('.hero-tag', { y: 20, opacity: 0, stagger: 0.08, duration: 0.4 }, '-=0.3')
        .from('.floating-icon', { scale: 0, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, '-=0.5')
        .from('.scroll-indicator', { y: -20, opacity: 0, duration: 0.5 }, '-=0.2');

      gsap.to('.floating-icon', {
        y: 'random(-20, 20)', x: 'random(-15, 15)', rotation: 'random(-10, 10)',
        duration: 'random(3, 5)', repeat: -1, yoyo: true, ease: 'sine.inOut',
        stagger: { each: 0.5, from: 'random' }
      });

      gsap.to('.scroll-arrow', { y: 8, duration: 0.8, repeat: -1, yoyo: true, ease: 'power1.inOut' });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '120px 48px 80px', overflow: 'hidden',
      background: 'transparent', zIndex: 1
    }}>
      <div ref={cursorRef} style={{
        position: 'fixed', width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0, filter: 'blur(40px)'
      }} />

      <div className="floating-icon" style={{ position: 'absolute', top: '15%', left: '10%', fontSize: '48px', opacity: 0.6 }}>🎨</div>
      <div className="floating-icon" style={{ position: 'absolute', top: '25%', right: '12%', fontSize: '40px', opacity: 0.5 }}>✨</div>
      <div className="floating-icon" style={{ position: 'absolute', bottom: '30%', left: '8%', fontSize: '36px', opacity: 0.5 }}>💎</div>
      <div className="floating-icon" style={{ position: 'absolute', bottom: '20%', right: '15%', fontSize: '44px', opacity: 0.6 }}>🚀</div>
      <div className="floating-icon" style={{ position: 'absolute', top: '40%', left: '20%', fontSize: '32px', opacity: 0.4 }}>⚡</div>
      <div className="floating-icon" style={{ position: 'absolute', top: '35%', right: '25%', fontSize: '38px', opacity: 0.5 }}>🔮</div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px' }}>
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(99,102,241,0.1)', borderRadius: '20px', marginBottom: '32px', border: '1px solid rgba(99,102,241,0.2)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '14px', color: '#6366f1', fontWeight: 500 }}>{t('hero.badge')}</span>
        </div>

        <h1 style={{ marginBottom: '24px' }}>
          <div className="hero-title-line" style={{ fontSize: '64px', fontWeight: 700, color: '#111', lineHeight: 1.2 }}>
            {t('hero.title1')}
          </div>
          <div className="hero-title-line" style={{ 
            fontSize: '64px', fontWeight: 800, lineHeight: 1.2, 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)', 
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
          }}>
            {t('hero.title2')}
          </div>
        </h1>

        <p className="hero-subtitle" style={{ fontSize: '20px', color: '#64748b', maxWidth: '650px', margin: '0 auto 48px', lineHeight: 1.6 }}>
          {t('hero.subtitle1')}<br />
          <strong>{t('hero.subtitle2')}</strong>
        </p>

        <form onSubmit={handleSubmit} className="hero-input" style={{ maxWidth: '640px', margin: '0 auto 32px' }}>
          <div style={{ position: 'relative', background: '#fff', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)', padding: '8px', transition: 'all 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 50px rgba(99,102,241,0.15), 0 0 0 1px rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t('hero.placeholder')}
              style={{ width: '100%', padding: '18px 70px 18px 24px', fontSize: '17px', border: 'none', outline: 'none', background: 'transparent', color: '#111', borderRadius: '16px' }} />
            <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '52px', height: '52px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.4)', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          {quickTags.map((tag, idx) => (
            <button key={idx} onClick={() => setPrompt(t(tag.textKey))} className="hero-tag"
              style={{ opacity: 1, padding: '10px 18px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = tag.color; e.currentTarget.style.background = `${tag.color}10`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <span style={{ fontSize: '16px' }}>{tag.icon}</span><span>{t(tag.textKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-indicator" style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '2px' }}>{t('hero.scroll')}</span>
        <div className="scroll-arrow" style={{ color: '#94a3b8' }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </div>
    </section>
  );
}
