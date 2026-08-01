import type { user, credential, company, application } from './schema';
import type { NullToUndefined } from '@app/types';

export type UserRow = typeof user.$inferSelect;
export type InsertUserRow = typeof user.$inferInsert;
export type UpdateUserRow = Partial<InsertUserRow>;

export type CredentialRow = typeof credential.$inferSelect;
export type InsertCredentialRow = typeof credential.$inferInsert;
export type UpdateCredentialRow = Partial<InsertCredentialRow>;

export type CompanyRow = typeof company.$inferSelect;
export type InsertCompanyRow = typeof company.$inferInsert;
export type UpdateCompanyRow = Partial<InsertCompanyRow>;

export type ApplicationRow = typeof application.$inferSelect;
export type InsertApplicationRow = typeof application.$inferInsert;

/**
 * Fields that application repository callers are allowed to update.
 *
 * Deliberately excludes:
 * - id
 * - userId
 * - createdAt/createdBy
 * - updatedAt/updatedBy
 * - deletedAt/deletedBy
 * - isDeleted
 * - version
 */

export type UpdateApplicationRow = Partial<
  Pick<InsertApplicationRow, 'companyId' | 'role' | 'status' | 'url' | 'notes'>
>;

export type ApplicationResultRow = NullToUndefined<ApplicationRow>;

export type ApplicationSummaryRow = {
  id: ApplicationRow['id'];
  role: ApplicationRow['role'];
  status: ApplicationRow['status'];
  notes: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  company: {
    name: string;
    website: string | undefined;
    jobDescription: string | undefined;
    abn: string | undefined;
  };
};
