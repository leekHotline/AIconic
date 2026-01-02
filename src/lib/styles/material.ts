/**
 * Material 风格 - Google Play (Android)
 * 
 * 特点：
 * - 几何化主体 + 动态渐变背景
 * - 适配多种形状裁剪
 * - Material 阴影 (elevation)
 * - 主体居中，留安全边距
 */

import { StylePlugin, StyleColors } from './types';

const config = {
  id: 'material',
  name: 'Material',
  platform: 'Google Play',
  description: '几何化主体 + 动态渐变 + Material 阴影',
  colors: {
    primary: '#4285F4',    // Google 蓝
    secondary: '#8AB4F8',  // 浅蓝
    background: '#FFFFFF',
    accent: '#FBBC04',     // Google 黄
  },
};

function buildSvg(iconContent: string, colors: StyleColors): string {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 动态渐变背景 -->
    <linearGradient id="bg-material" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}"/>
      <stop offset="100%" stop-color="${colors.secondary}"/>
    </linearGradient>
    <!-- Material elevation 阴影 -->
    <filter id="elevation-material" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.2"/>
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.14"/>
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- 背景圆角矩形 -->
  <rect x="10" y="10" width="100" height="100" rx="20" fill="url(#bg-material)"/>
  <!-- 顶部光泽 -->
  <ellipse cx="60" cy="30" rx="40" ry="20" fill="#fff" opacity="0.2"/>
  <!-- 主体容器 - 确保居中 -->
  <g transform="translate(60, 60)">
    <g transform="translate(-60, -60)" filter="url(#elevation-material)">${iconContent}</g>
  </g>
</svg>`;
}

function getPrompt(mainBody: string, colors: StyleColors): string {
  return `你是 Google Material 设计师。绘制 "${mainBody}" 的几何化图形。

风格要求：
- 使用白色 #fff 作为主体色
- 几何化简化，用基础形状组合
- 可添加 ${colors.accent} 作为点缀色
- 保持边缘清晰，适合多种裁剪形状
- 【重要】主体必须居中在坐标 (60, 60) 附近

规则:
1. 只输出 SVG 图形元素 (path, circle, rect, ellipse)
2. 图形中心点在 (60, 60)，范围 35-85
3. 主体占图标 60-70% 面积
4. 直接输出代码，无解释

示例 - 音符:
<circle cx="50" cy="70" r="10" fill="#fff"/>
<circle cx="70" cy="65" r="10" fill="#fff"/>
<rect x="58" y="35" width="4" height="35" rx="2" fill="#fff"/>
<path d="M62 35 Q78 30 78 45 Q78 55 62 50" fill="#fff"/>`;
}

const materialStyle: StylePlugin = {
  config,
  buildSvg,
  getPrompt,
};

export default materialStyle;
