import {
  applicationResponseSchema,
  createApplicationInputSchema,
  deleteSchema,
  getById,
  listApplicationsSchema,
  updateApplicationInputSchema,
} from '@app/schemas';

export const ApplicationModel = {
  getById,
  create: createApplicationInputSchema,
  update: updateApplicationInputSchema,
  select: applicationResponseSchema,
  list: listApplicationsSchema,
  delete: deleteSchema,
} as const;
