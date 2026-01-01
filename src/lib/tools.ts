// 工具函数实现
import { db } from './db';
import { icons } from '@/db/schema';
import { eq, desc, like } from 'drizzle-orm';
import { generateHighQualitySvg } from './iconGenerator';

// 1. 生成高质量 SVG 图标
export async function generateSvgIcon(params: { 
  description: string; 
  style: 'modern' | 'gradient' | 'glassmorphism' | 'neon' | 'minimal';
  primaryColor?: string;
  secondaryColor?: string;
}) {
  const { description, style = 'gradient', primaryColor, secondaryColor } = params;
  
  const svg = await generateHighQualitySvg({
    description,
    style,
    primaryColor,
    secondaryColor,
  });

  if (!svg) {
    return { success: false, error: '生成失败，请重试' };
  }

  return { success: true, svg, description, style };
}

// 2. 保存图标到数据库
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
  }).returning();
  
  return { success: true, iconId: icon.id, message: `图标 "${params.name}" 已保存` };
}

// 3. 搜索已保存的图标
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

// 4. 获取最近的图标
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

// 5. 删除图标
export async function deleteIcon(params: { iconId: string }) {
  await db.delete(icons).where(eq(icons.id, params.iconId));
  return { success: true, message: `图标已删除` };
}

// 6. 修改图标颜色
export async function changeIconColor(params: { svgContent: string; newColor: string }) {
  const newSvg = params.svgContent
    .replace(/stroke="[^"]*"/g, `stroke="${params.newColor}"`)
    .replace(/fill="(?!none)[^"]*"/g, `fill="${params.newColor}"`);
  
  return { success: true, svg: newSvg, color: params.newColor };
}
