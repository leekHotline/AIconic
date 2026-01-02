/**
 * Glassmorphism 风格 - 玻璃拟态 (Modern UI)
 * 
 * 特点：
 * - 毛玻璃效果 + 半透明背景
 * - 柔和的边框光晕
 * - 多层次模糊叠加
 * - 现代感十足的UI设计趋势
 * - 适合社交、金融、生活类应用
 */

import { StylePlugin, StyleColors } from './types';

const config = {
  id: 'glassmorphism',
  name: '玻璃拟态',
  platform: 'Modern UI',
  description: '毛玻璃效果 + 半透明层叠 + 柔和光晕',
  colors: {
    primary: '#667EEA',    // 渐变紫蓝
    secondary: '#764BA2',  // 深紫
    background: 'rgba(255, 255, 255, 0.25)',
    accent: '#F093FB',     // 粉紫
  },
};

function buildSvg(iconContent: string, colors: StyleColors): string {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 渐变背景底色 -->
    <linearGradient id="bg-base-glass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}"/>
      <stop offset="50%" stop-color="${colors.secondary}"/>
      <stop offset="100%" stop-color="${colors.accent}"/>
    </linearGradient>
    
    <!-- 玻璃层渐变 -->
    <linearGradient id="glass-layer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.1)"/>
    </linearGradient>
    
    <!-- 边框光晕 -->
    <linearGradient id="border-glow-glass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.8)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0.2)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.5)"/>
    </linearGradient>
    
    <!-- 毛玻璃模糊效果 -->
    <filter id="blur-glass" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
      <feColorMatrix in="blur" type="saturate" values="1.2"/>
    </filter>
    
    <!-- 主体发光效果 -->
    <filter id="icon-glow-glass" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feFlood flood-color="#fff" flood-opacity="0.6"/>
      <feComposite in2="blur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- 内阴影效果 -->
    <filter id="inner-shadow-glass" x="-10%" y="-10%" width="120%" height="120%">
      <feOffset dx="0" dy="2"/>
      <feGaussianBlur stdDeviation="2" result="shadow"/>
      <feComposite in="SourceGraphic" in2="shadow" operator="over"/>
    </filter>
  </defs>
  
  <!-- 渐变背景底层 -->
  <rect x="10" y="10" width="100" height="100" rx="24" fill="url(#bg-base-glass)"/>
  
  <!-- 玻璃层 -->
  <rect x="18" y="18" width="84" height="84" rx="18" fill="url(#glass-layer)" filter="url(#inner-shadow-glass)"/>
  
  <!-- 玻璃边框 -->
  <rect x="18" y="18" width="84" height="84" rx="18" fill="none" stroke="url(#border-glow-glass)" stroke-width="1.5"/>
  
  <!-- 顶部高光条 -->
  <rect x="25" y="22" width="70" height="2" rx="1" fill="rgba(255,255,255,0.6)"/>
  
  <!-- 主体容器 -->
  <g transform="translate(60, 60)">
    <g transform="translate(-60, -60)" filter="url(#icon-glow-glass)">${iconContent}</g>
  </g>
</svg>`;
}

function getPrompt(mainBody: string, colors: StyleColors): string {
  return `你是一位精通 Glassmorphism（玻璃拟态）设计风格的 UI 设计师。请为 "${mainBody}" 绘制一个现代感十足的图形。

## 设计风格要求

### 色彩运用
- 主体使用纯白色 #fff，这样在毛玻璃背景上会产生优雅的对比
- 可以使用 ${colors.primary} 作为点缀色，增加层次感
- 避免使用过于饱和的颜色，保持通透感

### 形态特征
- 图形要简洁、现代，线条流畅
- 适当使用圆角，避免尖锐的边角
- 可以有轻微的立体感，但不要过于复杂
- 保持图形的"轻盈感"，符合玻璃拟态的透明特质

### 构图要求
- 【重要】主体必须居中在坐标 (60, 60) 附近
- 主体占图标 55-65% 面积，留出呼吸空间
- 图形要有良好的识别度，即使在小尺寸下也清晰可辨

## 技术规则
1. 只输出 SVG 图形元素 (path, circle, rect, ellipse, polygon)
2. 图形中心点在 (60, 60)，有效范围 35-85
3. 直接输出代码，无需任何解释或注释

## 参考示例 - 钱包图标:
<rect x="38" y="45" width="44" height="30" rx="4" fill="#fff"/>
<rect x="38" y="45" width="44" height="10" rx="4" fill="${colors.primary}" opacity="0.3"/>
<circle cx="72" cy="60" r="5" fill="#fff"/>
<circle cx="72" cy="60" r="3" fill="${colors.primary}"/>
<path d="M42 50 L42 42 Q42 38 46 38 L74 38 Q78 38 78 42 L78 45" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
}

const glassmorphismStyle: StylePlugin = {
  config,
  buildSvg,
  getPrompt,
};

export default glassmorphismStyle;
