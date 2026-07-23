import type { NullToUndefined } from '@app/types';

const DEFAULT_DB_HOST = 'localhost';
const DEFAULT_DB_NAME = 'app_db';
const DEFAULT_DB_PORT = 5432;

type DbRole = 'app' | 'migrator';

export const stripNulls = <T>(value: T): NullToUndefined<T> => {
  if (value === null) return undefined as NullToUndefined<T>;
  if (value instanceof Date) return value as NullToUndefined<T>;

  if (Array.isArray(value)) {
    const arrayValue = value as unknown[];

    return arrayValue.map((item) => stripNulls(item)) as NullToUndefined<T>;
  }

  if (typeof value === 'object' && value !== null) {
    const result: Record<string, unknown> = {};
    const objectValue = value as Record<string, unknown>;

    for (const [key, item] of Object.entries(objectValue)) {
      result[key] = stripNulls(item);
    }

    return result as NullToUndefined<T>;
  }

  return value as NullToUndefined<T>;
};

const parsePort = (value?: string) => {
  if (!value) return DEFAULT_DB_PORT;

  const port = Number.parseInt(value, 10);

  if (Number.isNaN(port) || port <= 0)
    throw new Error('Database port must be a positive integer');

  return port;
};

const pickDefinedValue = (values: (string | undefined)[]) => {
  return values.find((value) => value && value.length > 0);
};

const getRequiredValue = (name: string, values: (string | undefined)[]) => {
  const value = pickDefinedValue(values);

  if (!value)
    throw new Error(`Missing required environment variable for ${name}`);

  return value;
};

const getRoleDbUser = (role: DbRole) => {
  if (role === 'app') {
    return getRequiredValue('application database user', [
      process.env.APP_DB_USER,
      process.env.POSTGRES_USER,
    ]);
  }

  return getRequiredValue('migration database user', [
    process.env.MIGRATOR_DB_USER,
    process.env.POSTGRES_USER,
  ]);
};

const getRoleDbPassword = (role: DbRole) => {
  if (role === 'app') {
    return getRequiredValue('application database user password', [
      process.env.APP_DB_PASSWORD,
      process.env.POSTGRES_PASSWORD,
    ]);
  }

  return getRequiredValue('migration database user password', [
    process.env.MIGRATOR_DB_PASSWORD,
    process.env.POSTGRES_PASSWORD,
  ]);
};

export const getDatabaseName = () => {
  return pickDefinedValue([process.env.POSTGRES_DB]) || DEFAULT_DB_NAME;
};

export const getDatabaseHost = (role: DbRole) => {
  if (role === 'app')
    return pickDefinedValue([process.env.APP_DB_HOST, process.env.POSTGRES_HOST]) ||
      DEFAULT_DB_HOST;

  return (
    pickDefinedValue([process.env.MIGRATOR_DB_HOST, process.env.POSTGRES_HOST]) ||
    DEFAULT_DB_HOST
  );
};

export const getDatabasePort = (role: DbRole) => {
  if (role === 'app')
    return parsePort(
      pickDefinedValue([process.env.APP_DB_PORT, process.env.POSTGRES_PORT]),
    );

  return parsePort(
    pickDefinedValue([process.env.MIGRATOR_DB_PORT, process.env.POSTGRES_PORT]),
  );
};

const getDatabaseConfig = (role: DbRole) => {
  const user = getRoleDbUser(role);
  const password = getRoleDbPassword(role);
  const database = getDatabaseName();
  const host = getDatabaseHost(role);
  const port = getDatabasePort(role);

  return {
    connectionString: `postgresql://${user}:${password}@${host}:${port}/${database}`,
  };
};

export const getAppDbConnectionString = () => {
  return getDatabaseConfig('app');
};

export const getMigratorDbConnectionString = () => {
  return getDatabaseConfig('migrator');
};

export const getAppDbUser = () => {
  return getRoleDbUser('app');
};

export const getMigratorDbUser = () => {
  return getRoleDbUser('migrator');
};

export const getDrizzleMigratorDbCredentials = () => {
  const user = getRoleDbUser('migrator');
  const password = getRoleDbPassword('migrator');
  const database = getDatabaseName();
  const host = getDatabaseHost('migrator');
  const port = getDatabasePort('migrator');

  return {
    host,
    port,
    user,
    password,
    database,
  };
};
