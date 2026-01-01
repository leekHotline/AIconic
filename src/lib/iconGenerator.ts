import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function generateHighQualitySvg(params: {
  description: string;
  style: 'modern' | 'gradient' | 'glassmorphism' | 'neon' | 'minimal';
  primaryColor?: string;
  secondaryColor?: string;
}) {
  const { description, style, primaryColor = '#6366f1', secondaryColor = '#8b5cf6' } = params;

  const systemPrompt = `你是一位世界级的 SVG 图标设计师，专门为科技创新公司和个人开发者设计现代化应用图标。

设计原则：
1. 现代化、简洁、专业
2. 适合作为 App 图标或品牌标识
3. 使用渐变色增加深度和质感
4. 支持多种风格：渐变、玻璃态、霓虹、极简

技术要求：
- 输出纯净的 SVG 代码，不要任何解释
- viewBox="0 0 120 120"
- 必须包含 <defs> 定义渐变
- 使用 linearGradient 或 radialGradient
- 可以使用 filter 添加阴影或模糊效果
- 可以使用 opacity 创建层次感
- 路径要简洁优化

渐变色配置：
- 主色: ${primaryColor}
- 副色: ${secondaryColor}

风格说明：
- modern: 现代扁平化，柔和渐变，圆角形状
- gradient: 丰富的多层渐变，有深度感
- glassmorphism: 玻璃态效果，半透明，模糊背景
- neon: 霓虹发光效果，深色背景
- minimal: 极简线条，单色或双色`;

  const userPrompt = `设计一个 ${style} 风格的图标：${description}

要求：
1. 图标要有科技感和创新感
2. 适合作为应用图标
3. 使用渐变色：从 ${primaryColor} 到 ${secondaryColor}
4. 只输出 SVG 代码`;

  const response = await client.chat.completions.create({
    model: 'gpt-5.1',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
  });

  const text = response.choices[0]?.message?.content || '';
  
  // 提取 SVG 代码
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
  return svgMatch ? svgMatch[0] : null;
}
