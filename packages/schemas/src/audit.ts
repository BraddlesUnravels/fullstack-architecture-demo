import * as v from 'valibot';

const uuidSchema = v.pipe(v.string(), v.uuid());
const timestampSchema = v.pipe(v.string(), v.isoTimestamp());

const optionalUuidSchema = v.exactOptional(
  v.union([uuidSchema, v.undefined()]),
);

const optionalTimestampSchema = v.exactOptional(
  v.union([timestampSchema, v.undefined()]),
);

export const auditColumns = v.strictObject({
  createdAt: timestampSchema,
  createdBy: optionalUuidSchema,

  updatedAt: timestampSchema,
  updatedBy: optionalUuidSchema,

  isDeleted: v.boolean(),

  deletedAt: optionalTimestampSchema,
  deletedBy: optionalUuidSchema,

  version: v.pipe(v.number(), v.integer()),
});
