import type * as v from 'valibot';
import type {
  selectApplicationSchema,
  insertApplicationSchema,
  updateApplicationSchema,
} from '@app/schemas';

export type ApplicationSelect = v.InferInput<typeof selectApplicationSchema>;
export type ApplicationInsert = v.InferInput<typeof insertApplicationSchema>;
export type ApplicationUpdate = v.InferInput<typeof updateApplicationSchema>;
