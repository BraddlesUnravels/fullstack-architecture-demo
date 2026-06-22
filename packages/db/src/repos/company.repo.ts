import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { company } from '../schema';
import type { CompanyRow, InsertCompanyRow, UpdateCompanyRow } from '../types';
import type { DeleteResponse } from '@app/types';

export async function findCompanyById(id: CompanyRow['id']): Promise<CompanyRow[]> {
  const rows = await appDb.select().from(company).where(eq(company.id, id)).limit(1);
  return rows ?? [];
}

export async function createCompany(data: InsertCompanyRow): Promise<CompanyRow[]> {
  const rows = await appDb.insert(company).values(data).returning();
  return rows ?? [];
}

export async function updateCompany(
  id: CompanyRow['id'],
  data: UpdateCompanyRow,
): Promise<CompanyRow[]> {
  const rows = await appDb.update(company).set(data).where(eq(company.id, id)).returning();
  return rows ?? [];
}

export async function deleteCompany(id: CompanyRow['id']): Promise<DeleteResponse> {
  const rows = await appDb
    .update(company)
    .set({ isDeleted: true })
    .where(and(eq(company.id, id), eq(company.isDeleted, false)))
    .returning();
  return { success: rows[0]?.isDeleted ?? false };
}
