import type * as v from 'valibot';
import type { register, registration, login, loggedin, logout, loggedout } from '@app/schemas';

export type LoginInput = v.InferInput<typeof login & { req?: Request }>;
export type Register = v.InferInput<typeof register>;
export type Registration = v.InferInput<typeof registration>;
export type LoggedIn = v.InferInput<typeof loggedin>;
export type Logout = v.InferInput<typeof logout>;
export type LoggedOut = v.InferInput<typeof loggedout>;
