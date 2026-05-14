import { t, type Static } from 'elysia';
import { apiErrorResponseSchema, userSelectSchema } from '@app/schemas';

const loginBody = t.Object({
  email: t.String({ format: 'email', error: 'The email address of the user' }),
  password: t.String({ minLength: 8, error: 'The password must be at least 8 characters long' }),
});

const registerBody = t.Object({
  email: t.String({ format: 'email', error: 'The email address of the user' }),
});

const registerResponse = t.Object({
  email: t.String({ format: 'email' }),
  message: t.String(),
});

const logoutParams = t.Object({
  id: t.String({ format: 'uuid', error: 'Invalid user ID format' }),
});

const logoutResponse = t.Object({
  message: t.String(),
});

export const AuthModel = {
  loginBody,
  registerBody,
  logoutParams,
  logoutResponse,
  resLogin: userSelectSchema,
  resRegister: registerResponse,
  apiError: apiErrorResponseSchema,
} as const;

export type LoginBody = Static<typeof loginBody>;
export type RegisterBody = Static<typeof registerBody>;
export type LogoutParams = Static<typeof logoutParams>;
export type LogoutResponse = Static<typeof logoutResponse>;
export type LoginResponse = Static<typeof userSelectSchema>;
export type RegisterResponse = Static<typeof registerResponse>;
