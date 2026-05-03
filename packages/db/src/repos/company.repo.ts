import { and, eq } from 'drizzle-orm';
import { appDb } from '../../src';
import { company } from '../schema';
import { expectOne } from '../helpers';
import { CompanyRow, InsertCompanyRow, UpdateCompanyRow } from '../types';

export async function findCompanyById(id: CompanyRow['id']): Promise<CompanyRow> {
  const rows = await appDb.select().from(company).where(eq(company.id, id)).limit(1);
  return expectOne(rows, 'Company not found by id');
}

export async function createCompany(data: InsertCompanyRow): Promise<CompanyRow> {
  const rows = await appDb.insert(company).values(data).returning();
  return expectOne(rows, 'Failed to create company');
}

export async function updateCompany(
  id: CompanyRow['id'],
  data: UpdateCompanyRow,
): Promise<CompanyRow> {
  const rows = await appDb.update(company).set(data).where(eq(company.id, id)).returning();
  return expectOne(rows, 'Failed to update company');
}

export async function deleteCompany(id: CompanyRow['id']): Promise<CompanyRow> {
  const rows = await appDb
    .update(company)
    .set({ isDeleted: true })
    .where(and(eq(company.id, id), eq(company.isDeleted, false)))
    .returning();
  return expectOne(rows, 'Failed to delete company');
}
