import { t } from 'elysia';
import { JobStatus } from '@app/constants';
import { auditColumns } from './audit';

const applicationStatusSchema = t.Union([
  t.String({ enum: [JobStatus.APPLIED] }),
  t.String({ enum: [JobStatus.INTERVIEW] }),
  t.String({ enum: [JobStatus.OFFER] }),
  t.String({ enum: [JobStatus.ACCEPTED] }),
  t.String({ enum: [JobStatus.REJECTED] }),
]);

export const applicationSelectSchema = t.Object(
  {
    id: t.String({ format: 'uuid' }),
    userId: t.String({ format: 'uuid' }),
    companyId: t.String({ format: 'uuid' }),
    role: t.String(),
    status: applicationStatusSchema,
    url: t.Union([t.String(), t.Null()]),
    notes: t.Union([t.String(), t.Null()]),
    ...auditColumns.properties,
  },
  { additionalProperties: false },
);

export const applicationInsertSchema = t.Object(
  {
    userId: t.String({ format: 'uuid' }),
    companyId: t.String({ format: 'uuid' }),
    role: t.String(),
    status: t.Optional(
      t.Union(
        [
          t.String({ enum: [JobStatus.APPLIED] }),
          t.String({ enum: [JobStatus.INTERVIEW] }),
          t.String({ enum: [JobStatus.OFFER] }),
          t.String({ enum: [JobStatus.ACCEPTED] }),
          t.String({ enum: [JobStatus.REJECTED] }),
        ],
        { default: JobStatus.APPLIED },
      ),
    ),
    url: t.Optional(t.Union([t.String(), t.Null()])),
    notes: t.Optional(t.Union([t.String(), t.Null()])),
  },
  { additionalProperties: false },
);

export const applicationUpdateSchema = t.Object(
  {
    userId: t.Optional(t.String({ format: 'uuid' })),
    companyId: t.Optional(t.String({ format: 'uuid' })),
    role: t.Optional(t.String()),
    status: t.Optional(applicationStatusSchema),
    url: t.Optional(t.Union([t.String(), t.Null()])),
    notes: t.Optional(t.Union([t.String(), t.Null()])),
  },
  { additionalProperties: false },
);
