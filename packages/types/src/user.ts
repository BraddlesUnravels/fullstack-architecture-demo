import type * as v from 'valibot';
import type { userSelectSchema, userInsertSchema, userUpdateSchema } from '@app/schemas';

export type UserSelect = v.InferInput<typeof userSelectSchema>;
export type UserInsert = v.InferInput<typeof userInsertSchema>;
export type UserUpdate = v.InferInput<typeof userUpdateSchema>;
