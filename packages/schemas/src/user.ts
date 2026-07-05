import * as v from 'valibot';
import { auditColumns } from './audit';
import { UserTier } from '@app/constants';

export const userSelectSchema = v.strictObject({
  id: v.pipe(v.string(), v.uuid()),
  email: v.pipe(v.string(), v.email()),
  firstName: v.exactOptional(v.union([v.string(), v.undefined()])),
  lastName: v.exactOptional(v.union([v.string(), v.undefined()])),
  isLocked: v.boolean(),
  tier: v.enum(UserTier),
  lastLoginAt: v.exactOptional(v.union([v.pipe(v.string(), v.isoTimestamp()), v.undefined()])),
  ...auditColumns.entries,
});

export const userInsertSchema = v.strictObject({
  email: v.pipe(v.string(), v.email()),
  firstName: v.exactOptional(v.string()),
  lastName: v.exactOptional(v.string()),
  isLocked: v.exactOptional(v.boolean()),
  tier: v.exactOptional(v.enum(UserTier)),
  lastLoginAt: v.exactOptional(v.union([v.pipe(v.string(), v.isoTimestamp()), v.undefined()])),
});

export const userUpdateSchema = v.strictObject({
  email: v.exactOptional(v.pipe(v.string(), v.email())),
  firstName: v.exactOptional(v.string()),
  lastName: v.exactOptional(v.string()),
  isLocked: v.exactOptional(v.boolean()),
  tier: v.exactOptional(v.enum(UserTier)),
  lastLoginAt: v.exactOptional(v.union([v.pipe(v.string(), v.isoTimestamp()), v.undefined()])),
});
