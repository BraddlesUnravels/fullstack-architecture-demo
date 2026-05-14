import { t } from 'elysia';

export const auditColumns = t.Object(
  {
    createdAt: t.String({ format: 'date-time' }),
    createdBy: t.Union([t.String({ format: 'uuid' }), t.Null()]),

    updatedAt: t.String({ format: 'date-time' }),
    updatedBy: t.Union([t.String({ format: 'uuid' }), t.Null()]),

    deletedAt: t.Union([t.String({ format: 'date-time' }), t.Null()]),
    deletedBy: t.Union([t.String({ format: 'uuid' }), t.Null()]),

    isDeleted: t.Boolean(),

    version: t.Integer(),
  },
  { additionalProperties: false },
);
