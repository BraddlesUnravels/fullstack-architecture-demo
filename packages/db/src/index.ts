import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { getConnectionString } from './helpers';
import { Pool } from 'pg';
export * from './schema';
export * from './repos';

const pool = new Pool(getConnectionString());
export const appDb = drizzle(pool, { schema });
