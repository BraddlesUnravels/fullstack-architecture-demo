import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import { getMigratorDbConnectionString } from '../helpers';

const MIGRATIONS_DIR = fileURLToPath(
  new URL('../../migrations', import.meta.url),
);
const MIGRATIONS_TABLE = '__app_migrations';

const getMigrationFiles = () => {
  const migrationFiles = readdirSync(MIGRATIONS_DIR)
    .filter((entry) => entry.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  if (migrationFiles.length === 0)
    throw new Error('No SQL migration files found');

  return migrationFiles;
};
const ensureMigrationsTable = async (pool: Pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      filename text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
};

const getAppliedMigrations = async (pool: Pool) => {
  const result = await pool.query<{ filename: string }>(
    `SELECT filename FROM ${MIGRATIONS_TABLE} ORDER BY filename ASC`,
  );

  return new Set(result.rows.map(({ filename }) => filename));
};

const hasExistingSchema = async (pool: Pool) => {
  const result = await pool.query<{ table_exists: string | null }>(
    'SELECT to_regclass(\'public."user"\') AS table_exists',
  );

  return Boolean(result.rows[0]?.table_exists);
};

const baselineMigrations = async (pool: Pool, migrationFiles: string[]) => {
  if (migrationFiles.length === 0) return;

  await pool.query('BEGIN');

  for (const migrationFile of migrationFiles) {
    await pool.query(
      `INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING`,
      [migrationFile],
    );
  }

  await pool.query('COMMIT');
};

const applyMigrations = async () => {
  const pool = new Pool(getMigratorDbConnectionString());

  try {
    await ensureMigrationsTable(pool);

    const migrationFiles = getMigrationFiles();
    const appliedMigrations = await getAppliedMigrations(pool);

    if (appliedMigrations.size === 0 && (await hasExistingSchema(pool))) {
      await baselineMigrations(pool, migrationFiles);
      console.log(
        '✅ Existing schema detected; migration history baseline created',
      );
      return;
    }
    const pendingMigrations = migrationFiles.filter((migrationFile) => {
      return !appliedMigrations.has(migrationFile);
    });

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    for (const migrationFile of pendingMigrations) {
      const migrationPath = join(MIGRATIONS_DIR, migrationFile);
      const migrationSql = readFileSync(migrationPath, 'utf-8');

      if (!migrationSql.trim()) continue;
      await pool.query('BEGIN');
      await pool.query(migrationSql);
      await pool.query(
        `INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES ($1)`,
        [migrationFile],
      );
      await pool.query('COMMIT');
      console.log(`✅ Applied migration ${migrationFile}`);
    }
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  } finally {
    await pool.end();
  }
};

await applyMigrations();
