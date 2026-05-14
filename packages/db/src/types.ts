import { user, credential, session, company, application } from './schema';

export type UserRow = typeof user.$inferSelect;
export type InsertUserRow = typeof user.$inferInsert;
export type UpdateUserRow = Partial<InsertUserRow>;

export type CredentialRow = typeof credential.$inferSelect;
export type InsertCredentialRow = typeof credential.$inferInsert;
export type UpdateCredentialRow = Partial<InsertCredentialRow>;
export type SessionRow = typeof session.$inferSelect;
export type InsertSessionRow = typeof session.$inferInsert;
export type UpdateSessionRow = Partial<InsertSessionRow>;

export type CompanyRow = typeof company.$inferSelect;
export type InsertCompanyRow = typeof company.$inferInsert;
export type UpdateCompanyRow = Partial<InsertCompanyRow>;

export type ApplicationRow = typeof application.$inferSelect;
export type InsertApplicationRow = typeof application.$inferInsert;
export type UpdateApplicationRow = Partial<InsertApplicationRow>;
