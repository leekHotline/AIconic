/**
 * ============================================
 * 工具函数 (Tools)
 * ============================================
 * 
 * 这是 Agent 可以调用的工具集合。
 * 
 * 工作流程:
 * 1. 在这里定义工具函数 (export)
 * 2. 在 agent.ts 的 toolDefinitions 中声明工具 (告诉 AI 有哪些工具可用)
 * 3. 在 agent.ts 的 toolFunctions 中映射工具 (实际执行的函数)
 * 
 * Agent 调用流程:
 * 用户输入 → AI 分析 → 选择工具 → 执行工具函数 → 返回结果
 */

import OpenAI from 'openai';
import { db } from './db';
import { icons } from '@/db/schema';
import { eq, desc, like } from 'drizzle-orm';
import { generateIconFromMainBody, COLOR_SCHEMES } from './iconGenerator';
import type { InferInsertModel } from 'drizzle-orm';

type NewIcon = InferInsertModel<typeof icons>;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL,
});

// ============================================
// 工具 1: 分析图标主体元素
// ============================================
/**
 * 根据用户的抽象描述，分析出具体的视觉主体元素
 * 
 * 就像好的摄影作品需要突出主体一样，
 * 好的图标也需要一个清晰的视觉焦点。
 * 
 * 示例:
 * - "安全" → 盾牌、锁、钥匙
 * - "金融" → 硬币、金条、钱包
 * - "云存储" → 云朵、服务器、上传箭头
 * - "社交" → 对话气泡、人物、连接
 * 
 * @param params.userPrompt - 用户的抽象描述
 * @returns 具体的主体元素列表
 */
export async function analyzeIconMainBody(params: {
  userPrompt: string;
}): Promise<{
  success: boolean;
  mainBodies?: string[];
  reasoning?: string;
  error?: string;
}> {
  const { userPrompt } = params;

  console.log(`[Tool:analyzeIconMainBody] 分析: "${userPrompt}"`);

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-5.1',
      messages: [
        {
          role: 'system',
          content: `你是图标设计专家。根据用户的抽象概念，分析出 4 个最适合的视觉主体元素。

规则:
1. 选择简洁、易识别的几何形状
2. 每个主体元素用 2-4 个字描述
3. 按视觉表现力排序
4. 返回 JSON 格式

示例:
用户: "安全防护"
输出: {"mainBodies": ["盾牌", "锁", "钥匙", "城墙"], "reasoning": "安全概念最直观的视觉符号"}

用户: "云存储"  
输出: {"mainBodies": ["云朵", "服务器", "上传箭头", "文件夹"], "reasoning": "云和存储的组合意象"}

用户: "金融理财"
输出: {"mainBodies": ["硬币", "金条", "钱包", "增长曲线"], "reasoning": "财富和增值的视觉符号"}`
        },
        {
          role: 'user',
          content: `分析 "${userPrompt}" 的视觉主体元素:`
        }
      ],
      temperature: 0.5,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content);

    if (!result.mainBodies || result.mainBodies.length === 0) {
      return {
        success: false,
        error: '无法分析出主体元素',
      };
    }

    console.log(`[Tool:analyzeIconMainBody] 结果: ${result.mainBodies.join(', ')}`);

    return {
      success: true,
      mainBodies: result.mainBodies,
      reasoning: result.reasoning,
    };

  } catch (error) {
    console.error('[Tool:analyzeIconMainBody] 错误:', error);
    return {
      success: false,
      error: '分析失败，请重试',
    };
  }
}

// ============================================
// 工具 2: 根据主体元素生成图标
// ============================================
/**
 * 根据分析出的主体元素，生成高质量 SVG 图标
 * 
 * @param params.mainBody - 主体元素 (如 "盾牌")
 * @param params.style - 风格 (appstore/material/fluent/neon)
 * @returns SVG 图标代码
 */
