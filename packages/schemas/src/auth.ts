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
export const verifyEmail = v.strictObject({
  base64Id: v.message(v.pipe(v.string(), v.minLength(1)), 'Registration ID is required'),
});

export const verifiedEmail = v.strictObject({
  success: v.boolean(),
  userId: v.string(),
  message: v.string('Email verified. Complete registration to continue.'),
});

export const completeRegistration = v.strictObject({
  userId: v.message(v.pipe(v.string(), v.minLength(1)), 'User ID is required'),
  firstName: v.message(
    v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(200)),
    'First name is required',
  ),
  lastName: v.message(
    v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(200)),
    'Last name is required',
  ),
  password: v.message(
    v.pipe(v.string(), v.minLength(8), v.maxLength(500)),
    'Password must be between 8 and 500 characters',
  ),
  confirmPassword: v.message(
    v.pipe(v.string(), v.minLength(8), v.maxLength(500)),
    'Confirm password must be between 8 and 500 characters',
  ),
});

export const completedRegistration = v.strictObject({
  success: v.boolean(),
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
