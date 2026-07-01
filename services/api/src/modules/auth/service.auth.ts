import { authRepo, credentialRepo, userRepo } from '@app/db';
import { API_CONSTANTS } from '../../config';
import { securityService } from '../../services';
import { dateAddition, serializeAuditDates } from '../../utils';
import { UserNotFoundError } from '../user/errors.user';
import {
  InvalidCredentialsError,
  NoCredentialsSetError,
  SessionCreateFailedError,
  SessionNotFoundError,
} from './errors.auth';
import type { LoggedIn, LoggedOut, LoginInput } from '@app/types';

const SESSION_TIMEOUT = API_CONSTANTS.security.SESSION_TIMEOUT; // 48 hours in mins

function extractRequestDetails(req?: Request): { ip?: string; userAgent?: string } {
  if (!req) return {};
  return {
    ip: req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
  };
}

const login = async ({
  email,
  password,
  req,
}: LoginInput & { req: Request }): Promise<LoggedIn> => {
  const [user] = await userRepo.findUserByEmail(email);
  if (!user) throw new UserNotFoundError('No user exists with the provided email');

  const [credentials] = await credentialRepo.findCredentialByUserId(user.id);
  if (!credentials)
    throw new NoCredentialsSetError('No credentials set for the user with the provided email');

  const isMatch = await securityService.isPasswordMatch(password, credentials.hash);
  if (!isMatch) throw new InvalidCredentialsError();

  const [session] = await authRepo.createSession({
    userId: user.id,
    expiresAt: dateAddition(SESSION_TIMEOUT),
    ...extractRequestDetails(req),
  });
  if (!session) throw new SessionCreateFailedError();

  return {
    sessionId: session.id,
    user: serializeAuditDates(user),
  };
};

const logout = async (sessionId: string): Promise<LoggedOut> => {
  const session = await authRepo.findSessionById(sessionId);

  if (!session) throw new SessionNotFoundError('No session found with the provided ID');

  const deleted = await authRepo.deleteSession(sessionId);

  return { success: Boolean(deleted) };
};

export const authService = {
  login,
  logout,
};
