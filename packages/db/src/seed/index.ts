import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';
import { users, credentials, companies, applications } from './data';
import { getConnectionString } from '../helpers';

const connection = getConnectionString();
console.log('🔧 Setting up database connection...');

const pool = new Pool(connection);
const db = drizzle(pool, { schema });

async function seed() {
  console.log('🌱 Seeding...');

  await db.delete(schema.application);
  await db.delete(schema.user);
  await db.delete(schema.company);
  await db.delete(schema.credential);

  const insertedUsers = await db.insert(schema.user).values(users).returning();
  const insertedCompanies = await db.insert(schema.company).values(companies).returning();

  await db.insert(schema.application).values(
    applications.map(({ userIndex, companyIndex, ...rest }) => {
      const user = insertedUsers[userIndex];
      const company = insertedCompanies[companyIndex];

      if (!user || !company)
        throw new Error(
          !user
            ? `Invalid userIndex ${userIndex} or companyIndex ${companyIndex}`
            : `Invalid companyIndex ${companyIndex}`,
        );

      return {
        ...rest,
        userId: user.id,
        companyId: company.id,
      };
    }),
  );

  await db.insert(schema.credential).values(
    credentials.map(({ userIndex, ...rest }) => {
      const user = insertedUsers[userIndex];

      if (!user) throw new Error('no user found to add to credential row');

      return {
        ...rest,
        userId: user.id,
      };
    }),
  );

  console.log(
    `✅ ${insertedUsers.length} users, ${insertedCompanies.length} companies, ${applications.length} applications`,
  );
  await pool.end();
}

await seed()
  .then(() => console.log('🎉 Seeding completed successfully!'))
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
