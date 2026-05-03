import { Boolean, Object, Optional, String } from '@sinclair/typebox';
import { recordBase } from './base-record';

export const userSelectSchema = Object(
  {
    id: String({ format: 'uuid' }),
    email: String({ format: 'email' }),
    firstName: String(),
    lastName: String(),
    isAdmin: Boolean(),
    ...recordBase.properties,
  },
  { additionalProperties: false },
);

export const userInsertSchema = Object(
  {
    email: String({ format: 'email' }),
    firstName: String(),
    lastName: String(),
    password: String(),
    isAdmin: Optional(Boolean({ default: false })),
  },
  { additionalProperties: false },
);

export const userUpdateSchema = Object(
  {
    email: Optional(String({ format: 'email' })),
    firstName: Optional(String()),
    lastName: Optional(String()),
    password: Optional(String()),
    isAdmin: Optional(Boolean()),
  },
  { additionalProperties: false },
);
