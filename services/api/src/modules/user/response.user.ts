import { UserModel } from './models.user';
import { apiErrorResponseSchema } from '@app/schemas';

const readUserResponse = {
  200: UserModel.select,
  404: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

const createUserResponse = {
  201: UserModel.select,
  409: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

const mutateUserResponse = {
  200: UserModel.select,
  404: apiErrorResponseSchema,
  422: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

const deleteUserResponse = {
  204: UserModel.delete,
  404: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

export const UserResponse = {
  read: readUserResponse,
  create: createUserResponse,
  mutate: mutateUserResponse,
  delete: deleteUserResponse,
} as const;
