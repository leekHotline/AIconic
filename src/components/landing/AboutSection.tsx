'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: '🎯',
    title: 'AI 语义理解',
    desc: '深度理解你的描述，将抽象概念转化为具象视觉元素',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    stats: '98% 准确率'
  },
  {
    icon: '⚡',
    title: '秒级生成',
    desc: '先进的生成算法，3秒内输出4种专业风格图标',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    stats: '< 3 秒'
  },
  {
    icon: '🎨',
    title: '多平台适配',
    desc: '自动适配 iOS、Android、Windows 等平台设计规范',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    stats: '4 种风格'
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    // 使用 IntersectionObserver 作为备选方案
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          setAnimated(true);
          
          gsap.fromTo('.about-label', 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
          );
          gsap.fromTo('.about-title', 
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: 'power3.out' }
          );
          gsap.fromTo('.about-subtitle', 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power3.out' }
          );
          gsap.fromTo('.about-card', 
            { y: 60, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, delay: 0.3, ease: 'back.out(1.2)' }
          );
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <section ref={sectionRef} id="about" style={{
      position: 'relative', padding: '120px 48px', background: 'transparent', zIndex: 1
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* 标题区 */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="about-label" style={{
            display: 'inline-block', padding: '8px 20px',
            background: 'rgba(99,102,241,0.08)',
            borderRadius: '30px', fontSize: '13px', color: '#6366f1', fontWeight: 600,
            marginBottom: '20px', letterSpacing: '2px',
            border: '1px solid rgba(99,102,241,0.12)',
            opacity: animated ? 1 : 0
          }}>
            WHY AICONIC
          </span>
          <h2 className="about-title" style={{
            fontSize: '44px', fontWeight: 700, color: '#111', marginBottom: '16px', lineHeight: 1.2,
            opacity: animated ? 1 : 0
          }}>
            重新定义图标设计
          </h2>
          <p className="about-subtitle" style={{ 
            fontSize: '17px', color: '#64748b', maxWidth: '450px', margin: '0 auto',
            opacity: animated ? 1 : 0
          }}>
            AI 驱动的下一代图标生成体验
          </p>
        </div>

        {/* 卡片网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {features.map((item, idx) => (
            <div
              key={idx}
              className="about-card"
              style={{
                position: 'relative', padding: '40px 32px',
                background: 'rgba(255,255,255,0.7)', borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
                cursor: 'pointer', 
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: animated ? 1 : 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.03)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
              }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '18px', background: item.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', marginBottom: '24px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}>
                {item.icon}
              </div>

              <div style={{
                display: 'inline-block', padding: '4px 10px', background: 'rgba(99,102,241,0.08)',
                borderRadius: '6px', fontSize: '11px', color: '#6366f1', fontWeight: 600,
                marginBottom: '14px'
              }}>
                {item.stats}
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111', marginBottom: '10px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
