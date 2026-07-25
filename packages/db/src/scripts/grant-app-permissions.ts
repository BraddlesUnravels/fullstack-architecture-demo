import { Pool } from 'pg';
import {
  getAdminDbConnectionString,
  getAppDbUser,
  getDatabaseName,
  getMigratorDbUser,
} from '../helpers';

type GrantStep = {
  label: string;
  sql: string;
};

type PgError = Error & {
  code?: string;
  detail?: string;
  hint?: string;
  schema?: string;
  table?: string;
  column?: string;
  routine?: string;
};

const quoteIdentifier = (value: string) => {
  return `"${value.replaceAll('"', '""')}"`;
};

const getGrantSteps = (): GrantStep[] => {
  const databaseName = quoteIdentifier(getDatabaseName());
  const appUser = quoteIdentifier(getAppDbUser());
  const migratorDbUser = quoteIdentifier(getMigratorDbUser());

  return [
    {
      label: 'Grant connect on database to app user',
      sql: `GRANT CONNECT ON DATABASE ${databaseName} TO ${appUser};`,
    },
    {
      label: 'Grant schema usage to app user',
      sql: `GRANT USAGE ON SCHEMA public TO ${appUser};`,
    },
    {
      label: 'Revoke schema create privilege from app user',
      sql: `REVOKE CREATE ON SCHEMA public FROM ${appUser};`,
    },
    {
      label: 'Grant table read/write privileges to app user',
      sql: `GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO ${appUser};`,
    },
    {
      label: 'Revoke destructive table privileges from app user',
      sql: `REVOKE DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM ${appUser};`,
    },
    {
      label: 'Grant sequence usage privileges to app user',
      sql: `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${appUser};`,
    },
    {
      label: 'Set default table privileges for app user',
      sql: `ALTER DEFAULT PRIVILEGES FOR ROLE ${migratorDbUser} IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO ${appUser};`,
    },
    {
      label: 'Set default sequence privileges for app user',
      sql: `ALTER DEFAULT PRIVILEGES FOR ROLE ${migratorDbUser} IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ${appUser};`,
    },
  ];
};

const formatPgError = (error: unknown): string => {
  if (!(error instanceof Error)) return 'Unknown error';

  const pgError = error as PgError;
  const details = [
    pgError.code ? `SQLSTATE=${pgError.code}` : undefined,
    pgError.detail ? `Detail: ${pgError.detail}` : undefined,
    pgError.hint ? `Hint: ${pgError.hint}` : undefined,
    pgError.schema ? `Schema: ${pgError.schema}` : undefined,
    pgError.table ? `Table: ${pgError.table}` : undefined,
    pgError.column ? `Column: ${pgError.column}` : undefined,
    pgError.routine ? `Routine: ${pgError.routine}` : undefined,
  ].filter((value) => value);

  if (details.length === 0) return error.message;

  return `${error.message} (${details.join(', ')})`;
};

const grantAppPermissions = async () => {
  const pool = new Pool(getAdminDbConnectionString());
  const steps = getGrantSteps();

  try {
    for (const step of steps) {
      try {
        await pool.query(step.sql);
        console.log(`✅ ${step.label}, completed successfully`);
      } catch (error) {
        const errorDetails = formatPgError(error);
        console.error(`❌ ${step.label}, failed with error: ${errorDetails}`);
        throw new Error(
          `Failed to apply database grant step "${step.label}". ${errorDetails}. Statement: ${step.sql}`,
          { cause: error },
        );
      }
    }

    console.log('✅ Application user permissions granted');
  } finally {
    await pool.end();
  }
};

await grantAppPermissions();
