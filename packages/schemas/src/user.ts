import * as v from 'valibot';
import { auditColumns } from './audit';

export const userSelectSchema = v.strictObject({
  id: v.pipe(v.string(), v.uuid()),
  email: v.pipe(v.string(), v.email()),
  firstName: v.string(),
  lastName: v.string(),
  isLocked: v.exactOptional(v.boolean()),
  isAdmin: v.exactOptional(v.boolean()),
  lastLoginAt: v.exactOptional(v.union([v.pipe(v.string(), v.isoTimestamp()), v.null()])),
  ...auditColumns.entries,
});

export const userInsertSchema = v.strictObject({
  email: v.pipe(v.string(), v.email()),
  firstName: v.string(),
  lastName: v.string(),
  isLocked: v.exactOptional(v.boolean()),
  isAdmin: v.exactOptional(v.boolean()),
  lastLoginAt: v.exactOptional(v.union([v.pipe(v.string(), v.isoTimestamp()), v.null()])),
});

export const userUpdateSchema = v.strictObject({
  email: v.exactOptional(v.pipe(v.string(), v.email())),
  firstName: v.exactOptional(v.string()),
  lastName: v.exactOptional(v.string()),
  isLocked: v.exactOptional(v.boolean()),
  isAdmin: v.exactOptional(v.boolean()),
  lastLoginAt: v.exactOptional(v.union([v.pipe(v.string(), v.isoTimestamp()), v.null()])),
});
