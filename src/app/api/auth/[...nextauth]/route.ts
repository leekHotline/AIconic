import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        // 检查用户是否存在，不存在则创建
        const existing = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
        
        if (existing.length === 0) {
          await db.insert(users).values({
            email: user.email,
            name: user.name || '',
            avatar: user.image || '',
            provider: 'google',
            providerId: account.providerAccountId,
          });
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const [dbUser] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
