import { db } from "@/lib/db";
import { communityStyles } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// 获取所有社区风格
export async function GET() {
  try {
    const styles = await db.select().from(communityStyles);
    
    return NextResponse.json({
      success: true,
      styles: styles.map(s => ({
        id: s.id,
        name: s.name,
        platform: s.platform,
        description: s.description,
        colors: s.colors,
        svgTemplate: s.svgTemplate,
      })),
    });
  } catch (error) {
    console.error('Get community styles failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to get styles' }, { status: 500 });
  }
}

// 创建新风格（备用 API，主要通过 Agent 工具调用）
export async function POST(request: NextRequest) {
  try {
    const { id, name, platform, description, colors, svgTemplate } = await request.json();

    if (!id || !name || !colors || !svgTemplate) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 检查是否已存在
    const existing = await db.select().from(communityStyles).where(eq(communityStyles.id, id)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'Style already exists' }, { status: 409 });
    }

    // 插入数据库
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db.insert(communityStyles) as any).values({
      id,
      name,
      platform: platform || 'Community',
      description: description || '',
      colors,
      svgTemplate,
    });

    return NextResponse.json({ success: true, styleId: id });
  } catch (error) {
    console.error('Create style plugin failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to create style' }, { status: 500 });
  }
}

// 删除风格
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Style ID required' }, { status: 400 });
    }

    await db.delete(communityStyles).where(eq(communityStyles.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete style failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete style' }, { status: 500 });
  }
}
