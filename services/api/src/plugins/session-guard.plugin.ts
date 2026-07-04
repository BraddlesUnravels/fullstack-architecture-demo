import { Elysia } from 'elysia';
import { readSession } from '@app/redis';
import { MissingSessionTokenError, SessionExpiredError } from '../modules/auth/errors.auth';
import { API_CONSTANTS } from '../config';
import { hashSessionToken } from '../services/auth/security.service';

const COOKIE_NAME = API_CONSTANTS.cookie.COOKIE_NAME;

const extractTokenFromCookie = (sessionCookieValue: string | undefined): string => {
  if (!sessionCookieValue)
    throw new MissingSessionTokenError('Your session has expiresd, please log in again');

  const sessionToken = sessionCookieValue.trim();

  return sessionToken;
};

export const sessionGuard = new Elysia({ name: 'session-auth' }).resolve(
  { as: 'scoped' },
  async ({ cookie }) => {
    const sessionCookie = cookie[COOKIE_NAME];
    const sessionCookieValue =
      sessionCookie && typeof sessionCookie.value === 'string' ? sessionCookie.value : undefined;
    const sessionToken = extractTokenFromCookie(sessionCookieValue);
    const sessionTokenHash = hashSessionToken(sessionToken);
    const session = await readSession(sessionTokenHash);

    if (!session) throw new SessionExpiredError();

    return {
      session: {
        userId: session.userId,
      },
    };
  },
);
