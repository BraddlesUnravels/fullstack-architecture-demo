import * as v from 'valibot';
import { JobStatus } from '@app/constants';
import { auditColumns } from './audit';

const applicationStatusSchema = v.pipe(
  v.enum(JobStatus),
  v.description('The status of the job application'),
);

export const insertApplicationSchema = v.strictObject({
  userId: v.string(),
  companyId: v.string(),
  role: v.string(),
  status: v.optional(applicationStatusSchema, JobStatus.ENTERED),
  url: v.optional(v.nullable(v.string())),
  notes: v.optional(v.nullable(v.string())),
});

export const updateApplicationSchema = v.strictObject({
  userId: v.optional(v.string()),
  companyId: v.optional(v.string()),
  role: v.optional(v.string()),
  status: v.optional(applicationStatusSchema),
  url: v.optional(v.nullable(v.string())),
  notes: v.optional(v.nullable(v.string())),
});

export const selectApplicationSchema = v.strictObject({
  id: v.string(),
  userId: v.string(),
  companyId: v.string(),
  role: v.string(),
  status: applicationStatusSchema,
  url: v.exactOptional(v.union([v.string(), v.undefined()])),
  notes: v.exactOptional(v.union([v.string(), v.undefined()])),
  ...auditColumns.entries,
});

export const applicationSummarySchema = v.strictObject({
  id: v.string(),
  role: v.string(),
  status: applicationStatusSchema,
  notes: v.exactOptional(v.union([v.string(), v.undefined()])),
  createdAt: v.exactOptional(v.union([v.date(), v.undefined()])),
  updatedAt: v.exactOptional(v.union([v.date(), v.undefined()])),
  company: v.strictObject({
    name: v.string(),
    website: v.exactOptional(v.union([v.string(), v.undefined()])),
    jobDescription: v.exactOptional(v.union([v.string(), v.undefined()])),
    abn: v.exactOptional(v.union([v.string(), v.undefined()])),
  }),
});

export const listApplicationsSchema = v.array(applicationSummarySchema);
