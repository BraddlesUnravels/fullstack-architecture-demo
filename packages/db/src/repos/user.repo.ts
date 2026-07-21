import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { user } from '../schema';
import type { InsertUserRow, UpdateUserRow, UserRow } from '../types';
import type { DeleteResponse } from '@app/types';
import type { NullToUndefined } from '@app/types';
import { stripNulls } from '../helpers';

export const findUserById = async (id: UserRow['id']): Promise<NullToUndefined<UserRow>[]> => {
  const row = await appDb.select().from(user).where(eq(user.id, id)).limit(1);
  return stripNulls(row) ?? [];
};

export const findUserByEmail = async (
  email: UserRow['email'],
): Promise<NullToUndefined<UserRow>[]> => {
  const row = await appDb.select().from(user).where(eq(user.email, email)).limit(1);
  return stripNulls(row) ?? [];
};

export const createUser = async (data: InsertUserRow): Promise<NullToUndefined<UserRow>[]> => {
  const row = await appDb.insert(user).values(data).returning();
  return stripNulls(row) ?? [];
};

export const updateUser = async (
  id: UserRow['id'],
  data: UpdateUserRow,
): Promise<NullToUndefined<UserRow>[]> => {
  const row = await appDb.update(user).set(data).where(eq(user.id, id)).returning();
  return stripNulls(row) ?? [];
};

export const deleteUser = async (id: UserRow['id']): Promise<DeleteResponse> => {
  const row = await appDb
    .update(user)
    .set({ isDeleted: true })
    .where(and(eq(user.id, id), eq(user.isDeleted, false)))
    .returning();
  return { success: row[0]?.isDeleted ?? false };
};

export const userSummary = async (): Promise<NullToUndefined<Partial<UserRow>>[]> => {
  const row = await appDb
    .select({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    })
    .from(user)
    .where(eq(user.isDeleted, false));

  return stripNulls(row) ?? [];
};
