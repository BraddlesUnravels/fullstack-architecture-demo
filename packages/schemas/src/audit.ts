import * as v from 'valibot';

export const auditColumns = v.strictObject({
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  createdBy: v.union([v.pipe(v.string(), v.uuid()), v.null()]),

  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedBy: v.union([v.pipe(v.string(), v.uuid()), v.null()]),

  deletedAt: v.exactOptional(v.union([v.pipe(v.string(), v.isoTimestamp()), v.null()])),
  deletedBy: v.exactOptional(v.union([v.pipe(v.string(), v.uuid()), v.null()])),

  isDeleted: v.boolean(),

  version: v.pipe(v.number(), v.integer()),
});
