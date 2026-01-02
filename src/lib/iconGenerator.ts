import OpenAI from 'openai';
import { getStylePlugin, STYLE_CONFIGS, StyleConfig } from './styles';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL,
});

// ============================================
// 高质量 App 图标生成器
// 使用插件化风格系统
// ============================================

/**
 * 从主体生成图标
 */
export async function generateIconFromMainBody(params: {
  mainBody: string;
  style: string;
}): Promise<string | null> {
  const { mainBody, style } = params;
  
  // 获取风格插件
  const plugin = getStylePlugin(style);
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
