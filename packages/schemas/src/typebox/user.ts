import { Boolean, Null, Object, Optional, String, Union, Date } from '@sinclair/typebox';
import { auditColumns } from './audit';

export const userSelectSchema = Object(
  {
    id: String({ format: 'uuid' }),
    email: String({ format: 'email' }),
    firstName: String(),
    lastName: String(),
    isLocked: Optional(Boolean({ default: false })),
    isAdmin: Optional(Boolean({ default: false })),
    lastLoginAt: Union([String(), Null()]),
    ...auditColumns.properties,
  },
  { additionalProperties: false },
);

export const userInsertSchema = Object(
  {
    email: String({ format: 'email' }),
    firstName: String(),
    lastName: String(),
    isLocked: Optional(Boolean({ default: false })),
    isAdmin: Optional(Boolean({ default: false })),
    lastLoginAt: Optional(Union([String({ format: 'date-time' }), Null()])),
  },
  { additionalProperties: false },
);

export const userUpdateSchema = Object(
  {
    email: Optional(String({ format: 'email' })),
    firstName: Optional(String()),
    lastName: Optional(String()),
    isLocked: Optional(Boolean({ default: false })),
    isAdmin: Optional(Boolean({ default: false })),
    lastLoginAt: Optional(Union([String({ format: 'date-time' }), Null()])),
  },
  { additionalProperties: false },
);
