/**
 * Fluent 风格 - Microsoft Store (Windows)
 * 
 * 特点：
 * - 清晰轮廓 + 光影方向 + 等距感
 * - 2px+ 描边或色块对比
 * - 从左上角打光
 * - Mica 背景效果
 */

import { StylePlugin, StyleColors } from './types';

const config = {
  id: 'fluent',
  name: 'Fluent',
  platform: 'Microsoft',
  description: '清晰轮廓 + 左上光源 + 等距插画感',
  colors: {
    primary: '#0078D4',    // Microsoft 蓝
    secondary: '#50E6FF',  // 浅蓝
    background: '#F3F3F3',
    accent: '#FFB900',     // 黄
  },
};

function buildSvg(iconContent: string, colors: StyleColors): string {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Fluent 渐变（左上到右下光源） -->
    <linearGradient id="bg-fluent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAFAFA"/>
      <stop offset="100%" stop-color="${colors.background}"/>
    </linearGradient>
    <!-- 左上光源效果 -->
    <linearGradient id="light-fluent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <!-- Fluent 阴影 -->
    <filter id="shadow-fluent" x="-10%" y="-10%" width="130%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000" flood-opacity="0.15"/>
    </filter>
    <!-- 主体描边效果 -->
    <filter id="outline-fluent" x="-5%" y="-5%" width="110%" height="110%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="expanded"/>
      <feFlood flood-color="${colors.primary}" flood-opacity="0.3"/>
      <feComposite in2="expanded" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- 背景 -->
  <rect x="10" y="10" width="100" height="100" rx="16" fill="url(#bg-fluent)" filter="url(#shadow-fluent)"/>
  <!-- 左上光源高光 -->
  <rect x="10" y="10" width="100" height="100" rx="16" fill="url(#light-fluent)"/>
  <!-- 主体容器 - 确保居中 -->
  <g transform="translate(60, 60)">
    <g transform="translate(-60, -60)" filter="url(#outline-fluent)">${iconContent}</g>
  </g>
</svg>`;
}

function getPrompt(mainBody: string, colors: StyleColors): string {
  return `你是 Microsoft Fluent 设计师。绘制 "${mainBody}" 的插画风格图形。

风格要求：
- 主体用 ${colors.primary}，高光用 ${colors.secondary}
- 清晰的 2px 轮廓感（用色块对比实现）
- 左上角是光源方向，右下较暗
- 可用等距视角增加立体感
- 【重要】主体必须居中在坐标 (60, 60) 附近

规则:
1. 只输出 SVG 图形元素 (path, circle, rect, ellipse)
2. 图形中心点在 (60, 60)，范围 35-85
3. 主体占图标 60-70% 面积
4. 直接输出代码，无解释

示例 - 文档:
<rect x="42" y="35" width="35" height="45" rx="3" fill="${colors.primary}"/>
<rect x="44" y="37" width="31" height="10" fill="${colors.secondary}" opacity="0.5"/>
<rect x="47" y="52" width="25" height="3" rx="1" fill="#fff" opacity="0.8"/>
<rect x="47" y="58" width="20" height="3" rx="1" fill="#fff" opacity="0.6"/>
<rect x="47" y="64" width="15" height="3" rx="1" fill="#fff" opacity="0.4"/>`;
}

const fluentStyle: StylePlugin = {
  config,
  buildSvg,
  getPrompt,
};

export default fluentStyle;
