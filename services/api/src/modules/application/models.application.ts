import {
  getById,
  insertApplicationSchema,
  updateApplicationSchema,
  selectApplicationSchema,
  listApplicationsSchema,
  deleteSchema,
} from '@app/schemas/typebox';

export const ApplicationModel = {
  getById,
  create: insertApplicationSchema,
  update: updateApplicationSchema,
  select: selectApplicationSchema,
  list: listApplicationsSchema,
  delete: deleteSchema,
} as const;
