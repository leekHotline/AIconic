import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sessions, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

// 获取所有会话列表（按用户过滤）
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ sessions: [] });
    }
    
    // 获取用户 ID
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    
    if (!user) {
      return NextResponse.json({ sessions: [] });
    }
    
    const allSessions = await db.select()
      .from(sessions)
      .where(eq(sessions.userId, user.id))
      .orderBy(desc(sessions.updatedAt))
      .limit(50);
    
    return NextResponse.json({ sessions: allSessions });
  } catch (error) {
    console.error('Failed to get sessions:', error);
    return NextResponse.json({ sessions: [], error: 'Database error' }, { status: 200 });
  }
}

// 创建新会话
export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    const authSession = await getServerSession();
    
    let userId = null;
    
    if (authSession?.user?.email) {
      const [user] = await db.select().from(users).where(eq(users.email, authSession.user.email)).limit(1);
      if (user) userId = user.id;
    }
    
    const [session] = await db.insert(sessions)
      .values({ 
        title: title || '新会话',
        userId,
      })
      .returning();
    
    return NextResponse.json({ session });
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
