import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';
import { sql } from 'drizzle-orm';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
  const result = await db.execute(sql`SELECT 1`);
  if (!result) {
    throw new Error('Failed to execute query');
  }
  console.log('✅ DB connection successful');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ DB connection failed', err);
  pool.end();
  process.exit(1);
});
