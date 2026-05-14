import type { Static } from 'elysia';
import {
  companySelectSchema,
  companyInsertSchema,
  companyUpdateSchema,
} from '@app/schemas/typebox';

export type CompanySelect = Static<typeof companySelectSchema>;
export type CompanyInsert = Static<typeof companyInsertSchema>;
export type CompanyUpdate = Static<typeof companyUpdateSchema>;
