import { userRepo } from '@app/db';
import type { InsertUserRow, UserRow, UpdateUserRow } from '@app/db/types';
import { serializeAuditDates } from '../../utils';
import {
  UserCreateFailedError,
  UserDeleteFailedError,
  UserEmailConflictError,
  UserNotFoundError,
  UserUpdateFailedError,
} from './errors.user';
import type {
  UserCreateBody,
  UserGetByEmailQuery,
  UserGetByIdParams,
  UserResponse,
  UserUpdateBody,
  UserDeleteResponse,
} from './models.user';

const toDbDate = (value: string | null | undefined): Date | null | undefined => {
  if (value === undefined || value === null) return value;

  return new Date(value);
};

const toInsertUserRow = (data: UserCreateBody): InsertUserRow => ({
  ...data,
  lastLoginAt: toDbDate(data.lastLoginAt),
});

const toUpdateUserRow = (data: UserUpdateBody): UpdateUserRow => ({
  ...data,
  lastLoginAt: toDbDate(data.lastLoginAt),
});

const findUserByEmail = async ({ email }: UserGetByEmailQuery): Promise<UserResponse> => {
  const user = await userRepo.findUserByEmail(email);

  if (!user || user.isDeleted)
    throw new UserNotFoundError('No user exists with the provided email');

  return serializeAuditDates(user);
};

const findUserById = async ({ id }: UserGetByIdParams): Promise<UserResponse> => {
  const user = await userRepo.findUserById(id);

  if (!user || user.isDeleted)
    throw new UserNotFoundError('No active user exists with the provided id');

  return serializeAuditDates(user);
};

const createUser = async (data: UserCreateBody): Promise<UserResponse> => {
  const existingUser = await userRepo.findUserByEmail(data.email);

  if (existingUser) throw new UserEmailConflictError();

  const newUser = await userRepo.createUser(toInsertUserRow(data));

  if (!newUser) throw new UserCreateFailedError();

  return serializeAuditDates(newUser);
};

const updateUser = async (id: string, data: UserUpdateBody): Promise<UserResponse> => {
  const updatedUser = await userRepo.updateUser(id, toUpdateUserRow(data));

  if (!updatedUser) throw new UserUpdateFailedError();

  return serializeAuditDates(updatedUser);
};

const deleteUser = async (id: string): Promise<UserDeleteResponse> => {
  const { success } = await userRepo.deleteUser(id);

  if (!success) throw new UserDeleteFailedError();

  return { success };
};

export const userService = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
};
