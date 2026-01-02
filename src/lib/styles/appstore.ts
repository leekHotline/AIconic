/**
 * App Store 风格 - 数字静物摄影 (Apple)
 * 
 * 特点：
 * - 居中主体 + 柔光 + 浅背景 + 微投影
 * - 主体占 60-70% 面积
 * - 避免描边，用色彩对比
 * - 如同桌面静物摄影
 */

import { StylePlugin, StyleColors } from './types';

const config = {
  id: 'appstore',
  name: '数字静物',
  platform: 'App Store',
  description: '柔光 + 浅背景 + 微投影，如同桌面静物摄影',
  colors: {
    primary: '#007AFF',    // Apple 蓝
    secondary: '#5856D6',  // 紫
    background: '#F5F5F7', // 浅灰
    accent: '#FFFFFF',
  },
};

function buildSvg(iconContent: string, colors: StyleColors): string {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 柔和的背景渐变 -->
    <linearGradient id="bg-appstore" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="${colors.background}"/>
    </linearGradient>
    <!-- 柔光效果 -->
    <filter id="softLight-appstore" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
      <feOffset in="blur" dx="0" dy="2" result="shadow"/>
      <feFlood flood-color="#000" flood-opacity="0.08"/>
      <feComposite in2="shadow" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <!-- 主体光晕 -->
    <filter id="glow-appstore" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feFlood flood-color="${colors.primary}" flood-opacity="0.15"/>
      <feComposite in2="blur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- 背景 -->
  <rect x="10" y="10" width="100" height="100" rx="22" fill="url(#bg-appstore)"/>
  <!-- 顶部高光 -->
  <rect x="10" y="10" width="100" height="35" rx="22" fill="#fff" opacity="0.6"/>
  <!-- 主体容器 - 确保居中 -->
  <g transform="translate(60, 60)">
    <g transform="translate(-60, -60)" filter="url(#softLight-appstore)">
      <g filter="url(#glow-appstore)">${iconContent}</g>
    </g>
  </g>
</svg>`;
}

function getPrompt(mainBody: string, colors: StyleColors): string {
  return `你是 Apple 设计师。绘制 "${mainBody}" 的静物风格图形。

风格要求：
- 主体用品牌色 ${colors.primary}，带柔和渐变
- 无描边，用色彩明暗区分层次
- 简化细节，保留可识别轮廓
- 添加微弱的立体感（用浅色表示高光面）
- 【重要】主体必须居中在坐标 (60, 60) 附近

规则:
1. 只输出 SVG 图形元素 (path, circle, rect, ellipse)
2. 图形中心点在 (60, 60)，范围 35-85
3. 主体占图标 60-70% 面积
4. 直接输出代码，无解释

示例 - 相机镜头:
<circle cx="60" cy="60" r="24" fill="${colors.primary}"/>
<circle cx="60" cy="60" r="18" fill="#fff"/>
<circle cx="60" cy="60" r="12" fill="${colors.secondary}"/>
<ellipse cx="55" cy="55" rx="4" ry="3" fill="#fff" opacity="0.6"/>`;
}

const appstoreStyle: StylePlugin = {
  config,
  buildSvg,
  getPrompt,
};

export default appstoreStyle;
