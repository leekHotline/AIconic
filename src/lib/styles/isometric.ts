/**
 * Isometric 风格 - 等距立体 (3D Illustration)
 * 
 * 特点：
 * - 等距投影视角 (30度角)
 * - 立体几何形状
 * - 清晰的面与边界
 * - 丰富的色彩层次
 * - 适合科技、游戏、教育类应用
 */

import { StylePlugin, StyleColors } from './types';

const config = {
  id: 'isometric',
  name: '等距立体',
  platform: '3D Illustration',
  description: '等距投影 + 立体几何 + 丰富色彩层次',
  colors: {
    primary: '#4F46E5',    // 靛蓝
    secondary: '#818CF8',  // 浅靛蓝
    background: '#F8FAFF', // 极浅蓝
    accent: '#F59E0B',     // 琥珀黄
  },
};

function buildSvg(iconContent: string, colors: StyleColors): string {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 背景渐变 -->
    <linearGradient id="bg-iso" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EEF2FF"/>
      <stop offset="100%" stop-color="#E0E7FF"/>
    </linearGradient>
    
    <!-- 顶面渐变（最亮） -->
    <linearGradient id="top-face-iso" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.secondary}"/>
      <stop offset="100%" stop-color="${colors.primary}"/>
    </linearGradient>
    
    <!-- 左面渐变（中等亮度） -->
    <linearGradient id="left-face-iso" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${colors.primary}"/>
      <stop offset="100%" stop-color="#3730A3"/>
    </linearGradient>
    
    <!-- 右面渐变（最暗） -->
    <linearGradient id="right-face-iso" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3730A3"/>
      <stop offset="100%" stop-color="#312E81"/>
    </linearGradient>
    
    <!-- 底部阴影 -->
    <filter id="shadow-iso" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="4" dy="8" stdDeviation="6" flood-color="#4F46E5" flood-opacity="0.25"/>
    </filter>
    
    <!-- 高光效果 -->
    <filter id="highlight-iso" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="-1" dy="-1" stdDeviation="1" flood-color="#fff" flood-opacity="0.5"/>
    </filter>
    
    <!-- 网格图案 -->
    <pattern id="grid-iso" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="${colors.primary}" stroke-width="0.3" opacity="0.2"/>
    </pattern>
  </defs>
  
  <!-- 背景 -->
  <rect x="10" y="10" width="100" height="100" rx="20" fill="url(#bg-iso)"/>
  
  <!-- 装饰性网格 -->
  <rect x="10" y="10" width="100" height="100" rx="20" fill="url(#grid-iso)" opacity="0.5"/>
  
  <!-- 等距底座平台 -->
  <g filter="url(#shadow-iso)">
    <!-- 顶面 -->
    <polygon points="60,75 85,62 60,49 35,62" fill="url(#top-face-iso)" opacity="0.3"/>
    <!-- 左面 -->
    <polygon points="35,62 60,75 60,82 35,69" fill="url(#left-face-iso)" opacity="0.2"/>
    <!-- 右面 -->
    <polygon points="85,62 60,75 60,82 85,69" fill="url(#right-face-iso)" opacity="0.2"/>
  </g>
  
  <!-- 主体容器 -->
  <g transform="translate(60, 55)">
    <g transform="translate(-60, -55)" filter="url(#highlight-iso)">${iconContent}</g>
  </g>
</svg>`;
}

function getPrompt(mainBody: string, colors: StyleColors): string {
  return `你是一位精通等距投影（Isometric）插画风格的设计师。请为 "${mainBody}" 绘制一个立体感十足的等距图形。

## 设计风格要求

### 等距投影原理
- 使用 30 度角的等距投影视角
- 物体的三个可见面：顶面、左面、右面
- 顶面最亮，左面中等，右面最暗

### 色彩运用
- 顶面：使用 ${colors.secondary} 或 url(#top-face-iso)
- 左面：使用 ${colors.primary} 或 url(#left-face-iso)  
- 右面：使用较深的颜色 #3730A3 或 url(#right-face-iso)
- 点缀色：${colors.accent} 用于高亮细节

### 形态特征
- 将物体几何化，用简单的立方体、圆柱体等组合
- 边缘清晰，面与面之间有明确的分界
- 保持等距投影的一致性
- 可以堆叠多个几何体来表现复杂物体

### 构图要求
- 【重要】主体中心在坐标 (60, 55) 附近（略高于中心，因为有底座）
- 主体占图标 50-65% 面积
- 图形要有明显的立体感和空间感

## 技术规则
1. 只输出 SVG 图形元素 (path, polygon, circle, rect, ellipse)
2. 图形中心点在 (60, 55)，有效范围 35-85 (x), 30-75 (y)
3. 使用 polygon 来绘制等距面
4. 直接输出代码，无需任何解释或注释

## 等距立方体模板:
<!-- 顶面 -->
<polygon points="60,30 80,42 60,54 40,42" fill="${colors.secondary}"/>
<!-- 左面 -->
<polygon points="40,42 60,54 60,70 40,58" fill="${colors.primary}"/>
<!-- 右面 -->
<polygon points="80,42 60,54 60,70 80,58" fill="#3730A3"/>

## 参考示例 - 文件夹:
<!-- 文件夹底部 -->
<polygon points="60,40 82,52 60,64 38,52" fill="${colors.secondary}"/>
<polygon points="38,52 60,64 60,72 38,60" fill="${colors.primary}"/>
<polygon points="82,52 60,64 60,72 82,60" fill="#3730A3"/>
<!-- 文件夹标签 -->
<polygon points="42,48 55,42 55,46 42,52" fill="${colors.accent}"/>

## 参考示例 - 服务器:
<!-- 底层 -->
<polygon points="60,55 78,45 60,35 42,45" fill="${colors.secondary}"/>
<polygon points="42,45 60,55 60,62 42,52" fill="${colors.primary}"/>
<polygon points="78,45 60,55 60,62 78,52" fill="#3730A3"/>
<!-- 中层 -->
<polygon points="60,48 78,38 60,28 42,38" fill="${colors.secondary}"/>
<polygon points="42,38 60,48 60,55 42,45" fill="${colors.primary}"/>
<polygon points="78,38 60,48 60,55 78,45" fill="#3730A3"/>
<!-- 指示灯 -->
<circle cx="48" cy="47" r="2" fill="${colors.accent}"/>
<circle cx="48" cy="40" r="2" fill="#22C55E"/>`;
}

const isometricStyle: StylePlugin = {
  config,
  buildSvg,
  getPrompt,
};

export default isometricStyle;
