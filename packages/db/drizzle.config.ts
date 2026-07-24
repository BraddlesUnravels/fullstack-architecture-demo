import { defineConfig } from 'drizzle-kit';
import { getDrizzleMigratorDbCredentials } from './src/helpers';

export default defineConfig({
  schema: './src/schema.ts',
  dialect: 'postgresql',
  out: './migrations',
  verbose: true,
  dbCredentials: getDrizzleMigratorDbCredentials(),
  migrations: {
    prefix: 'unix',
  },
});
