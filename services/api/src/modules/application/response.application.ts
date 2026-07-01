import { apiErrorResponseSchema } from '@app/schemas';
import { ApplicationModel } from './models.application';

const readApplicationResponse = {
  200: ApplicationModel.select,
  401: apiErrorResponseSchema,
  404: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

const listApplicationsResponse = {
  200: ApplicationModel.list,
  401: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

const createApplicationResponse = {
  201: ApplicationModel.select,
  401: apiErrorResponseSchema,
  409: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

const mutateApplicationResponse = {
  200: ApplicationModel.select,
  401: apiErrorResponseSchema,
  404: apiErrorResponseSchema,
  422: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

export const ApplicationResponse = {
  readOne: readApplicationResponse,
  list: listApplicationsResponse,
  create: createApplicationResponse,
  update: mutateApplicationResponse,
  delete: ApplicationModel.delete,
} as const;
