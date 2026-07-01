import * as v from 'valibot';
import { auditColumns } from './audit';

const uuidSchema = v.pipe(v.string(), v.uuid());

export const credentialSelectSchema = v.strictObject({
  id: uuidSchema,
  userId: uuidSchema,
  hash: v.string(),
  ...auditColumns.entries,
});

export const credentialInsertSchema = v.strictObject({
  userId: uuidSchema,
  hash: v.string(),
});

export const credentialUpdateSchema = v.strictObject({
  userId: v.optional(uuidSchema),
  hash: v.optional(v.string()),
  isDeleted: v.optional(v.boolean()),
});
