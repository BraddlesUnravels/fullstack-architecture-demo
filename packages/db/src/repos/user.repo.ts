import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { expectOne } from '../helpers';
import { user } from '../schema';
import type { InsertUserRow, UpdateUserRow, UserRow } from '../types';

export const findUserById = async (id: UserRow['id']): Promise<UserRow | undefined> => {
  const rows = await appDb.select().from(user).where(eq(user.id, id)).limit(1);

  return rows[0];
};

export const findUserByEmail = async (email: UserRow['email']): Promise<UserRow | undefined> => {
  const rows = await appDb.select().from(user).where(eq(user.email, email)).limit(1);

  return rows[0];
};

export const createUser = async (data: InsertUserRow): Promise<UserRow> => {
  const rows = await appDb.insert(user).values(data).returning();
  return expectOne(rows, 'Failed to create user');
};

export const updateUser = async (id: UserRow['id'], data: UpdateUserRow): Promise<UserRow> => {
  const rows = await appDb.update(user).set(data).where(eq(user.id, id)).returning();
  return expectOne(rows, 'Failed to update user');
};

export const deleteUser = async (id: UserRow['id']): Promise<UserRow> => {
  const rows = await appDb
    .update(user)
    .set({ isDeleted: true })
    .where(and(eq(user.id, id), eq(user.isDeleted, false)))
    .returning();
  return expectOne(rows, 'Failed to delete user');
};
