import { t } from 'elysia';
import { JobStatus } from '@app/constants';
import { auditColumns } from './audit';

const applicationStatusSchema = t.Enum(JobStatus, {
  description: 'The status of the job application',
  default: JobStatus.ENTERED,
});

export const insertApplicationSchema = t.Object(
  {
    userId: t.String({ format: 'string' }),
    companyId: t.String({ format: 'string' }),
    role: t.String(),
    status: applicationStatusSchema,
    url: t.Optional(t.Union([t.String(), t.Null()])),
    notes: t.Optional(t.Union([t.String(), t.Null()])),
  },
  { additionalProperties: false },
);

export const updateApplicationSchema = t.Object(
  {
    userId: t.Optional(t.String({ format: 'string' })),
    companyId: t.Optional(t.String({ format: 'string' })),
    role: t.Optional(t.String()),
    status: t.Optional(applicationStatusSchema),
    url: t.Optional(t.Union([t.String(), t.Null()])),
    notes: t.Optional(t.Union([t.String(), t.Null()])),
  },
  { additionalProperties: false },
);

export const selectApplicationSchema = t.Object(
  {
    id: t.String({ format: 'string' }),
    userId: t.String({ format: 'string' }),
    companyId: t.String({ format: 'string' }),
    role: t.String(),
    status: applicationStatusSchema,
    url: t.Union([t.String(), t.Null()]),
    notes: t.Union([t.String(), t.Null()]),
    ...auditColumns.properties,
  },
  { additionalProperties: false },
);

export const listApplicationsSchema = t.Array(selectApplicationSchema);
