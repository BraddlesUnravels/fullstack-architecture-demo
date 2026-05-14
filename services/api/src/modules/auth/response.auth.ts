import { AuthModel } from './models.auth';

export const loginResponse = {
  200: AuthModel.resLogin,
  401: AuthModel.apiError,
  500: AuthModel.apiError,
} as const;

export const registerResponse = {
  201: AuthModel.resRegister,
  409: AuthModel.apiError,
  500: AuthModel.apiError,
} as const;

export const logoutResponse = {
  200: AuthModel.logoutResponse,
  401: AuthModel.apiError,
  500: AuthModel.apiError,
} as const;
