import type * as v from 'valibot';
import type { userSelectSchema, userInsertSchema, userUpdateSchema } from '@app/schemas';
import type { NullToUndefined } from '@app/types';

export type UserSelect = NullToUndefined<v.InferInput<typeof userSelectSchema>>;
export type UserInsert = v.InferInput<typeof userInsertSchema>;
export type UserUpdate = v.InferInput<typeof userUpdateSchema>;
