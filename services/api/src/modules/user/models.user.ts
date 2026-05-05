import { t, type Static } from 'elysia';
import { userSelectSchema, userInsertSchema, userUpdateSchema } from '@app/schemas/typebox';
import { apiErrorResponseSchema } from '../../errors';

const getByEmailQuery = t.Object({
  email: t.String({ format: 'email', error: 'The email address of the user' }),
});

const getByIdParams = t.Object({
  id: t.String({ format: 'uuid', error: 'Invalid ID format' }),
});

export const UserModel = {
  getByEmailQuery,
  getByIdParams,
  createBody: userInsertSchema,
  updateBody: userUpdateSchema,
  res: userSelectSchema,
  apiError: apiErrorResponseSchema,
} as const;

export type UserGetByEmailQuery = Static<typeof getByEmailQuery>;
export type UserGetByIdParams = Static<typeof getByIdParams>;
export type UserCreateBody = Static<typeof userInsertSchema>;
export type UserUpdateBody = Static<typeof userUpdateSchema>;
export type UserResponse = Static<typeof userSelectSchema>;
export type ApiErrorResponse = Static<typeof apiErrorResponseSchema>;
