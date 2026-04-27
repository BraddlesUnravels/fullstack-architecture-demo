import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';
import { users, companies, applications } from './data';

console.log('🔧 Setting up database connection... with url: ', process.env.DATABASE_URL);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  console.log('🌱 Seeding...');

  await db.delete(schema.applications);
  await db.delete(schema.users);
  await db.delete(schema.companies);

  const insertedUsers = await db.insert(schema.users).values(users).returning();
  const insertedCompanies = await db.insert(schema.companies).values(companies).returning();

  await db.insert(schema.applications).values(
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

  console.log(
    `✅ ${insertedUsers.length} users, ${insertedCompanies.length} companies, ${applications.length} applications`,
  );
  await pool.end();
}

seed().catch((err) => {
  console.error('❌', err);
  pool.end();
  process.exit(1);
});
