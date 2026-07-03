import { Elysia } from 'elysia';
import { InvalidSessionTokenError, MissingSessionTokenError } from '../modules/auth/errors.auth';

const BEARER_PREFIX = /^Bearer\s+/i;

const extractTokenFromHeader = (authorization?: string): string => {
  if (!authorization) throw new MissingSessionTokenError();

  if (!BEARER_PREFIX.test(authorization))
    throw new InvalidSessionTokenError('Authorization header must be in the format.');

  const sessionId = authorization.replace(BEARER_PREFIX, '').trim();

  if (!sessionId) throw new InvalidSessionTokenError('Session token is missing');
  return sessionId;
};
// TODO: Add async when implementing redis session validation logic
export const sessionGuard = new Elysia({ name: 'session-auth' }).resolve(
  { as: 'scoped' },
  ({ headers }) => {
    const sessionId = extractTokenFromHeader(headers.authorization);

    // TODO: Implement redis session validation logic here

    return { sessionId };
  },
);
