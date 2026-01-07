import OpenAI from 'openai';
import { getStylePlugin, STYLE_CONFIGS, StyleConfig, registerStyle, StylePlugin, StyleColors } from './styles';
import { db } from './db';
import { communityStyles } from '@/db/schema';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL,
});

// ============================================
// 高质量 App 图标生成器
// 使用插件化风格系统
// ============================================

/**
 * 从数据库加载社区风格并注册
 */
export async function loadCommunityStyles(): Promise<void> {
  try {
    const styles = await db.select().from(communityStyles);
    
    for (const style of styles) {
      const colors = style.colors as StyleColors;
      const svgTemplate = style.svgTemplate;
      
      // 创建动态插件
      const plugin: StylePlugin = {
        config: {
          id: style.id,
          name: style.name,
          platform: style.platform || 'Community',
          description: style.description || '',
          colors,
        },
        buildSvg: (iconContent: string, c: StyleColors) => {
          // 替换模板中的变量
          return svgTemplate
            .replace(/\$\{iconContent\}/g, iconContent)
            .replace(/\$\{colors\.primary\}/g, c.primary)
            .replace(/\$\{colors\.secondary\}/g, c.secondary)
            .replace(/\$\{colors\.background\}/g, c.background)
            .replace(/\$\{colors\.accent\}/g, c.accent);
        },
        getPrompt: (mainBody: string, c: StyleColors) => {
          return `你是图标设计师。绘制 "${mainBody}" 的图形。
主色: ${c.primary}，次色: ${c.secondary}
规则:
1. 只输出 SVG 图形元素 (path, circle, rect, ellipse)
2. 图形中心点在 (60, 60)，范围 35-85
3. 主体占图标 60-70% 面积
4. 直接输出代码，无解释`;
        },
      };
      
      registerStyle(plugin);
      console.log(`[IconGen] 加载社区风格: ${style.name} (${style.id})`);
    }
  } catch (error) {
    console.error('[IconGen] 加载社区风格失败:', error);
  }
}

/**
 * 从主体生成图标
 */
export async function generateIconFromMainBody(params: {
  mainBody: string;
  style: string;
}): Promise<string | null> {
  const { mainBody, style } = params;
  
  // 尝试加载社区风格（如果还没加载）
  let plugin = getStylePlugin(style);
  if (!plugin) {
    await loadCommunityStyles();
    plugin = getStylePlugin(style);
  }
  
  if (!plugin) {
    console.error(`[IconGen] 未找到风格: ${style}`);
    return null;
  }
  
  const { config, buildSvg, getPrompt } = plugin;
  
  console.log(`[IconGen] 生成 ${config.platform} 风格图标 - 主体: ${mainBody}`);

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-5.1',
      messages: [
        { 
          role: 'system', 
          content: getPrompt(mainBody, config.colors)
        },
        { 
          role: 'user', 
          content: `绘制 "${mainBody}":` 
        }
      ],
      temperature: 0.6,
      max_tokens: 600,
    });

    let iconContent = response.choices[0]?.message?.content || '';
    
    // 清理响应
    iconContent = iconContent
      .replace(/```(?:svg|xml)?\s*/gi, '')
      .replace(/```/g, '')
      .replace(/<svg[^>]*>/gi, '')
      .replace(/<\/svg>/gi, '')
      .trim();

    // 如果内容太短，使用默认图形
    if (!iconContent || iconContent.length < 20) {
      iconContent = `<circle cx="60" cy="60" r="20" fill="${config.colors.primary}"/>`;
    }

    // 使用插件构建完整 SVG
    return buildSvg(iconContent, config.colors);

  } catch (error) {
    console.error('[IconGen] 生成失败:', error);
    
    // 返回默认图标
    const fallback = `<circle cx="60" cy="60" r="20" fill="${config.colors.primary}"/>`;
    return buildSvg(fallback, config.colors);
  }
}

/**
 * 兼容旧接口
 */
export async function generateHighQualitySvg(params: {
  description: string;
  style: string;
  primaryColor?: string;
  secondaryColor?: string;
}): Promise<string | null> {
  return generateIconFromMainBody({
    mainBody: params.description,
    style: params.style,
  });
}

// 导出配色方案供其他模块使用
export { STYLE_CONFIGS, COLOR_SCHEMES } from './styles';
export type { StyleConfig } from './styles';
