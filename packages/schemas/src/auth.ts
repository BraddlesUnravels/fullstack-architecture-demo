import * as v from 'valibot';
import { userSelectSchema } from './user';

export const login = v.strictObject({
  email: v.message(v.pipe(v.string(), v.email()), 'The email address of the user'),
  password: v.message(
    v.pipe(v.string(), v.minLength(8), v.maxLength(500)),
    'The password must be at least 8 characters long',
  ),
});

export const register = v.strictObject({
  email: v.message(
    v.pipe(v.string(), v.email(), v.regex(/^[^@]+@[^@]+\.[^@]+$/)),
    'The email address of the user',
  ),
});

export const registration = v.strictObject({
  email: v.pipe(v.string(), v.email()),
  message: v.string(),
});

export const logout = v.strictObject({
  id: v.message(v.pipe(v.string(), v.uuid()), 'Invalid user ID format'),
});

export const loggedout = v.strictObject({
  success: v.boolean(),
});

export const loggedin = v.strictObject({
  sessionId: v.string(),
  user: userSelectSchema,
});
