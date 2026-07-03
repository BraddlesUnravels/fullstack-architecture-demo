import { Elysia } from 'elysia';
import { AuthModel } from './models.auth';
import { authService } from './service.auth';
import { registrationService } from './service.registration';
import {
  completeRegistrationResponse,
  loginResponse,
  logoutResponse,
  registrationResponse,
  verifyEmailResponse,
} from './response.auth';

export const auth = new Elysia({ prefix: '/auth' })
  .post('/login', async ({ body, request }) => await authService.login({ ...body, req: request }), {
    body: AuthModel.login,
    response: loginResponse,
  })
  .post('/register', async ({ body }) => await registrationService.register(body), {
    body: AuthModel.register,
    response: registrationResponse,
  })
  .get('/verify-email/:id', async ({ params }) => await registrationService.verifyEmail(params), {
    params: AuthModel.verifyEmail,
    response: verifyEmailResponse,
  })
  .post(
    '/complete-registration',
    async ({ body }) => await registrationService.completeRegistration(body),
    {
      body: AuthModel.completeRegistration,
      response: completeRegistrationResponse,
    },
  )
  .get('/logout/:id', async ({ params }) => await authService.logout(params.id), {
    params: AuthModel.logout,
    response: logoutResponse,
  });
