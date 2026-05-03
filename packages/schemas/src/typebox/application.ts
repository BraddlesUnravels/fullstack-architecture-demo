import { Null, Object, Optional, String, Union } from '@sinclair/typebox';
import { JobStatus } from '@app/constants';
import { auditColumns } from './audit';

const applicationStatusSchema = Union([
  String({ enum: [JobStatus.APPLIED] }),
  String({ enum: [JobStatus.INTERVIEW] }),
  String({ enum: [JobStatus.OFFER] }),
  String({ enum: [JobStatus.ACCEPTED] }),
  String({ enum: [JobStatus.REJECTED] }),
]);

export const applicationSelectSchema = Object(
  {
    id: String({ format: 'uuid' }),
    userId: String({ format: 'uuid' }),
    companyId: String({ format: 'uuid' }),
    role: String(),
    status: applicationStatusSchema,
    url: Union([String(), Null()]),
    notes: Union([String(), Null()]),
    ...auditColumns.properties,
  },
  { additionalProperties: false },
);

export const applicationInsertSchema = Object(
  {
    userId: String({ format: 'uuid' }),
    companyId: String({ format: 'uuid' }),
    role: String(),
    status: Optional(
      Union(
        [
          String({ enum: [JobStatus.APPLIED] }),
          String({ enum: [JobStatus.INTERVIEW] }),
          String({ enum: [JobStatus.OFFER] }),
          String({ enum: [JobStatus.ACCEPTED] }),
          String({ enum: [JobStatus.REJECTED] }),
        ],
        { default: JobStatus.APPLIED },
      ),
    ),
    url: Optional(Union([String(), Null()])),
    notes: Optional(Union([String(), Null()])),
  },
  { additionalProperties: false },
);

export const applicationUpdateSchema = Object(
  {
    userId: Optional(String({ format: 'uuid' })),
    companyId: Optional(String({ format: 'uuid' })),
    role: Optional(String()),
    status: Optional(applicationStatusSchema),
    url: Optional(Union([String(), Null()])),
    notes: Optional(Union([String(), Null()])),
  },
  { additionalProperties: false },
);
