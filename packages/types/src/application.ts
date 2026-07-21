import type * as v from 'valibot';
import type {
  selectApplicationSchema,
  insertApplicationSchema,
  updateApplicationSchema,
  applicationSummarySchema,
  listApplicationsSchema,
} from '@app/schemas';
import type { NullToUndefined } from '@app/types';

export type ApplicationSelect = NullToUndefined<v.InferInput<typeof selectApplicationSchema>>;
export type ApplicationInsert = v.InferInput<typeof insertApplicationSchema>;
export type ApplicationUpdate = v.InferInput<typeof updateApplicationSchema>;
export type ApplicationSummary = NullToUndefined<v.InferInput<typeof applicationSummarySchema>>;
export type ApplicationSummaryList = NullToUndefined<v.InferInput<typeof listApplicationsSchema>>;
