import {
  userSelectSchema,
  userInsertSchema,
  userUpdateSchema,
  getByEmail,
  getById,
  deleteSchema,
} from '@app/schemas/typebox';

export const UserModel = {
  getByEmail,
  getById,
  create: userInsertSchema,
  update: userUpdateSchema,
  select: userSelectSchema,
  delete: deleteSchema,
} as const;
