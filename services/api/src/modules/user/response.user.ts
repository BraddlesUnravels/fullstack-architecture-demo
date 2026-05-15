import { UserModel } from './models.user';

const readUserResponse = {
  200: UserModel.res,
  404: UserModel.apiError,
  500: UserModel.apiError,
} as const;

const createUserResponse = {
  201: UserModel.res,
  409: UserModel.apiError,
  500: UserModel.apiError,
} as const;

const mutateUserResponse = {
  200: UserModel.res,
  404: UserModel.apiError,
  422: UserModel.apiError,
  500: UserModel.apiError,
} as const;

const deleteUserResponse = {
  204: UserModel.deleteRes,
  404: UserModel.apiError,
  500: UserModel.apiError,
} as const;

export const UserResponse = {
  read: readUserResponse,
  create: createUserResponse,
  mutate: mutateUserResponse,
  delete: deleteUserResponse,
} as const;
