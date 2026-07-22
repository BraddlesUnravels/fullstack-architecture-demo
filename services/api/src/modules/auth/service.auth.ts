import { credentialRepo, userRepo } from '@app/db';
import { createSession, deleteSession } from '@app/redis';
import type { LoggedOut, LoginInput } from '@app/types';
import {
  hashSessionToken,
  isPasswordMatch,
  createSessionToken,
} from '../../services';
import { UserNotFoundError } from '../user/errors.user';
import { InvalidCredentialsError, NoCredentialsSetError } from './errors.auth';
import type { CookieJar } from '../../types';
import { API_CONSTANTS } from '../../config';
import type { LoggedIn } from '@app/types';

const { TTL_SECONDS, COOKIE_NAME } = API_CONSTANTS.cookie;

const login = async ({ email, password }: LoginInput): Promise<LoggedIn> => {
  const [user] = await userRepo.findUserByEmail(email);
  if (!user)
    throw new UserNotFoundError('No user exists with the provided email');

  const [credentials] = await credentialRepo.findCredentialByUserId(user.id);
  if (!credentials)
    throw new NoCredentialsSetError(
      'No credentials set for the user with the provided email',
    );

  const isMatch = await isPasswordMatch(password, credentials.hash);
  if (!isMatch) throw new InvalidCredentialsError();

  const token = createSessionToken();
  const sessionTokenHash = hashSessionToken(token);

  await createSession(sessionTokenHash, user.id, user.tier, TTL_SECONDS);

  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;

  return {
    success: true,
    token,
    exp,
  };
};

const logout = async (cookie: CookieJar): Promise<LoggedOut> => {
  const session = cookie[COOKIE_NAME];

  const token = typeof session?.value === 'string' ? session?.value : undefined;

  if (token) await deleteSession(hashSessionToken(token));

  session?.remove();

  return { success: true };
};

export const authService = {
  login,
  logout,
};
