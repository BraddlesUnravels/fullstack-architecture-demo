import { Elysia, type Cookie } from 'elysia';
import { readSession } from '@app/redis';
import { SessionNotFoundError, SessionExpiredError } from '../modules/auth/errors.auth';
import { API_CONSTANTS } from '../config';
import { hashSessionToken } from '../services/auth/security.service';

const { COOKIE_NAME, INACTIVITY_TIMEOUT_MILLIS } = API_CONSTANTS.cookie;

const timeOutCheck = (lastSeen?: string): boolean => {
  if (!lastSeen || typeof Number(lastSeen) !== 'number') return false;
  const now = Date.now();
  const difference = now - Number(lastSeen);
  return difference > INACTIVITY_TIMEOUT_MILLIS;
};

// throws `SessionNotFoundError()` if it cannot find a token value
const extractValueFromCookie = (cookie?: Cookie<unknown>): string => {
  const token = cookie && cookie.value && cookie.value === 'string' ? cookie.value : undefined;
  if (!token) throw new SessionNotFoundError();
  return token;
};

// if redis session expired due to TTL default (>8hrs)
// inactivity timeout occurs if now - lastseen exceeds default (>4hrs)
export const sessionGuard = new Elysia({ name: 'session-auth' }).resolve(
  { as: 'scoped' },
  async ({ cookie }) => {
    const value = extractValueFromCookie(cookie[COOKIE_NAME]);
    const hashed = hashSessionToken(value);
    const session = await readSession(hashed);

    if (!session || timeOutCheck(session.lastSeenAt)) throw new SessionExpiredError();

    // TODO: implement RBAC via `session.tier` compaired to a map of paths an dtier values.

    return {
      session: {
        ...session,
        lastSeenAt: Date.now(),
      },
    };
  },
);
