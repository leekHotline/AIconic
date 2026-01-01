import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// 明确指定读取 .env.local
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error("database connection url is not in the env file")
}


export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});