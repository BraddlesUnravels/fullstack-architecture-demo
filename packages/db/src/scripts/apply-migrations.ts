import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import { getConnectionString } from '../helpers';

const MIGRATIONS_DIR = fileURLToPath(new URL('../../migrations', import.meta.url));

const hasSchema = async (pool: Pool) => {
  const result = await pool.query<{ table_exists: string | null }>(
    'select to_regclass(\'public."user"\') as table_exists',
  );

  return Boolean(result.rows[0]?.table_exists);
};

const getMigrationFiles = () => {
  const migrationFiles = readdirSync(MIGRATIONS_DIR)
    .filter((entry) => entry.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  if (migrationFiles.length === 0) throw new Error('No SQL migration files found');

  return migrationFiles;
};

const applyMigrations = async () => {
  const pool = new Pool(getConnectionString());

  try {
    if (await hasSchema(pool)) {
      console.log('✅ Schema already exists, skipping migration apply');
      return;
    }

    const migrationFiles = getMigrationFiles();

    for (const migrationFile of migrationFiles) {
      const migrationPath = join(MIGRATIONS_DIR, migrationFile);
      const migrationSql = readFileSync(migrationPath, 'utf-8');

      if (!migrationSql.trim()) continue;

      await pool.query(migrationSql);
      console.log(`✅ Applied migration ${migrationFile}`);
    }
  } finally {
    await pool.end();
  }
};

await applyMigrations();
