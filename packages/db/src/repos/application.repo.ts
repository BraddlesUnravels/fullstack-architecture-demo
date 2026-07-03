import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { application } from '../schema';
import type { ApplicationRow, InsertApplicationRow, UpdateApplicationRow } from '../types';
import type { DeleteResponse } from '@app/types';
import type { NullToUndefined } from '@app/types';
import { stripNulls } from '../helpers';

export async function findApplicationById(
  id: ApplicationRow['id'],
): Promise<NullToUndefined<ApplicationRow>[]> {
  const row = await appDb.select().from(application).where(eq(application.id, id)).limit(1);
  return stripNulls(row) ?? [];
}
export async function findApplicationByUserId(
  userId: ApplicationRow['userId'],
): Promise<NullToUndefined<ApplicationRow>[]> {
  const row = await appDb.select().from(application).where(eq(application.userId, userId)).limit(1);
  return stripNulls(row) ?? [];
}

export async function createApplication(
  data: InsertApplicationRow,
): Promise<NullToUndefined<ApplicationRow>[]> {
  const row = await appDb.insert(application).values(data).returning();
  return stripNulls(row) ?? [];
}

export async function updateApplication(
  id: ApplicationRow['id'],
  data: UpdateApplicationRow,
): Promise<NullToUndefined<ApplicationRow>[]> {
  const row = await appDb.update(application).set(data).where(eq(application.id, id)).returning();
  return stripNulls(row) ?? [];
}

export async function deleteApplication(id: ApplicationRow['id']): Promise<DeleteResponse> {
  const row = await appDb
    .update(application)
    .set({ isDeleted: true })
    .where(and(eq(application.id, id), eq(application.isDeleted, false)))
    .returning();
  return { success: row[0]?.isDeleted ?? false };
}
