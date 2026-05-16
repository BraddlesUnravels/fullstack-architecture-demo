import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { application } from '../schema';
import { ApplicationRow, InsertApplicationRow, UpdateApplicationRow } from '../types';
import { DeleteResponse } from '@app/types';

export async function findApplicationById(id: ApplicationRow['id']): Promise<ApplicationRow[]> {
  const row = await appDb.select().from(application).where(eq(application.id, id)).limit(1);
  return row ?? [];
}
export async function findApplicationByUserId(
  userId: ApplicationRow['userId'],
): Promise<ApplicationRow[]> {
  const rows = await appDb
    .select()
    .from(application)
    .where(eq(application.userId, userId))
    .limit(1);
  return rows ?? [];
}

export async function createApplication(data: InsertApplicationRow): Promise<ApplicationRow[]> {
  const row = await appDb.insert(application).values(data).returning();
  return row ?? [];
}

export async function updateApplication(
  id: ApplicationRow['id'],
  data: UpdateApplicationRow,
): Promise<ApplicationRow[]> {
  const row = await appDb.update(application).set(data).where(eq(application.id, id)).returning();
  return row ?? [];
}

export async function deleteApplication(id: ApplicationRow['id']): Promise<DeleteResponse> {
  const row = await appDb
    .update(application)
    .set({ isDeleted: true })
    .where(and(eq(application.id, id), eq(application.isDeleted, false)))
    .returning();
  return { success: row[0]?.isDeleted ?? false };
}
