import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { icons } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allIcons = await db.select().from(icons).orderBy(desc(icons.createdAt));
    return NextResponse.json({ icons: allIcons });
  } catch (error) {
    console.error('Fetch icons error:', error);
    return NextResponse.json({ error: 'Failed to fetch icons' }, { status: 500 });
  }
}