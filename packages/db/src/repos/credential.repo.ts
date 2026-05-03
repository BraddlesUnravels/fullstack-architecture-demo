import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { credential } from '../schema';
import { expectOne } from '../helpers';
import { CredentialRow, InsertCredentialRow, UpdateCredentialRow } from '../types';

export async function findCredentialByUserId(id: CredentialRow['userId']): Promise<CredentialRow> {
  const rows = await appDb.select().from(credential).where(eq(credential.userId, id)).limit(1);
  return expectOne(rows, 'Credential not found by user id');
}

export const findAllCredentialsByUserId = async (
  userId: CredentialRow['userId'],
): Promise<CredentialRow[]> => {
  const rows = await appDb.select().from(credential).where(eq(credential.userId, userId));
  return rows ?? [];
};

export async function createCredential(data: InsertCredentialRow): Promise<CredentialRow> {
  const rows = await appDb.insert(credential).values(data).returning();
  return expectOne(rows, 'Failed to create credential');
}

export async function updateCredential(
  userId: CredentialRow['userId'],
  data: UpdateCredentialRow,
): Promise<CredentialRow> {
  const rows = await appDb
    .update(credential)
    .set(data)
    .where(and(eq(credential.userId, userId), eq(credential.isDeleted, false)))
    .returning();
  return expectOne(rows, 'Failed to update credential');
}

export async function deleteCredential(userId: CredentialRow['userId']): Promise<CredentialRow> {
  const rows = await appDb
    .update(credential)
    .set({ isDeleted: true })
    .where(and(eq(credential.userId, userId), eq(credential.isDeleted, false)))
    .returning();
  return expectOne(rows, 'Failed to delete credential');
}
