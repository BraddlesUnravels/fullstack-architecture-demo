import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { user } from '../schema';
import { expectOne } from '../helpers';
import { UserRow, InsertUserRow, UpdateUserRow } from '../types';

export async function findUserById(id: UserRow['id']): Promise<UserRow> {
  const rows = await appDb.select().from(user).where(eq(user.id, id)).limit(1);
  return expectOne(rows, 'User not found by id');
}

export async function findUserByEmail(email: UserRow['email']): Promise<UserRow> {
  const rows = await appDb.select().from(user).where(eq(user.email, email)).limit(1);
  return expectOne(rows, 'User not found by email');
}

export async function createUser(data: InsertUserRow): Promise<UserRow> {
  const rows = await appDb.insert(user).values(data).returning();
  return expectOne(rows, 'Failed to create user');
}

export async function updateUser(id: UserRow['id'], data: UpdateUserRow): Promise<UserRow> {
  const rows = await appDb.update(user).set(data).where(eq(user.id, id)).returning();
  return expectOne(rows, 'Failed to update user');
}

export async function deleteUser(id: UserRow['id']): Promise<UserRow> {
  const rows = await appDb
    .update(user)
    .set({ isDeleted: true })
    .where(and(eq(user.id, id), eq(user.isDeleted, false)))
    .returning();
  return expectOne(rows, 'Failed to delete user');
}
