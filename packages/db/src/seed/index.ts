import { drizzle } from 'drizzle-orm/node-postgres';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';
import { securityUtils } from '@app/utils';
import * as schema from '../schema';
import { getConnectionString } from '../helpers';
import { createApplications, createCompanies, createCredentials, createUsers } from './data';
import type { CompanyRow, UserRow } from '../types';

type SeedMode = 'deterministic' | 'random';

type SeedOptions = {
  batchSize: number;
  companyCount: number;
  maxApplicationsPerUser: number;
  mode: SeedMode;
  seed: number;
  truncate: boolean;
  userCount: number;
};

const SEED_CREATED_BY_USER_ID = '00000000-0000-0000-0000-000000000001';
const SEED_PASSWORD = 'password123';

const DEFAULT_OPTIONS: SeedOptions = {
  userCount: 1000,
  companyCount: 250,
  maxApplicationsPerUser: 5,
  batchSize: 200,
  mode: 'deterministic',
  seed: 20260719,
  truncate: true,
};

const parseInteger = (name: string, value: string) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue <= 0)
    throw new Error(`${name} must be a positive integer`);

  return parsedValue;
};

const parseBoolean = (name: string, value: string) => {
  if (value === 'true') return true;
  if (value === 'false') return false;

  throw new Error(`${name} must be true or false`);
};

const parseArgs = (args: string[]): SeedOptions => {
  const options: SeedOptions = { ...DEFAULT_OPTIONS };

  for (const arg of args) {
    if (!arg.startsWith('--')) continue;

    const [key, value] = arg.slice(2).split('=');
    if (!key || !value) throw new Error(`Invalid argument format: ${arg}`);

    if (key === 'users') {
      options.userCount = parseInteger('users', value);
      continue;
    }

    if (key === 'companies') {
      options.companyCount = parseInteger('companies', value);
      continue;
    }

    if (key === 'max-applications-per-user') {
      options.maxApplicationsPerUser = parseInteger('max-applications-per-user', value);
      continue;
    }

    if (key === 'batch-size') {
      options.batchSize = parseInteger('batch-size', value);
      continue;
    }

    if (key === 'seed') {
      options.seed = parseInteger('seed', value);
      continue;
    }

    if (key === 'truncate') {
      options.truncate = parseBoolean('truncate', value);
      continue;
    }

    if (key === 'mode') {
      if (value !== 'deterministic' && value !== 'random')
        throw new Error('mode must be deterministic or random');

      options.mode = value;
      continue;
    }

    throw new Error(`Unsupported argument: --${key}`);
  }

  return options;
};

const connection = getConnectionString();
console.log('🔧 Setting up database connection...');

const pool = new Pool(connection);
const db = drizzle(pool, { schema });
const deleteExistingRows = async () => {
  await db.delete(schema.application);
  await db.delete(schema.credential);
  await db.delete(schema.user);
  await db.delete(schema.company);
};

const insertUsersInBatches = async (
  userRows: ReturnType<typeof createUsers>,
  batchSize: number,
) => {
  const insertedUsers: UserRow[] = [];

  for (let index = 0; index < userRows.length; index += batchSize) {
    const batch = userRows.slice(index, index + batchSize);
    const insertedBatch = await db.insert(schema.user).values(batch).returning();
    insertedUsers.push(...insertedBatch);
  }

  return insertedUsers;
};

const insertCompaniesInBatches = async (
  companyRows: ReturnType<typeof createCompanies>,
  batchSize: number,
) => {
  const insertedCompanies: CompanyRow[] = [];

  for (let index = 0; index < companyRows.length; index += batchSize) {
    const batch = companyRows.slice(index, index + batchSize);
    const insertedBatch = await db.insert(schema.company).values(batch).returning();
    insertedCompanies.push(...insertedBatch);
  }

  return insertedCompanies;
};

const insertCredentialsInBatches = async (
  credentialRows: ReturnType<typeof createCredentials>,
  batchSize: number,
) => {
  for (let index = 0; index < credentialRows.length; index += batchSize) {
    const batch = credentialRows.slice(index, index + batchSize);
    await db.insert(schema.credential).values(batch);
  }
};

const insertApplicationsInBatches = async (
  applicationRows: ReturnType<typeof createApplications>,
  batchSize: number,
) => {
  for (let index = 0; index < applicationRows.length; index += batchSize) {
    const batch = applicationRows.slice(index, index + batchSize);
    await db.insert(schema.application).values(batch);
  }
};

const seed = async () => {
  const options = parseArgs(process.argv.slice(2));

  if (options.mode === 'deterministic') faker.seed(options.seed);

  const passwordHash = await securityUtils.hashNewPassword(SEED_PASSWORD);
  const users = createUsers(options.userCount, SEED_CREATED_BY_USER_ID);
  const companies = createCompanies(options.companyCount, SEED_CREATED_BY_USER_ID);

  console.log(
    `🌱 Seeding with users=${options.userCount}, companies=${options.companyCount}, maxApplicationsPerUser=${options.maxApplicationsPerUser}, batchSize=${options.batchSize}, mode=${options.mode}, truncate=${options.truncate}`,
  );

  if (options.truncate) {
    console.log('🧹 Clearing existing seedable tables...');
    await deleteExistingRows();
  }

  console.log('👥 Inserting users...');
  const insertedUsers = await insertUsersInBatches(users, options.batchSize);

  console.log('🏢 Inserting companies...');
  const insertedCompanies = await insertCompaniesInBatches(companies, options.batchSize);

  const credentialRows = createCredentials(
    insertedUsers.map(({ id }) => id),
    passwordHash,
  );
  const applicationRows = createApplications({
    userIds: insertedUsers.map(({ id }) => id),
    companyIds: insertedCompanies.map(({ id }) => id),
    maxApplicationsPerUser: options.maxApplicationsPerUser,
    createdBy: SEED_CREATED_BY_USER_ID,
  });

  console.log('🔐 Inserting credentials...');
  await insertCredentialsInBatches(credentialRows, options.batchSize);

  console.log('📝 Inserting applications...');
  await insertApplicationsInBatches(applicationRows, options.batchSize);

  console.log(
    `✅ ${insertedUsers.length} users, ${insertedCompanies.length} companies, ${applicationRows.length} applications, ${credentialRows.length} credentials`,
  );
};

try {
  await seed();
  console.log('🎉 Seeding completed successfully!');
} catch (error) {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
} finally {
  await pool.end();
}
