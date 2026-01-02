/**
 * 图标风格插件类型定义
 */

export interface StyleColors {
  primary: string;
  secondary: string;
  background: string;
  accent: string;
}

export interface StyleConfig {
  id: string;
  name: string;
  platform: string;
  description: string;
  colors: StyleColors;
}

export interface StylePlugin {
  config: StyleConfig;
  buildSvg: (iconContent: string, colors: StyleColors) => string;
  getPrompt: (mainBody: string, colors: StyleColors) => string;
}
