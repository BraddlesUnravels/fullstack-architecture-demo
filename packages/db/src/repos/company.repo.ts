import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { company } from '../schema';
import type { CompanyRow, InsertCompanyRow, UpdateCompanyRow } from '../types';
import type { DeleteResponse } from '@app/types';
import type { NullToUndefined } from '@app/types';
import { stripNulls } from '../helpers';

export async function findCompanyById(
  id: CompanyRow['id'],
): Promise<NullToUndefined<CompanyRow>[]> {
  const rows = await appDb
    .select()
    .from(company)
    .where(eq(company.id, id))
    .limit(1);
  return stripNulls(rows) ?? [];
}

export async function createCompany(
  data: InsertCompanyRow,
): Promise<NullToUndefined<CompanyRow>[]> {
  const rows = await appDb.insert(company).values(data).returning();
  return stripNulls(rows) ?? [];
}

export async function updateCompany(
  id: CompanyRow['id'],
  data: UpdateCompanyRow,
): Promise<NullToUndefined<CompanyRow>[]> {
  const rows = await appDb
    .update(company)
    .set(data)
    .where(eq(company.id, id))
    .returning();
  return stripNulls(rows) ?? [];
}

export async function deleteCompany(
  id: CompanyRow['id'],
): Promise<DeleteResponse> {
  const rows = await appDb
    .update(company)
    .set({ isDeleted: true })
    .where(and(eq(company.id, id), eq(company.isDeleted, false)))
    .returning();
  return { success: rows[0]?.isDeleted ?? false };
}
