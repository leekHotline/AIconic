/**
 * Gradient 风格 - 渐变流体 (Vibrant)
 * 
 * 特点：
 * - 大胆的多色渐变
 * - 流体形状和有机曲线
 * - 高饱和度色彩
 * - 动感十足的视觉效果
 * - 适合音乐、娱乐、社交类应用
 */

import { StylePlugin, StyleColors } from './types';

const config = {
  id: 'gradient',
  name: '渐变流体',
  platform: 'Vibrant',
  description: '多色渐变 + 流体形状 + 高饱和度色彩',
  colors: {
    primary: '#FF6B6B',    // 珊瑚红
    secondary: '#4ECDC4',  // 青绿
    background: '#2C3E50', // 深蓝灰
    accent: '#FFE66D',     // 明黄
  },
};

function buildSvg(iconContent: string, colors: StyleColors): string {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 主渐变背景 -->
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="${colors.secondary}"/>
    </linearGradient>

    <!-- 流体装饰渐变 -->
    <linearGradient id="blob1-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${colors.primary}" stop-opacity="0.3"/>
    </linearGradient>
    
    <linearGradient id="blob2-grad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${colors.secondary}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#A855F7" stop-opacity="0.2"/>
    </linearGradient>
    
    <!-- 图标渐变 -->
    <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.8)"/>
    </linearGradient>
    
    <!-- 发光效果 -->
    <filter id="glow-grad" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feFlood flood-color="#fff" flood-opacity="0.5"/>
      <feComposite in2="blur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- 外发光 -->
    <filter id="outer-glow-grad" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="${colors.primary}" flood-opacity="0.4"/>
    </filter>
    
    <!-- 模糊效果 -->
    <filter id="blur-grad" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
  </defs>
  
  <!-- 背景 -->
  <rect x="10" y="10" width="100" height="100" rx="24" fill="url(#bg-grad)" filter="url(#outer-glow-grad)"/>
  
  <!-- 流体装饰 blob 1 -->
  <ellipse cx="30" cy="35" rx="25" ry="20" fill="url(#blob1-grad)" filter="url(#blur-grad)"/>
  
  <!-- 流体装饰 blob 2 -->
  <ellipse cx="90" cy="85" rx="22" ry="18" fill="url(#blob2-grad)" filter="url(#blur-grad)"/>
  
  <!-- 流体装饰 blob 3 -->
  <circle cx="85" cy="30" r="15" fill="${colors.accent}" opacity="0.2" filter="url(#blur-grad)"/>
  
  <!-- 玻璃层 -->
  <rect x="15" y="15" width="90" height="45" rx="20" fill="rgba(255,255,255,0.1)"/>
  
  <!-- 主体容器 -->
  <g transform="translate(60, 60)">
    <g transform="translate(-60, -60)" filter="url(#glow-grad)">${iconContent}</g>
  </g>
</svg>`;
}

function getPrompt(mainBody: string, colors: StyleColors): string {
  return `你是一位精通渐变流体设计风格的创意设计师。请为 "${mainBody}" 绘制一个充满活力的图形。

## 设计风格要求

### 色彩运用
- 主体使用纯白色 #fff 或 url(#icon-grad)，在彩色背景上形成强烈对比
- 可以使用 ${colors.accent} 作为点缀高亮
- 图形要简洁明快，让渐变背景成为视觉焦点

### 形态特征
- 图形线条要流畅、有动感
- 可以使用有机曲线，避免过于僵硬的几何形状
- 适当的圆角让图形更加柔和
- 保持图形的现代感和活力

### 视觉效果
- 图形会自动添加发光效果
- 可以用不同透明度来表现层次
- 简洁但不简单，要有设计感

### 构图要求
- 【重要】主体必须居中在坐标 (60, 60) 附近
- 主体占图标 55-65% 面积
- 图形要在彩色背景上清晰可见

## 技术规则
1. 只输出 SVG 图形元素 (path, circle, rect, ellipse, polygon)
2. 图形中心点在 (60, 60)，有效范围 35-85
3. 主要使用白色 #fff，可用 ${colors.accent} 点缀
4. 直接输出代码，无需任何解释或注释

## 参考示例 - 音乐音符:
<circle cx="50" cy="70" r="10" fill="#fff"/>
<circle cx="70" cy="65" r="10" fill="#fff"/>
<rect x="58" y="35" width="4" height="35" rx="2" fill="#fff"/>
<path d="M62 35 Q80 28 80 45 Q80 58 62 52" fill="#fff"/>
<circle cx="50" cy="70" r="4" fill="${colors.accent}"/>

## 参考示例 - 火箭:
<path d="M60 30 Q70 35 72 50 L72 65 Q72 72 65 75 L60 78 L55 75 Q48 72 48 65 L48 50 Q50 35 60 30 Z" fill="#fff"/>
<ellipse cx="60" cy="82" rx="8" ry="4" fill="${colors.accent}"/>
<circle cx="60" cy="48" r="5" fill="${colors.accent}"/>
<path d="M48 55 L40 62 L45 65 L48 60" fill="#fff" opacity="0.8"/>
<path d="M72 55 L80 62 L75 65 L72 60" fill="#fff" opacity="0.8"/>`;
}

const gradientStyle: StylePlugin = {
  config,
  buildSvg,
  getPrompt,
};

export default gradientStyle;
