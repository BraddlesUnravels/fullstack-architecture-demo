import { Elysia } from 'elysia';
import { AuthModel } from './models.auth';
import { loginResponse, registerResponse, logoutResponse } from './response.auth';

export const auth = new Elysia({ prefix: '/auth' })
  .post(
    '/login',
    async ({ status }) =>
      status(401, {
        code: 'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      }),
    {
      body: AuthModel.loginBody,
      response: loginResponse,
    },
  )
  .post(
    '/register',
    async ({ body, status }) =>
      status(201, {
        email: body.email,
        message: 'Registration is not implemented yet',
      }),
    {
      body: AuthModel.registerBody,
      response: registerResponse,
    },
  )
  .get(
    '/logout/:id',
    async ({ status }) =>
      status(200, {
        message: 'Logout is not implemented yet',
      }),
    {
      params: AuthModel.logoutParams,
      response: logoutResponse,
    },
  );
