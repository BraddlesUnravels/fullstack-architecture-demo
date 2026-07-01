import * as v from 'valibot';
import { auditColumns } from './audit';

const uuidSchema = v.pipe(v.string(), v.uuid());
const dateTimeSchema = v.pipe(v.string(), v.isoTimestamp());
const nullableStringSchema = v.nullable(v.string());
const nullableDateTimeSchema = v.nullable(dateTimeSchema);

export const sessionSelectSchema = v.strictObject({
  id: uuidSchema,
  userId: uuidSchema,
  expiresAt: dateTimeSchema,
  revokedAt: nullableDateTimeSchema,
  userAgent: nullableStringSchema,
  ipAddress: nullableStringSchema,
  ...auditColumns.entries,
});

export const sessionInsertSchema = v.strictObject({
  userId: uuidSchema,
  expiresAt: dateTimeSchema,
  revokedAt: v.optional(nullableDateTimeSchema),
  userAgent: v.optional(nullableStringSchema),
  ipAddress: v.optional(nullableStringSchema),
});

export const sessionUpdateSchema = v.strictObject({
  userId: v.optional(uuidSchema),
  expiresAt: v.optional(dateTimeSchema),
  revokedAt: v.optional(nullableDateTimeSchema),
  userAgent: v.optional(nullableStringSchema),
  ipAddress: v.optional(nullableStringSchema),
});
