/**
 * 图标风格插件注册中心
 * 
 * 使用方式：
 * 1. 创建新风格文件 (如 myStyle.ts)
 * 2. 实现 StylePlugin 接口
 * 3. 在此文件导入并注册
 */

import { StylePlugin, StyleConfig } from './types';

// 导入所有风格插件
import appstoreStyle from './appstore';
import materialStyle from './material';
import fluentStyle from './fluent';
import neonStyle from './neon';
import glassmorphismStyle from './glassmorphism';
import neumorphismStyle from './neumorphism';
import isometricStyle from './isometric';
import gradientStyle from './gradient';

// 风格插件注册表
const stylePlugins: Map<string, StylePlugin> = new Map();

// 注册内置风格（默认4个 + 新增4个）
stylePlugins.set('appstore', appstoreStyle);
stylePlugins.set('material', materialStyle);
stylePlugins.set('fluent', fluentStyle);
stylePlugins.set('neon', neonStyle);
stylePlugins.set('glassmorphism', glassmorphismStyle);
stylePlugins.set('neumorphism', neumorphismStyle);
stylePlugins.set('isometric', isometricStyle);
stylePlugins.set('gradient', gradientStyle);

/**
 * 获取风格插件
 */
export function getStylePlugin(styleId: string): StylePlugin | undefined {
  return stylePlugins.get(styleId);
}

/**
 * 获取所有已注册的风格
 */
export function getAllStyles(): StyleConfig[] {
  return Array.from(stylePlugins.values()).map(plugin => plugin.config);
}

/**
 * 获取所有风格 ID
 */
export function getStyleIds(): string[] {
  return Array.from(stylePlugins.keys());
}

/**
 * 注册新风格插件
 */
export function registerStyle(plugin: StylePlugin): void {
  stylePlugins.set(plugin.config.id, plugin);
}

/**
 * 检查风格是否存在
 */
export function hasStyle(styleId: string): boolean {
  return stylePlugins.has(styleId);
}

// 导出类型
export type { StylePlugin, StyleConfig, StyleColors } from './types';

// 导出默认风格配置（兼容旧代码）
export const STYLE_CONFIGS: Record<string, StyleConfig> = Object.fromEntries(
  Array.from(stylePlugins.entries()).map(([id, plugin]) => [id, plugin.config])
);

export const COLOR_SCHEMES = STYLE_CONFIGS;
