import { Elysia } from 'elysia';
import { AuthModel } from './models.auth';
import { authService } from './service.auth';
import { loginResponse, logoutResponse } from './response.auth';

export const auth = new Elysia({ prefix: '/auth' })
  .post('/login', async ({ body, request }) => await authService.login({ ...body, req: request }), {
    body: AuthModel.login,
    response: loginResponse,
  })
  .post('/register', async ({ body }) => await authService.register(body), {
    body: AuthModel.register,
    response: AuthModel.registration,
  })
  .get('/logout/:id', async ({ params }) => await authService.logout(params.id), {
    params: AuthModel.logout,
    response: logoutResponse,
  });
