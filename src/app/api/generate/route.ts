import { NextRequest, NextResponse } from 'next/server';
import { generateIconSVG } from '@/lib/ai';
import { db } from '@/lib/db';
import { icons } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style = 'outline', name } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const svgContent = await generateIconSVG(prompt, style);

    if (!svgContent) {
      return NextResponse.json({ error: 'Failed to generate icon' }, { status: 500 });
    }

    // 保存到数据库
    const [icon] = await db.insert(icons).values({
      name: name || prompt.slice(0, 50),
      prompt,
      svgContent: svgContent,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      icon: {
        id: icon.id,
        name: icon.name,
        svgContent: icon.svgContent,
      }
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}