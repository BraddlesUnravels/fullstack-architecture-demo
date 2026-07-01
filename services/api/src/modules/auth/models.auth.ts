import {
  login,
  loggedin,
  logout,
  loggedout,
  register,
  registration,
  verifyEmail,
  verifiedEmail,
  completeRegistration,
  completedRegistration,
} from '@app/schemas';

export const AuthModel = {
  register,
  registration,
  verifyEmail,
  verifiedEmail,
  completeRegistration,
  completedRegistration,
  login,
  loggedin,
  logout,
  loggedout,
} as const;
