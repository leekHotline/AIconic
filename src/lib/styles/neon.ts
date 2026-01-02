/**
 * Neon 风格 - 霓虹发光 (Creative)
 * 
 * 特点：
 * - 发光效果 + 深色渐变背景
 * - 高对比度
 * - 边缘发光
 * - 科技感
 */

import { StylePlugin, StyleColors } from './types';

const config = {
  id: 'neon',
  name: '霓虹',
  platform: 'Creative',
  description: '发光效果 + 深色背景 + 高对比度',
  colors: {
    primary: '#EC4899',    // 粉
    secondary: '#8B5CF6',  // 紫
    background: '#1a1a2e',
    accent: '#00D9FF',
  },
};

function buildSvg(iconContent: string, colors: StyleColors): string {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 深色渐变背景 -->
    <linearGradient id="bg-neon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}"/>
      <stop offset="100%" stop-color="${colors.secondary}"/>
    </linearGradient>
    <!-- 霓虹发光 -->
    <filter id="glow-neon" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <!-- 外发光阴影 -->
    <filter id="outerGlow-neon" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="${colors.primary}" flood-opacity="0.5"/>
    </filter>
  </defs>
  <!-- 背景 -->
  <rect x="10" y="10" width="100" height="100" rx="24" fill="url(#bg-neon)" filter="url(#outerGlow-neon)"/>
  <!-- 玻璃高光 -->
  <rect x="10" y="10" width="100" height="50" rx="24" fill="#fff" opacity="0.15"/>
  <!-- 主体容器 - 确保居中 -->
  <g transform="translate(60, 60)">
    <g transform="translate(-60, -60)" filter="url(#glow-neon)">${iconContent}</g>
  </g>
</svg>`;
}

function getPrompt(mainBody: string, colors: StyleColors): string {
  return `你是霓虹风格设计师。绘制 "${mainBody}" 的发光图形。

风格要求：
- 主体用白色 #fff，会自动添加发光效果
- 可用 ${colors.primary} 作为点缀
- 简洁线条，适合发光效果
- 高对比度，深色背景上要醒目
- 【重要】主体必须居中在坐标 (60, 60) 附近

规则:
1. 只输出 SVG 图形元素 (path, circle, rect, ellipse)
2. 图形中心点在 (60, 60)，范围 35-85
3. 主体占图标 60-70% 面积
4. 直接输出代码，无解释

示例 - 闪电:
<path d="M65 30 L50 58 L58 58 L55 90 L75 55 L65 55 Z" fill="#fff"/>`;
}

const neonStyle: StylePlugin = {
  config,
  buildSvg,
  getPrompt,
};

export default neonStyle;
