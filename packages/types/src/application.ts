import type * as v from 'valibot';
import type {
  selectApplicationSchema,
  insertApplicationSchema,
  updateApplicationSchema,
} from '@app/schemas';
import type { NullToUndefined } from '@app/types';

export type ApplicationSelect = NullToUndefined<v.InferInput<typeof selectApplicationSchema>>;
export type ApplicationInsert = v.InferInput<typeof insertApplicationSchema>;
export type ApplicationUpdate = v.InferInput<typeof updateApplicationSchema>;
