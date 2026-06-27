import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { credential } from '../schema';
import type { CredentialRow, InsertCredentialRow, UpdateCredentialRow } from '../types';

export async function findCredentialByUserId(
  id: CredentialRow['userId'],
): Promise<CredentialRow[]> {
  const row = await appDb.select().from(credential).where(eq(credential.userId, id)).limit(1);
  return row ?? [];
}

export const findAllCredentialsByUserId = async (
  userId: CredentialRow['userId'],
): Promise<CredentialRow[]> => {
  const rows = await appDb.select().from(credential).where(eq(credential.userId, userId));
  return rows ?? [];
};

export async function createCredential(data: InsertCredentialRow): Promise<CredentialRow[]> {
  const row = await appDb.insert(credential).values(data).returning();
  return row ?? [];
}

export async function updateCredential(
  userId: CredentialRow['userId'],
  data: UpdateCredentialRow,
): Promise<CredentialRow[]> {
  const row = await appDb
    .update(credential)
    .set(data)
    .where(and(eq(credential.userId, userId), eq(credential.valid, false)))
    .returning();
  return row ?? [];
}

export async function deleteCredential(userId: CredentialRow['userId']): Promise<CredentialRow[]> {
  const row = await appDb
    .update(credential)
    .set({ valid: true })
    .where(and(eq(credential.userId, userId), eq(credential.valid, false)))
    .returning();
  return row ?? [];
}
