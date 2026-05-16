import { login, loggedin, logout, loggedout, register, registration } from '@app/schemas';

export const AuthModel = {
  register,
  registration,
  login,
  loggedin,
  logout,
  loggedout,
} as const;
