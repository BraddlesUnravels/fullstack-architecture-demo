import { Pool } from 'pg';
import {
  getAppDbUser,
  getDatabaseName,
  getMigratorDbConnectionString,
  getMigratorDbUser,
} from '../helpers';

const quoteIdentifier = (value: string) => {
  return `"${value.replaceAll('"', '""')}"`;
};

const getGrantsSql = () => {
  const databaseName = quoteIdentifier(getDatabaseName());
  const appDbUser = quoteIdentifier(getAppDbUser());
  const migratorDbUser = quoteIdentifier(getMigratorDbUser());

  return [
    `GRANT CONNECT ON DATABASE ${databaseName} TO ${appDbUser};`,
    `GRANT USAGE ON SCHEMA public TO ${appDbUser};`,
    `GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO ${appDbUser};`,
    `REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM ${appDbUser};`,
    `GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO ${appDbUser};`,
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${migratorDbUser} IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO ${appDbUser};`,
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${migratorDbUser} IN SCHEMA public REVOKE DELETE ON TABLES FROM ${appDbUser};`,
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${migratorDbUser} IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO ${appDbUser};`,
  ].join('\n');
};

const grantAppPermissions = async () => {
  const pool = new Pool(getMigratorDbConnectionString());
  const sql = getGrantsSql();

  try {
    await pool.query(sql);
    console.log('✅ Application user permissions granted');
  } finally {
    await pool.end();
  }
};

await grantAppPermissions();
