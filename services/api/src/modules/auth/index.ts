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
    '/login',
    async ({ body, cookie }) => {
      const { sessionToken, user } = await authService.login(body);
      setSessionCookie(cookie, sessionToken);
      return {
        success: true,
        user,
      };
    },
    {
      body: AuthModel.login,
      response: loginResponse,
    },
  )
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
  .post('/logout', async ({ cookie }) => await authService.logout(cookie), {
    response: logoutResponse,
  });
