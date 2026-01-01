import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  baseURL: process.env.ANTHROPIC_BASE_URL,
});

export async function generateIconSVG(prompt: string, style: string = 'outline') {
  const systemPrompt = `You are an expert icon designer. Generate clean, scalable SVG icons for commercial use.
Rules:
- Output ONLY valid SVG code, no explanations
- Use viewBox="0 0 24 24" for consistency
- Style: ${style} (outline/filled/duotone)
- Use currentColor for fills/strokes to allow color customization
- Keep paths simple and optimized
- No external dependencies or fonts`;

  const { text } = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    prompt: `Create a ${style} style icon for: ${prompt}`,
  });

  // 提取SVG代码
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
  return svgMatch ? svgMatch[0] : null;
}