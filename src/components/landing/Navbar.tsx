'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nav-logo', { x: -30, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.nav-link', { y: -20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out', delay: 0.3 });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: 'blur(24px)', background: 'rgba(255,255,255,0.7)',
      borderBottom: '1px solid rgba(255,255,255,0.5)'
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto', padding: '0 48px',
        height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)'
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>A</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: '20px', color: '#111' }}>AIconic</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {[
            { label: '关于', href: '#about' },
            { label: '展示', href: '#showcase' },
            { label: '功能', href: '#features' },
          ].map((item, idx) => (
            <a key={idx} href={item.href} className="nav-link"
              style={{ fontSize: '15px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
              {item.label}
            </a>
          ))}
          <button
            onClick={() => router.push('/icon')}
            className="nav-link"
            style={{
              padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: '15px', fontWeight: 500, borderRadius: '10px',
              border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.4)'; }}
          >
            开始创作
          </button>
        </div>
      </div>
    </nav>
  );
}
