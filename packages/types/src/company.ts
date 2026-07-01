import type * as v from 'valibot';
import type { companySelectSchema, companyInsertSchema, companyUpdateSchema } from '@app/schemas';

export type CompanySelect = v.InferInput<typeof companySelectSchema>;
export type CompanyInsert = v.InferInput<typeof companyInsertSchema>;
export type CompanyUpdate = v.InferInput<typeof companyUpdateSchema>;
