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
  401: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

export const registrationResponse = {
  200: AuthModel.registration,
  401: apiErrorResponseSchema,
  410: apiErrorResponseSchema,
  422: apiErrorResponseSchema,
  409: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

export const verifyEmailResponse = {
  200: AuthModel.verifiedEmail,
  409: apiErrorResponseSchema,
  410: apiErrorResponseSchema,
  422: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;

export const completeRegistrationResponse = {
  200: AuthModel.completedRegistration,
  400: apiErrorResponseSchema,
  401: apiErrorResponseSchema,
  410: apiErrorResponseSchema,
  422: apiErrorResponseSchema,
  500: apiErrorResponseSchema,
} as const;
