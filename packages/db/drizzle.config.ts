import { defineConfig } from 'drizzle-kit';

const getDbCredentials = () => {
  const password = process.env.POSTGRES_PASSWORD;
  const user = process.env.POSTGRES_USER;
  const database = 'app_db';
  const host = 'postgres';

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
