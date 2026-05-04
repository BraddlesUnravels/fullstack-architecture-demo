import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Pool } from 'node_modules/@types/pg';
export * from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const appDb = drizzle(pool, { schema });
