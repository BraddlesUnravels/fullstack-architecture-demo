import { and, eq, desc } from 'drizzle-orm';
import { appDb } from '../../src';
import { application, company } from '../schema';
import type { ApplicationRow, InsertApplicationRow, UpdateApplicationRow } from '../types';
import type { DeleteResponse, NullToUndefined } from '@app/types';
import { stripNulls } from '../helpers';

export type ApplicationSummaryDbRow = NullToUndefined<{
  id: ApplicationRow['id'];
  role: ApplicationRow['role'];
  status: ApplicationRow['status'];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  company: {
    name: string;
    website?: string;
    jobDescription?: string;
    abn?: string;
  };
}>;

export const findApplicationById = async (
  id: ApplicationRow['id'],
): Promise<NullToUndefined<ApplicationRow>[]> => {
  const row = await appDb.select().from(application).where(eq(application.id, id)).limit(1);
  return stripNulls(row) ?? [];
};
export const findApplicationByUserId = async (
  userId: ApplicationRow['userId'],
): Promise<NullToUndefined<ApplicationRow>[]> => {
  const row = await appDb.select().from(application).where(eq(application.userId, userId));
  return stripNulls(row) ?? [];
};

export const createApplication = async (
  data: InsertApplicationRow,
): Promise<NullToUndefined<ApplicationRow>[]> => {
  const row = await appDb.insert(application).values(data).returning();
  return stripNulls(row) ?? [];
};

export const updateApplication = async (
  id: ApplicationRow['id'],
  data: UpdateApplicationRow,
): Promise<NullToUndefined<ApplicationRow>[]> => {
  const row = await appDb.update(application).set(data).where(eq(application.id, id)).returning();
  return stripNulls(row) ?? [];
};

export const deleteApplication = async (id: ApplicationRow['id']): Promise<DeleteResponse> => {
  const row = await appDb
    .update(application)
    .set({ isDeleted: true })
    .where(and(eq(application.id, id), eq(application.isDeleted, false)))
    .returning();
  return { success: row[0]?.isDeleted ?? false };
};

export const listAllApplicationSummaryByUserId = async (
  userId: ApplicationRow['userId'],
): Promise<ApplicationSummaryDbRow[]> => {
  const row = await appDb
    .select({
      id: application.id,
      role: application.role,
      status: application.status,
      notes: application.notes,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      company: {
        name: company.name,
        website: company.website,
        jobDescription: company.jobDescription,
        abn: company.abn,
      },
    })
    .from(application)
    .innerJoin(company, eq(application.companyId, company.id))
    .where(and(eq(application.userId, userId), eq(application.isDeleted, false)))
    .orderBy(desc(application.createdAt));

  return stripNulls(row) ?? [];
};
