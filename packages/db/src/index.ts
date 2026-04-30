import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
export * from './schema';

export const appDb = drizzle(process.env.DATABASE_URL!, { schema });

const result = await appDb.select().from(schema.users);
console.log(result);
