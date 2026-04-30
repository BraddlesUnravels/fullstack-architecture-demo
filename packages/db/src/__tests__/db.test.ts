import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function main() {
  const result = await db.execute(sql`SELECT 1`);
  console.log('✅ DB connection successful');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ DB connection failed', err);
  pool.end();
  process.exit(1);
});
