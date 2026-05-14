import { t } from 'elysia';
import { auditColumns } from './audit';

export const sessionSelectSchema = t.Object(
  {
    id: t.String({ format: 'uuid' }),
    userId: t.String({ format: 'uuid' }),
    expiresAt: t.String({ format: 'date-time' }),
    revokedAt: t.Union([t.String({ format: 'date-time' }), t.Null()]),
    userAgent: t.Union([t.String(), t.Null()]),
    ipAddress: t.Union([t.String(), t.Null()]),
    ...auditColumns.properties,
  },
  { additionalProperties: false },
);

export const sessionInsertSchema = t.Object(
  {
    userId: t.String({ format: 'uuid' }),
    expiresAt: t.String({ format: 'date-time' }),
    revokedAt: t.Optional(t.Union([t.String({ format: 'date-time' }), t.Null()])),
    userAgent: t.Optional(t.Union([t.String(), t.Null()])),
    ipAddress: t.Optional(t.Union([t.String(), t.Null()])),
  },
  { additionalProperties: false },
);

export const sessionUpdateSchema = t.Object(
  {
    userId: t.Optional(t.String({ format: 'uuid' })),
    expiresAt: t.Optional(t.String({ format: 'date-time' })),
    revokedAt: t.Optional(t.Union([t.String({ format: 'date-time' }), t.Null()])),
    userAgent: t.Optional(t.Union([t.String(), t.Null()])),
    ipAddress: t.Optional(t.Union([t.String(), t.Null()])),
  },
  { additionalProperties: false },
);
