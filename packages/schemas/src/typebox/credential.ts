import { Boolean, Null, Object, Optional, String, Union } from '@sinclair/typebox';
import { auditColumns } from './audit';

export const credentialSelectSchema = Object(
  {
    id: String({ format: 'uuid' }),
    userId: String({ format: 'uuid' }),
    hash: String(),
    ...auditColumns.properties,
  },
  { additionalProperties: false },
);

export const credentialInsertSchema = Object(
  {
    userId: String({ format: 'uuid' }),
    hash: String(),
  },
  { additionalProperties: false },
);

export const credentialUpdateSchema = Object(
  {
    userId: Optional(String({ format: 'uuid' })),
    hash: Optional(String()),
    isDeleted: Optional(Boolean()),
  },
  { additionalProperties: false },
);
