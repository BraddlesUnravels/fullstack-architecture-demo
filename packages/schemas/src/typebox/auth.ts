import { t } from 'elysia';
import { userSelectSchema } from './user';

export const login = t.Object({
  email: t.String({
    format: 'email',
    error: 'The email address of the user',
  }),
  password: t.String({
    minLength: 8,
    error: 'The password must be at least 8 characters long',
    maxLength: 500,
  }),
});

export const register = t.Object({
  firstName: t.String({
    minLength: 1,
    error: 'The first name of the user',
    maxLength: 100,
  }),
  lastName: t.String({
    minLength: 1,
    error: 'The last name of the user',
    maxLength: 100,
  }),
  email: t.String({
    format: 'email',
    error: 'The email address of the user',
    pattern: '^[^@]+@[^@]+\\.[^@]+$',
  }),
  confirmEmail: t.String({
    format: 'email',
    error: 'Please confirm your email address',
    pattern: '^[^@]+@[^@]+\\.[^@]+$',
    nullable: false,
  }),
});

export const registration = t.Object({
  email: t.String({ format: 'email' }),
  message: t.String(),
});

export const logout = t.Object({
  id: t.String({ format: 'uuid', error: 'Invalid user ID format' }),
});

export const loggedout = t.Object({
  success: t.Boolean(),
});

export const loggedin = t.Object({
  sessionId: t.String(),
  user: userSelectSchema,
});
