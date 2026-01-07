'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useI18n } from '@/lib/i18n';

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [animated, setAnimated] = useState(false);
  const { t } = useI18n();

  const styles = [
    { tag: 'Apple', nameKey: 'features.style1.name', styleKey: 'features.style1.style', descKey: 'features.style1.desc', gradient: 'linear-gradient(135deg, #007AFF, #5856D6)', features: ['features.style1.f1', 'features.style1.f2', 'features.style1.f3'] },
    { tag: 'Android', nameKey: 'features.style2.name', styleKey: 'features.style2.style', descKey: 'features.style2.desc', gradient: 'linear-gradient(135deg, #4285F4, #8AB4F8)', features: ['features.style2.f1', 'features.style2.f2', 'features.style2.f3'] },
    { tag: 'Vibrant', nameKey: 'features.style3.name', styleKey: 'features.style3.style', descKey: 'features.style3.desc', gradient: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)', features: ['features.style3.f1', 'features.style3.f2', 'features.style3.f3'] },
    { tag: 'Elegant', nameKey: 'features.style4.name', styleKey: 'features.style4.style', descKey: 'features.style4.desc', gradient: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', features: ['features.style4.f1', 'features.style4.f2', 'features.style4.f3'] },
    { tag: 'Neon', nameKey: 'features.style5.name', styleKey: 'features.style5.style', descKey: 'features.style5.desc', gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)', features: ['features.style5.f1', 'features.style5.f2', 'features.style5.f3'] },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          setAnimated(true);
          gsap.fromTo('.features-label', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
          gsap.fromTo('.features-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: 'power3.out' });
          gsap.fromTo('.features-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power3.out' });
          gsap.fromTo('.features-tabs', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power3.out' });
          gsap.fromTo('.features-preview', { y: 40, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.4, ease: 'power3.out' });
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  const activeStyle = styles[activeIdx];

  return (
    <section ref={sectionRef} id="features" style={{ position: 'relative', padding: '120px 48px', background: 'transparent', zIndex: 1 }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '600px', background: `radial-gradient(ellipse at center, ${activeIdx === 0 ? 'rgba(0,122,255,0.05)' : activeIdx === 1 ? 'rgba(52,168,83,0.05)' : activeIdx === 2 ? 'rgba(255,107,107,0.05)' : activeIdx === 3 ? 'rgba(108,92,231,0.05)' : 'rgba(255,0,110,0.05)'} 0%, transparent 60%)`, filter: 'blur(60px)', pointerEvents: 'none', transition: 'background 0.6s ease' }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="features-label" style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(34,197,94,0.08)', borderRadius: '30px', fontSize: '13px', color: '#22c55e', fontWeight: 600, marginBottom: '20px', letterSpacing: '2px', border: '1px solid rgba(34,197,94,0.12)', opacity: animated ? 1 : 0 }}>
            PLATFORM STYLES
          </span>
          <h2 className="features-title" style={{ fontSize: '44px', fontWeight: 700, color: '#111', marginBottom: '16px', opacity: animated ? 1 : 0 }}>
            {t('features.title')}
          </h2>
          <p className="features-subtitle" style={{ fontSize: '17px', color: '#64748b', maxWidth: '400px', margin: '0 auto', opacity: animated ? 1 : 0 }}>
            {t('features.subtitle')}
          </p>
        </div>

        <div className="features-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px', opacity: animated ? 1 : 0 }}>
          {styles.map((item, idx) => (
            <button key={idx} onClick={() => setActiveIdx(idx)}
              style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, background: activeIdx === idx ? item.gradient : 'rgba(255,255,255,0.8)', color: activeIdx === idx ? '#fff' : '#64748b', boxShadow: activeIdx === idx ? '0 6px 20px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.03)', transform: activeIdx === idx ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(10px)' }}>
              {item.tag}
            </button>
          ))}
        </div>

        <div className="features-preview" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '40px', alignItems: 'center', padding: '40px', background: 'rgba(255,255,255,0.7)', borderRadius: '24px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 32px rgba(0,0,0,0.03)', opacity: animated ? 1 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '180px', height: '180px', borderRadius: '40px', background: activeStyle.gradient, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
              <div style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.25)', borderRadius: '18px', backdropFilter: 'blur(8px)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'inline-block', padding: '4px 10px', background: activeStyle.gradient, borderRadius: '6px', fontSize: '11px', color: '#fff', fontWeight: 600, marginBottom: '12px', transition: 'background 0.5s' }}>
              {t(activeStyle.nameKey)}
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>{t(activeStyle.styleKey)}</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>{t(activeStyle.descKey)}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeStyle.features.map((featureKey, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.9)', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', transition: 'all 0.25s', cursor: 'default' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)'; }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeStyle.gradient }} />
                  <span style={{ fontSize: '13px', color: '#374151' }}>{t(featureKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
