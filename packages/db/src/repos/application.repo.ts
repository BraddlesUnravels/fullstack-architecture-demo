import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { application } from '../schema';
import { expectOne } from '../helpers';
import { ApplicationRow, InsertApplicationRow, UpdateApplicationRow } from '../types';

export async function findApplicationById(id: ApplicationRow['id']): Promise<ApplicationRow> {
  const rows = await appDb.select().from(application).where(eq(application.id, id)).limit(1);
  return expectOne(rows, 'Application not found by id');
}
export async function findApplicationByUserId(
  userId: ApplicationRow['userId'],
): Promise<ApplicationRow> {
  const rows = await appDb
    .select()
    .from(application)
    .where(eq(application.userId, userId))
    .limit(1);
  return expectOne(rows, 'Application not found by user id');
}

export async function createApplication(data: InsertApplicationRow): Promise<ApplicationRow> {
  const rows = await appDb.insert(application).values(data).returning();
  return expectOne(rows, 'Failed to create application');
}

export async function updateApplication(
  id: ApplicationRow['id'],
  data: UpdateApplicationRow,
): Promise<ApplicationRow> {
  const rows = await appDb.update(application).set(data).where(eq(application.id, id)).returning();
  return expectOne(rows, 'Failed to update application');
}

export async function deleteApplication(id: ApplicationRow['id']): Promise<ApplicationRow> {
  const rows = await appDb
    .update(application)
    .set({ isDeleted: true })
    .where(and(eq(application.id, id), eq(application.isDeleted, false)))
    .returning();
  return expectOne(rows, 'Failed to delete application');
}
