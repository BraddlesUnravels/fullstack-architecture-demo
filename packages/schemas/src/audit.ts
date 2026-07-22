import * as v from 'valibot';

export const auditColumns = v.strictObject({
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  createdBy: v.exactOptional(
    v.union([v.pipe(v.string(), v.uuid()), v.undefined()]),
  ),

  updatedAt: v.exactOptional(v.pipe(v.string(), v.isoTimestamp())),
  updatedBy: v.exactOptional(
    v.union([v.pipe(v.string(), v.uuid()), v.undefined()]),
  ),

  deletedAt: v.exactOptional(
    v.union([v.pipe(v.string(), v.isoTimestamp()), v.undefined()]),
  ),
  deletedBy: v.exactOptional(
    v.union([v.pipe(v.string(), v.uuid()), v.undefined()]),
  ),

  isDeleted: v.exactOptional(v.boolean()),

  verifiedAt: v.exactOptional(
    v.union([v.pipe(v.string(), v.isoTimestamp()), v.undefined()]),
  ),

  version: v.pipe(v.number(), v.integer()),
});
