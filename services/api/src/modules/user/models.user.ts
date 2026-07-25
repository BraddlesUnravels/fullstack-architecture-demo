import {
  userSelectSchema,
  userInsertSchema,
  userUpdateSchema,
  getByEmail,
  getById,
  deleteSchema,
} from '@app/schemas';

export const UserModel = {
  getByEmail,
  getById,
  summary: userSelectSchema,
  create: userInsertSchema,
  update: userUpdateSchema,
  select: userSelectSchema,
  delete: deleteSchema,
} as const;
