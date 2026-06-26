import { Elysia } from 'elysia';
import { authRepo } from '@app/db';
import {
  InvalidSessionTokenError,
  MissingSessionTokenError,
  SessionExpiredError,
} from '../modules/auth/errors.auth';

const BEARER_PREFIX = /^Bearer\s+/i;

const extractTokenFromHeader = (authorization?: string): string => {
  if (!authorization) throw new MissingSessionTokenError();

  if (!BEARER_PREFIX.test(authorization))
    throw new InvalidSessionTokenError('Authorization header must be in the format.');

  const sessionId = authorization.replace(BEARER_PREFIX, '').trim();

  if (!sessionId) throw new InvalidSessionTokenError('Session token is missing');
  return sessionId;
};

export const sessionGuard = new Elysia({ name: 'session-auth' }).resolve(
  { as: 'scoped' },
  async ({ headers }) => {
    const sessionId = extractTokenFromHeader(headers.authorization);
    const [session] = await authRepo.findSessionById(sessionId);

    if (!session || session.isDeleted || session.revokedAt)
      throw new InvalidSessionTokenError('Session is invalid or has been revoked');

    if (session.expiresAt.getTime() <= Date.now())
      throw new SessionExpiredError('Session has expired');

    return { sessionId, session };
  },
);
