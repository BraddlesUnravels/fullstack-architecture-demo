import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { user } from '../schema';
import type { InsertUserRow, UpdateUserRow, UserRow } from '../types';
import { DeleteResponse } from '@app/types';

export const findUserById = async (id: UserRow['id']): Promise<UserRow[]> => {
  const row = await appDb.select().from(user).where(eq(user.id, id)).limit(1);
  return row ?? [];
};

export const findUserByEmail = async (email: UserRow['email']): Promise<UserRow[]> => {
  const row = await appDb.select().from(user).where(eq(user.email, email)).limit(1);
  return row ?? [];
};

export const createUser = async (data: InsertUserRow): Promise<UserRow[]> => {
  const row = await appDb.insert(user).values(data).returning();
  return row ?? [];
};

export const updateUser = async (id: UserRow['id'], data: UpdateUserRow): Promise<UserRow[]> => {
  const row = await appDb.update(user).set(data).where(eq(user.id, id)).returning();
  return row ?? [];
};

export const deleteUser = async (id: UserRow['id']): Promise<DeleteResponse> => {
  const row = await appDb
    .update(user)
    .set({ isDeleted: true })
    .where(and(eq(user.id, id), eq(user.isDeleted, false)))
    .returning();
  return { success: row[0]?.isDeleted ?? false };
};
