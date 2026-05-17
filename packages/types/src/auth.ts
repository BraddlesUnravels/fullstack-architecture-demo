import { t, Static } from 'elysia';
import {
  register,
  registration,
  login,
  loggedin,
  logout,
  loggedout,
} from '@app/schemas/typebox/auth';

export type Login = Static<typeof login>;
export type Register = Static<typeof register>;
export type Registration = Static<typeof registration>;
export type LoggedIn = Static<typeof loggedin>;
export type Logout = Static<typeof logout>;
export type LoggedOut = Static<typeof loggedout>;
