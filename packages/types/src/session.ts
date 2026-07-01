import type * as v from 'valibot';
import type { sessionSelectSchema, sessionInsertSchema, sessionUpdateSchema } from '@app/schemas';

export type SessionSelect = v.InferInput<typeof sessionSelectSchema>;
export type SessionInsert = v.InferInput<typeof sessionInsertSchema>;
export type SessionUpdate = v.InferInput<typeof sessionUpdateSchema>;
