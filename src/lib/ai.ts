import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL,
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

  const response = await client.chat.completions.create({
    model: 'gpt-5.1',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Create a ${style} style icon for: ${prompt}` }
    ],
  });

  const text = response.choices[0]?.message?.content || '';
  
  // 提取SVG代码
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
  return svgMatch ? svgMatch[0] : null;
}
