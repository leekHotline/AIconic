'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { signIn, signOut, useSession } from 'next-auth/react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const { t } = useI18n();
  const { data: session } = useSession();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.nav-logo', 
        { x: -30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo('.nav-link', 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo('.nav-cta', 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.5 }
      );
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
            <img src="/icon.svg"
            alt="Logo"
            style={{ height:'40px', width: '40px' , borderRadius:'12px'}}
            >
            </img>
          <span style={{ fontWeight: 700, fontSize: '20px', color: '#111' }}>AIconic</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[
            { label: t('nav.about'), href: '#about' },
            { label: t('nav.showcase'), href: '#showcase' },
            { label: t('nav.features'), href: '#features' },
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
            className="nav-cta"
            style={{
              padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: '15px', fontWeight: 500, borderRadius: '10px',
              border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.4)'; }}
          >
            {t('nav.start')}
          </button>

          {/* 语言切换按钮 */}
          <LanguageSwitcher />

          {/* 用户登录按钮 */}
          {session?.user ? (
            <button
              onClick={() => signOut()}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: session.user.image ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: '14px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
              }}
              title={`${session.user.name} - 点击退出`}
            >
              {session.user.image ? (
                <img src={session.user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                session.user.name?.charAt(0).toUpperCase()
              )}
            </button>
          ) : (
            <button
              onClick={() => signIn('google')}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#f3f4f6', border: '1px solid #e5e7eb',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6b7280'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
              title={t('nav.login')}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
