import { defineConfig } from 'drizzle-kit';

const getDbCredentials = () => {
  const password = process.env.POSTGRES_PASSWORD;
  const user = process.env.POSTGRES_USER;
  const database = process.env.POSTGRES_DB || 'app_db';
  const host = process.env.POSTGRES_HOST || 'localhost';

  if (!password || !user)
    throw new Error('Missing required environment variables for database connection');

  return {
    host,
    port: 5432,
    user,
    password,
    database,
  };
};

export default defineConfig({
  schema: './src/schema.ts',
  dialect: 'postgresql',
  out: './migrations',
  verbose: true,
  dbCredentials: getDbCredentials(),
  migrations: {
    prefix: 'unix',
  },
});
