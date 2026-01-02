'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import ShowcaseSection from '@/components/landing/ShowcaseSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import SectionDivider from '@/components/landing/SectionDivider';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // 刷新 ScrollTrigger 确保正确计算
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ background: '#fff', overflowX: 'hidden', position: 'relative' }}>
      {/* 顶部大面积高斯模糊背景 - 类似 Synro */}
      <div style={{
        position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)',
        width: '1400px', height: '900px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(147,197,253,0.5) 0%, rgba(196,181,253,0.4) 25%, rgba(252,211,253,0.2) 50%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0
      }} />

      <Navbar />
      <HeroSection />
      
      <SectionDivider color="rgba(99,102,241,0.15)" />
      <AboutSection />
      
      <SectionDivider color="rgba(236,72,153,0.12)" />
      <ShowcaseSection />
      
      <SectionDivider color="rgba(34,197,94,0.12)" />
      <FeaturesSection />
      
      <SectionDivider color="rgba(139,92,246,0.15)" />
      <CTASection />
      
      <Footer />

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #fff;
        }
        ::selection { background: rgba(99, 102, 241, 0.2); }
      `}</style>
    </div>
  );
}
