import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Pool } from 'pg';
export * from './schema';
export * from './repos';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const appDb = drizzle(pool, { schema });
