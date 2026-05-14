import { t } from 'elysia';
import { auditColumns } from './audit';

export const credentialSelectSchema = t.Object(
  {
    id: t.String({ format: 'uuid' }),
    userId: t.String({ format: 'uuid' }),
    hash: t.String(),
    ...auditColumns.properties,
  },
  { additionalProperties: false },
);

export const credentialInsertSchema = t.Object(
  {
    userId: t.String({ format: 'uuid' }),
    hash: t.String(),
  },
  { additionalProperties: false },
);

export const credentialUpdateSchema = t.Object(
  {
    userId: t.Optional(t.String({ format: 'uuid' })),
    hash: t.Optional(t.String()),
    isDeleted: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);
