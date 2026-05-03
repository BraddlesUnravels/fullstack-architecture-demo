import { Static } from '@sinclair/typebox';
import { userSelectSchema, userInsertSchema, userUpdateSchema } from '@app/schemas/typebox';

export type UserSelect = Static<typeof userSelectSchema>;
export type UserInsert = Static<typeof userInsertSchema>;
export type UserUpdate = Static<typeof userUpdateSchema>;