export async function generateIconByMainBody(params: {
  mainBody: string;
  style: 'appstore' | 'material' | 'fluent' | 'neon';
}): Promise<{
  success: boolean;
  svg?: string;
  mainBody?: string;
  style?: string;
  styleName?: string;
  error?: string;
}> {
  const { mainBody, style = 'neon' } = params;
  const config = COLOR_SCHEMES[style] || COLOR_SCHEMES.neon;

  console.log(`[Tool:generateIconByMainBody] 生成: ${mainBody}, 风格: ${config.name}`);

  const svg = await generateIconFromMainBody({
    mainBody,
    style,
  });

  if (!svg) {
    return { success: false, error: '生成失败' };
  }

  return {
    success: true,
    svg,
    mainBody,
    style,
    styleName: config.name,
  };
}

// ============================================
// 工具 3: 一键生成多种风格图标
// ============================================
/**
 * 根据主体元素，一次性生成多种平台风格的图标
 * 
 * @param params.mainBody - 单个主体元素（兼容旧逻辑）
 * @param params.mainBodies - 多个主体元素，每个风格用不同主体
 * @param params.styles - 可选的风格列表，默认为 4 种基础风格
 * @returns 多个不同风格的 SVG 图标
 */
export async function generateIconSet(params: {
  mainBody?: string;
  mainBodies?: string[];
  styles?: string[];
}): Promise<{
  success: boolean;
  icons?: Array<{ svg: string; style: string; styleName: string; platform: string; mainBody: string }>;
  error?: string;
}> {
  const { mainBody, mainBodies, styles: customStyles } = params;

  // 使用自定义风格或默认风格
  const stylesToUse = customStyles && customStyles.length > 0 
    ? customStyles 
    : ['appstore', 'material', 'fluent', 'neon'];

  // 确定每个风格使用的主体
  // 如果有 mainBodies 数组，每个风格用不同主体；否则都用同一个 mainBody
  const bodies = mainBodies && mainBodies.length > 0 ? mainBodies : [mainBody || '图标'];
  
  console.log(`[Tool:generateIconSet] 批量生成: ${bodies.join(', ')} (${stylesToUse.length} 种风格)`);
  
  const results = await Promise.all(
    stylesToUse.map(async (style, index) => {
      const config = COLOR_SCHEMES[style];
      if (!config) {
        console.warn(`[Tool:generateIconSet] 未知风格: ${style}`);
        return null;
      }
      // 循环使用主体列表，如果主体数量少于风格数量则循环
      const bodyForStyle = bodies[index % bodies.length];
      const svg = await generateIconFromMainBody({ mainBody: bodyForStyle, style });
      return {
        svg: svg || '',
        style,
        styleName: config.name,
        platform: config.platform,
        mainBody: bodyForStyle,
      };
    })
  );

  const validIcons = results.filter((r): r is NonNullable<typeof r> => r !== null && r.svg !== '');

  if (validIcons.length === 0) {
    return { success: false, error: '生成失败' };
  }

  return {
    success: true,
    icons: validIcons,
  };
}

// ============================================
// 工具 4: 保存图标
// ============================================
export async function saveIcon(params: {
  name: string;
  svgContent: string;
  prompt: string;
  style: string;
}) {
  const [icon] = await db.insert(icons).values({
    name: params.name,
    svgContent: params.svgContent,
    prompt: params.prompt,
    style: params.style,
  } as NewIcon).returning();
  
  return { success: true, iconId: icon.id, message: `图标 "${params.name}" 已保存` };
}

// ============================================
// 工具 5: 搜索图标
// ============================================
export async function searchIcons(params: { keyword: string }) {
  const results = await db.select()
    .from(icons)
    .where(like(icons.name, `%${params.keyword}%`))
    .limit(10);
  
  return { 
    success: true, 
    count: results.length,
    icons: results.map(i => ({ id: i.id, name: i.name, style: i.style }))
  };
}

// ============================================
// 工具 6: 获取最近图标
// ============================================
export async function getRecentIcons(params: { limit?: number }) {
  const results = await db.select()
    .from(icons)
    .orderBy(desc(icons.createdAt))
    .limit(params.limit || 5);
  
  return {
    success: true,
    icons: results.map(i => ({ id: i.id, name: i.name, style: i.style, svgContent: i.svgContent }))
  };
}

// ============================================
// 工具 7: 删除图标
// ============================================
export async function deleteIcon(params: { iconId: string }) {
  await db.delete(icons).where(eq(icons.id, params.iconId));
  return { success: true, message: '图标已删除' };
}
