import * as v from 'valibot';
import { JobStatus } from './domain-constants';
import { auditColumns } from './audit';

const uuidSchema = v.pipe(v.string(), v.uuid());

const applicationStatusSchema = v.pipe(
  v.enum(JobStatus),
  v.description('The status of the job application'),
);

const applicationRoleSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'Role is required'),
  v.maxLength(200, 'Role must not exceed 200 characters'),
);

const optionalNullableUrlSchema = v.optional(
  v.nullable(v.pipe(v.string(), v.url('A valid URL is required'))),
);

const optionalNullableTextSchema = v.optional(v.nullable(v.string()));

const optionalResponseStringSchema = v.exactOptional(
  v.union([v.string(), v.undefined()]),
);

const optionalResponseUrlSchema = v.exactOptional(
  v.union([
    v.pipe(v.string(), v.url('Application URL must be valid')),
    v.undefined(),
  ]),
);

/**
 * Fields controlled by the caller when creating an application.
 *
 * userId is deliberately excluded because it comes from the authenticated
 * session rather than the request body.
 */
export const createApplicationInputSchema = v.strictObject({
  companyId: uuidSchema,
  role: applicationRoleSchema,
  status: v.optional(applicationStatusSchema, JobStatus.ENTERED),
  url: optionalNullableUrlSchema,
  notes: optionalNullableTextSchema,
});

/**
 * Fields that a caller may modify.
 *
 * Ownership, identifiers, audit fields and soft-delete fields are deliberately
 * excluded from the public update contract.
 */
export const updateApplicationInputSchema = v.strictObject({
  companyId: v.optional(uuidSchema),
  role: v.optional(applicationRoleSchema),
  status: v.optional(applicationStatusSchema),
  url: optionalNullableUrlSchema,
  notes: optionalNullableTextSchema,
});

export const applicationResponseSchema = v.strictObject({
  id: uuidSchema,
  companyId: uuidSchema,
  role: v.string(),
  status: applicationStatusSchema,
  url: optionalResponseUrlSchema,
  notes: optionalResponseStringSchema,
  ...auditColumns.entries,
});

export const applicationSummarySchema = v.strictObject({
  id: uuidSchema,
  role: v.string(),
  status: applicationStatusSchema,
  notes: optionalResponseStringSchema,
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
  company: v.strictObject({
    name: v.string(),
    website: optionalResponseUrlSchema,
    jobDescription: optionalResponseStringSchema,
    abn: optionalResponseStringSchema,
  }),
});

export const listApplicationsSchema = v.array(applicationSummarySchema);
