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
        try {
          const existing = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
          
          if (existing.length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (db.insert(users) as any).values({
              email: user.email,
              name: user.name ?? null,
              avatar: user.image ?? null,
              provider: 'google',
              providerId: account.providerAccountId,
            });
          }
        } catch (error) {
          console.error('Error saving user:', error);
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          const [dbUser] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
          if (dbUser) {
            session.user.id = dbUser.id;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
