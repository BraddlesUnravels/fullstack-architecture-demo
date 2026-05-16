import { AuthModel } from './models.auth';
import { apiErrorResponseSchema } from '@app/schemas';

export const loginResponse = {
  200: AuthModel.loggedin,
  400: apiErrorResponseSchema,
  401: apiErrorResponseSchema,
  404: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

export const logoutResponse = {
  200: AuthModel.loggedout,
  404: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

export const registrationResponse = {
  200: AuthModel.registration,
  400: apiErrorResponseSchema,
  409: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;
