/**
 * Neumorphism 风格 - 新拟态 (Soft UI)
 * 
 * 特点：
 * - 柔和的凸起/凹陷效果
 * - 同色系阴影（亮面+暗面）
 * - 极简的色彩搭配
 * - 触感十足的3D效果
 * - 适合工具类、设置类、健康类应用
 */

import { StylePlugin, StyleColors } from './types';

const config = {
  id: 'neumorphism',
  name: '新拟态',
  platform: 'Soft UI',
  description: '柔和凸起 + 同色系阴影 + 触感3D效果',
  colors: {
    primary: '#6C63FF',    // 主题紫
    secondary: '#A5A1FF',  // 浅紫
    background: '#E8EAF0', // 柔和灰
    accent: '#FF6B9D',     // 点缀粉
  },
};

function buildSvg(iconContent: string, colors: StyleColors): string {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 新拟态背景 -->
    <linearGradient id="bg-neu" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0F2F8"/>
      <stop offset="100%" stop-color="#E0E4EC"/>
    </linearGradient>
    
    <!-- 凸起效果 - 外阴影 -->
    <filter id="raised-neu" x="-30%" y="-30%" width="160%" height="160%">
      <!-- 暗面阴影（右下） -->
      <feDropShadow dx="6" dy="6" stdDeviation="8" flood-color="#B8BCC8" flood-opacity="0.8"/>
      <!-- 亮面高光（左上） -->
      <feDropShadow dx="-6" dy="-6" stdDeviation="8" flood-color="#FFFFFF" flood-opacity="1"/>
    </filter>
    
    <!-- 凹陷效果 - 内阴影 -->
    <filter id="inset-neu" x="-20%" y="-20%" width="140%" height="140%">
      <feOffset dx="2" dy="2" in="SourceAlpha" result="dark"/>
      <feGaussianBlur in="dark" stdDeviation="3" result="darkBlur"/>
      <feFlood flood-color="#B8BCC8" flood-opacity="0.6"/>
      <feComposite in2="darkBlur" operator="in" result="darkShadow"/>
      
      <feOffset dx="-2" dy="-2" in="SourceAlpha" result="light"/>
      <feGaussianBlur in="light" stdDeviation="3" result="lightBlur"/>
      <feFlood flood-color="#FFFFFF" flood-opacity="0.8"/>
      <feComposite in2="lightBlur" operator="in" result="lightShadow"/>
      
      <feMerge>
        <feMergeNode in="darkShadow"/>
        <feMergeNode in="lightShadow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- 主体柔和阴影 -->
    <filter id="soft-shadow-neu" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#B8BCC8" flood-opacity="0.5"/>
      <feDropShadow dx="-1" dy="-1" stdDeviation="1" flood-color="#FFFFFF" flood-opacity="0.8"/>
    </filter>
    
    <!-- 图标渐变 -->
    <linearGradient id="icon-gradient-neu" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}"/>
      <stop offset="100%" stop-color="${colors.secondary}"/>
    </linearGradient>
  </defs>
  
  <!-- 背景层 -->
  <rect x="10" y="10" width="100" height="100" rx="24" fill="url(#bg-neu)"/>
  
  <!-- 凸起的圆形底座 -->
  <circle cx="60" cy="60" r="38" fill="#E8EAF0" filter="url(#raised-neu)"/>
  
  <!-- 内凹的圆形区域 -->
  <circle cx="60" cy="60" r="30" fill="#E4E8F0" filter="url(#inset-neu)"/>
  
  <!-- 主体容器 -->
  <g transform="translate(60, 60)">
    <g transform="translate(-60, -60)" filter="url(#soft-shadow-neu)">${iconContent}</g>
  </g>
</svg>`;
}

function getPrompt(mainBody: string, colors: StyleColors): string {
  return `你是一位精通 Neumorphism（新拟态）设计风格的 UI 设计师。请为 "${mainBody}" 绘制一个具有触感的柔和图形。

## 设计风格要求

### 色彩运用
- 主体使用渐变色，从 ${colors.primary} 到 ${colors.secondary}
- 可以使用 url(#icon-gradient-neu) 作为填充
- 或者使用纯色 ${colors.primary}
- 点缀色可用 ${colors.accent}
- 整体色调要柔和，避免过于鲜艳

### 形态特征
- 图形要有"软糯"的感觉，边缘圆润
- 使用较大的圆角 (rx, ry)
- 形状要简洁，避免过于复杂的细节
- 可以适当使用不同透明度来表现层次

### 立体感表现
- 图形本身不需要添加阴影（外层已有）
- 可以用色彩深浅来暗示立体感
- 高光部分用浅色，阴影部分用深色

### 构图要求
- 【重要】主体必须居中在坐标 (60, 60) 附近
- 主体占图标 50-60% 面积（因为有底座装饰）
- 图形要在圆形区域内，范围约 40-80

## 技术规则
1. 只输出 SVG 图形元素 (path, circle, rect, ellipse, polygon)
2. 图形中心点在 (60, 60)，有效范围 40-80
3. 直接输出代码，无需任何解释或注释

## 参考示例 - 播放按钮:
<path d="M52 45 L52 75 L75 60 Z" fill="url(#icon-gradient-neu)"/>

## 参考示例 - 设置齿轮:
<circle cx="60" cy="60" r="8" fill="${colors.primary}"/>
<circle cx="60" cy="60" r="14" fill="none" stroke="${colors.primary}" stroke-width="4"/>
<circle cx="60" cy="42" r="4" fill="${colors.primary}"/>
<circle cx="60" cy="78" r="4" fill="${colors.primary}"/>
<circle cx="42" cy="60" r="4" fill="${colors.primary}"/>
<circle cx="78" cy="60" r="4" fill="${colors.primary}"/>
<circle cx="47" cy="47" r="3.5" fill="${colors.secondary}"/>
<circle cx="73" cy="47" r="3.5" fill="${colors.secondary}"/>
<circle cx="47" cy="73" r="3.5" fill="${colors.secondary}"/>
<circle cx="73" cy="73" r="3.5" fill="${colors.secondary}"/>`;
}

const neumorphismStyle: StylePlugin = {
  config,
  buildSvg,
  getPrompt,
};

export default neumorphismStyle;
