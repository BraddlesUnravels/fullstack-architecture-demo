import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { credential } from '../schema';
import type {
  CredentialRow,
  InsertCredentialRow,
  UpdateCredentialRow,
} from '../types';
import type { NullToUndefined } from '@app/types';
import { stripNulls } from '../helpers';

export async function findCredentialByUserId(
  id: CredentialRow['userId'],
): Promise<NullToUndefined<CredentialRow>[]> {
  const row = await appDb
    .select()
    .from(credential)
    .where(eq(credential.userId, id))
    .limit(1);
  return stripNulls(row) ?? [];
}

export const findAllCredentialsByUserId = async (
  userId: CredentialRow['userId'],
): Promise<NullToUndefined<CredentialRow>[]> => {
  const rows = await appDb
    .select()
    .from(credential)
    .where(eq(credential.userId, userId));
  return stripNulls(rows) ?? [];
};

export async function createCredential(
  data: InsertCredentialRow,
): Promise<NullToUndefined<CredentialRow>[]> {
  const row = await appDb.insert(credential).values(data).returning();
  return stripNulls(row) ?? [];
}

export async function updateCredential(
  userId: CredentialRow['userId'],
  data: UpdateCredentialRow,
): Promise<NullToUndefined<CredentialRow>[]> {
  const row = await appDb
    .update(credential)
    .set(data)
    .where(and(eq(credential.userId, userId), eq(credential.valid, false)))
    .returning();
  return stripNulls(row) ?? [];
}

export async function deleteCredential(
  userId: CredentialRow['userId'],
): Promise<NullToUndefined<CredentialRow>[]> {
  const row = await appDb
    .update(credential)
    .set({ valid: true })
    .where(and(eq(credential.userId, userId), eq(credential.valid, false)))
    .returning();
  return stripNulls(row) ?? [];
}
