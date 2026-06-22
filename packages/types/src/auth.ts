import type { Static } from 'elysia';
import type {
  register,
  registration,
  login,
  loggedin,
  logout,
  loggedout,
} from '@app/schemas/typebox/auth';

type Login = Static<typeof login>;
export type LoginInput = Login & { req?: Request };
export type Register = Static<typeof register>;
export type Registration = Static<typeof registration>;
export type LoggedIn = Static<typeof loggedin>;
export type Logout = Static<typeof logout>;
export type LoggedOut = Static<typeof loggedout>;
