import { userRepo } from '@app/db';
import type { InsertUserRow, UserRow, UpdateUserRow } from '@app/db/types';
import { serializeAuditDates } from '../../utils';
import {
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
} from './models.user';

const serializeUser = (user: UserRow): UserResponse => serializeAuditDates(user);

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

  if (!user || user.isDeleted) throw new UserNotFoundError('No user exists with the provided email');

  return serializeUser(user);
};

const findUserById = async ({ id }: UserGetByIdParams): Promise<UserResponse> => {
  const user = await userRepo.findUserById(id);

  if (!user || user.isDeleted) throw new UserNotFoundError('No active user exists with the provided id');

  return serializeUser(user);
};

const createUser = async (data: UserCreateBody): Promise<UserResponse> => {
  const existingUser = await userRepo.findUserByEmail(data.email);

  if (existingUser) throw new UserEmailConflictError();

  const newUser = await userRepo.createUser(toInsertUserRow(data));

  return serializeUser(newUser);
};

const updateUser = async (id: string, data: UserUpdateBody): Promise<UserResponse> => {
  await findUserById({ id });

  try {
    const updatedUser = await userRepo.updateUser(id, toUpdateUserRow(data));

    return serializeUser(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.message === 'Failed to update user') {
      throw new UserUpdateFailedError();
    }

    throw error;
  }
};

const deleteUser = async (id: string): Promise<UserResponse> => {
  await findUserById({ id });

  try {
    const deletedUser = await userRepo.deleteUser(id);

    return serializeUser(deletedUser);
  } catch (error) {
    if (error instanceof Error && error.message === 'Failed to delete user') {
      throw new UserDeleteFailedError();
    }

    throw error;
  }
};

export const userService = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
};