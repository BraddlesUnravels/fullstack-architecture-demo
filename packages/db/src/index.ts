import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { getAppDbConnectionString } from './helpers';
export * from './schema';
export * from './repos';

const pool = new Pool(getAppDbConnectionString());
export const appDb = drizzle(pool, { schema });
