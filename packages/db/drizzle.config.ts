import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  dialect: 'postgresql',
  out: './migrations',
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5432/app_db',
  },
  migrations: {
    prefix: 'unix',
  },
});
