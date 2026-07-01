import type * as v from 'valibot';
import type {
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
} from '@app/schemas';
import type { NullToUndefined } from '@app/types';

export type LoginInput = v.InferInput<typeof login & { req?: Request }>;
export type Register = v.InferInput<typeof register>;
export type Registration = v.InferInput<typeof registration>;
export type VerifyEmail = v.InferInput<typeof verifyEmail>;
export type VerifiedEmail = v.InferInput<typeof verifiedEmail>;
export type CompleteRegistration = v.InferInput<typeof completeRegistration>;
export type CompletedRegistration = v.InferInput<typeof completedRegistration>;
export type LoggedIn = NullToUndefined<v.InferInput<typeof loggedin>>;
export type Logout = v.InferInput<typeof logout>;
export type LoggedOut = v.InferInput<typeof loggedout>;
