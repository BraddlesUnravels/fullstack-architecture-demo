import { Elysia } from 'elysia';
import { AuthModel } from './models.auth';
import { authService } from './service.auth';
import { registrationService } from './service.registration';
import { setSessionCookie } from '../../services';
import {
  completeRegistrationResponse,
  loginResponse,
  logoutResponse,
  registrationResponse,
  verifyEmailResponse,
} from './response.auth';

export const auth = new Elysia({ prefix: '/auth' })
  .post(
    '/',
    async ({ body, cookie }) => {
      const { success, token, exp } = await authService.login(body);
      setSessionCookie(cookie, token);
      return {
        success,
        token,
        exp,
      };
    },
    {
      body: AuthModel.login,
      response: loginResponse,
    },
  )
  .put('/', async ({ body }) => await registrationService.register(body), {
    body: AuthModel.register,
    response: registrationResponse,
  })
  .get(
    '/:id',
    async ({ params }) => await registrationService.verifyEmail(params),
    {
      params: AuthModel.verifyEmail,
      response: verifyEmailResponse,
    },
  )
  .patch(
    '/',
    async ({ body }) => await registrationService.completeRegistration(body),
    {
      body: AuthModel.completeRegistration,
      response: completeRegistrationResponse,
    },
  )
  .post('/logout', async ({ cookie }) => await authService.logout(cookie), {
    response: logoutResponse,
  });
