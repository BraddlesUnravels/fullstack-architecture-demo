import { userRepo } from '@app/db';
import type { InsertUserRow, UpdateUserRow } from '@app/db/types';
import { serializeAuditDates, toDbDate } from '../../utils';
import {
  UserCreateFailedError,
  UserDeleteFailedError,
  UserEmailConflictError,
  UserNotFoundError,
  UserUpdateFailedError,
} from './errors.user';
import type {
  GetByEmail,
  GetById,
  UserInsert,
  UserUpdate,
  UserSelect,
  DeleteResponse,
} from '@app/types';

const toInsertUserRow = (data: UserInsert): InsertUserRow => ({
  ...data,
  lastLoginAt: toDbDate(data.lastLoginAt),
});

const toUpdateUserRow = (data: UserUpdate): UpdateUserRow => ({
  ...data,
  lastLoginAt: toDbDate(data.lastLoginAt),
});

const findUserByEmail = async ({ email }: GetByEmail): Promise<UserSelect> => {
  const [user] = await userRepo.findUserByEmail(email);

  if (!user || user.isDeleted)
    throw new UserNotFoundError('No user exists with the provided email');

  return serializeAuditDates(user);
};

const findUserById = async ({ id }: GetById): Promise<UserSelect> => {
  const [user] = await userRepo.findUserById(id);

  if (!user || user.isDeleted)
    throw new UserNotFoundError('No active user exists with the provided id');

  return serializeAuditDates(user);
};

const createUser = async (data: UserInsert): Promise<UserSelect> => {
  const [existingUser] = await userRepo.findUserByEmail(data.email);
  if (existingUser) throw new UserEmailConflictError();

  const [newUser] = await userRepo.createUser(toInsertUserRow(data));
  if (!newUser) throw new UserCreateFailedError();

  return serializeAuditDates(newUser);
};

const updateUser = async (id: string, data: UserUpdate): Promise<UserSelect> => {
  const [updatedUser] = await userRepo.updateUser(id, toUpdateUserRow(data));

  if (!updatedUser) throw new UserUpdateFailedError();

  return serializeAuditDates(updatedUser);
};

const deleteUser = async (id: string): Promise<DeleteResponse> => {
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
