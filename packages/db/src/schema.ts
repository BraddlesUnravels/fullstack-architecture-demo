import { relations } from 'drizzle-orm';
import { JobStatus } from '@app/constants/index';
import { pgTable, text, integer, timestamp, uuid, index } from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  updatedBy: uuid('updated_by'),
  deletedAt: timestamp('deleted_at'),
  deletedBy: uuid('deleted_by'),
};

export const users = pgTable(
  'users',
  (t) => ({
    id: t.uuid('id').primaryKey().defaultRandom(),
    email: t.text('email').notNull().unique(),
    firstName: t.text('first_name').notNull(),
    lastName: t.text('last_name').notNull(),
    passwordHash: t.text('password_hash').notNull(),
    isAdmin: t.boolean('is_admin').default(false).notNull(),
    ...timestamps,
  }),
  (t) => [index('idx_users_email').on(t.email)],
);

export const applications = pgTable(
  'applications',
  (t) => ({
    id: t.uuid('id').primaryKey().defaultRandom(),
    userId: t
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    companyId: t
      .uuid('company_id')
      .notNull()
      .references(() => companies.id),
    role: t.text('role').notNull(),
    status: t
      .text('status', {
        enum: [
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
    ...timestamps,
  }),
  (t) => [
    index('idx_applications_user_id').on(t.userId),
    index('idx_applications_company_id').on(t.companyId),
  ],
);

export const companies = pgTable('companies', (t) => ({
  id: t.uuid('id').primaryKey().defaultRandom(),
  name: t.text('name').notNull(),
  abn: t.text('abn').unique(),
  website: t.text('website'),
  jobDescription: t.text('job_description'),
  ...timestamps,
}));

export const usersRelations = relations(users, ({ many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [applications.companyId],
    references: [companies.id],
  }),
}));
