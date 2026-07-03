import type { user, credential, company, application } from './schema';

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
export type UpdateApplicationRow = Partial<InsertApplicationRow>;
