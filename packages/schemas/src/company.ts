import * as v from 'valibot';
import { auditColumns } from './audit';

const nullableStringSchema = v.nullable(v.string());

export const companySelectSchema = v.strictObject({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  abn: nullableStringSchema,
  website: nullableStringSchema,
  jobDescription: nullableStringSchema,
  ...auditColumns.entries,
});

export const companyInsertSchema = v.strictObject({
  name: v.string(),
  abn: v.optional(nullableStringSchema),
  website: v.optional(nullableStringSchema),
  jobDescription: v.optional(nullableStringSchema),
});

export const companyUpdateSchema = v.strictObject({
  name: v.optional(v.string()),
  abn: v.optional(nullableStringSchema),
  website: v.optional(nullableStringSchema),
  jobDescription: v.optional(nullableStringSchema),
});
