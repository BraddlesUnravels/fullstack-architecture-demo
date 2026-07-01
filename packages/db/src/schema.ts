import { relations, sql } from 'drizzle-orm';
import { boolean, index, pgTable, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { JobStatus, UserTier } from '@app/constants';

export const auditColumns = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

  createdBy: uuid('created_by'),

  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

  updatedBy: uuid('updated_by'),

  isDeleted: boolean('is_deleted').default(false).notNull(),

  deletedAt: timestamp('deleted_at', { withTimezone: true }),

  deletedBy: uuid('deleted_by'),

  version: integer('version')
    .default(1)
    .$onUpdate(() => sql`version + 1`)
    .notNull(),
};

export const user = pgTable(
  'user',
  (t) => ({
    id: t.uuid('id').primaryKey().defaultRandom(),
    email: t.text('email').notNull().unique(),
    verifiedAt: t.timestamp('verified_at', { withTimezone: true }),
    firstName: t.text('first_name'),
    lastName: t.text('last_name'),
    isLocked: t.boolean('is_locked').default(false).notNull(),
    tier: t
      .text('tier', {
        enum: [UserTier.FREE, UserTier.PREMIUM, UserTier.ADMIN] as const,
      })
      .notNull()
      .default(UserTier.FREE),
    lastLoginAt: t.timestamp('last_login_at', { withTimezone: true }),
    ...auditColumns,
  }),
  (t) => [index('idx_users_email').on(t.email)],
);

export const credential = pgTable(
  'credential',
  (t) => ({
    id: t.uuid('id').primaryKey().defaultRandom(),
    userId: t
      .uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    hash: t.text('hash').notNull(),
    valid: t.boolean('valid').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    invalidatedAt: timestamp('invalidated_at', { withTimezone: true }),
  }),
  (t) => [index('idx_credentials_user_id').on(t.userId)],
);

export const session = pgTable(
  'session',
  (t) => ({
    id: t.uuid('id').primaryKey().defaultRandom(),
    userId: t
      .uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    expiresAt: t.timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: t.timestamp('revoked_at', { withTimezone: true }),
    userAgent: t.text('user_agent'),
    ipAddress: t.text('ip_address'),
    ...auditColumns,
  }),
  (t) => [index('idx_sessions_user_id').on(t.userId)],
);

export const application = pgTable(
  'application',
  (t) => ({
    id: t.uuid('id').primaryKey().defaultRandom(),
    userId: t
      .uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    companyId: t
      .uuid('company_id')
      .notNull()
      .references(() => company.id),
    role: t.text('role').notNull(),
    status: t
      .text('status', {
        enum: [
          JobStatus.ENTERED,
          JobStatus.APPLIED,
          JobStatus.INTERVIEW,
          JobStatus.OFFER,
          JobStatus.ACCEPTED,
          JobStatus.REJECTED,
        ] as const,
      })
      .notNull()
      .default(JobStatus.APPLIED),
    url: t.text('url'),
    notes: t.text('notes'),
    ...auditColumns,
  }),
  (t) => [
    index('idx_applications_user_id').on(t.userId),
    index('idx_status').on(t.status),
    index('idx_applications_company_id').on(t.companyId),
  ],
);

export const company = pgTable('company', (t) => ({
  id: t.uuid('id').primaryKey().defaultRandom(),
  name: t.text('name').notNull(),
  abn: t.text('abn').unique(),
  website: t.text('website'),
  jobDescription: t.text('job_description'),
  ...auditColumns,
}));

export const userRelations = relations(user, ({ many }) => ({
  credential: many(credential),
  sessions: many(session),
  applications: many(application),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const applicationRelations = relations(application, ({ one }) => ({
  user: one(user, {
    fields: [application.userId],
    references: [user.id],
  }),
  company: one(company, {
    fields: [application.companyId],
    references: [company.id],
  }),
}));
