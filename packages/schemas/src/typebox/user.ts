import { t } from 'elysia';
import { auditColumns } from './audit';

export const userSelectSchema = t.Object(
  {
    id: t.String({ format: 'uuid' }),
    email: t.String({ format: 'email' }),
    firstName: t.String(),
    lastName: t.String(),
    isLocked: t.Optional(t.Boolean({ default: false })),
    isAdmin: t.Optional(t.Boolean({ default: false })),
    lastLoginAt: t.Union([t.String({ format: 'date-time' }), t.Null()]),
    ...auditColumns.properties,
  },
  { additionalProperties: false },
);

export const userInsertSchema = t.Object(
  {
    email: t.String({ format: 'email' }),
    firstName: t.String(),
    lastName: t.String(),
    isLocked: t.Optional(t.Boolean({ default: false })),
    isAdmin: t.Optional(t.Boolean({ default: false })),
    lastLoginAt: t.Optional(t.Union([t.String({ format: 'date-time' }), t.Null()])),
  },
  { additionalProperties: false },
);

export const userUpdateSchema = t.Object(
  {
    email: t.Optional(t.String({ format: 'email' })),
    firstName: t.Optional(t.String()),
    lastName: t.Optional(t.String()),
    isLocked: t.Optional(t.Boolean({ default: false })),
    isAdmin: t.Optional(t.Boolean({ default: false })),
    lastLoginAt: t.Optional(t.Union([t.String({ format: 'date-time' }), t.Null()])),
  },
  { additionalProperties: false },
);
