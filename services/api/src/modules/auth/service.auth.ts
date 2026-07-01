import { authRepo, userRepo, credentialRepo } from '@app/db';
import { UserNotFoundError } from '../user/errors.user';
import { securityService, emailService } from '../../services';
import {
  EmailConflictError,
  InvalidCredentialsError,
  NoCredentialsSetError,
  SessionCreateFailedError,
  SessionNotFoundError,
  UserCreationFailedError,
} from './errors.auth';
import { serializeAuditDates, dateAddition } from '../../utils';
import { API_CONSTANTS } from '../../config';
import type { Register, Registration, LoginInput, LoggedIn, LoggedOut } from '@app/types';

const SESSION_TIMEOUT = API_CONSTANTS.security.SESSION_TIMEOUT; // 48 hours in mins
const DEFAULT_REGISTER_FIRST_NAME = 'There';
const DEFAULT_REGISTER_LAST_NAME = 'User';

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

const register = async ({ email }: Register): Promise<Registration> => {
  const [existingUser] = await userRepo.findUserByEmail(email);

  if (existingUser) throw new EmailConflictError();

  const [user] = await userRepo.createUser({
    email,
    firstName: DEFAULT_REGISTER_FIRST_NAME,
    lastName: DEFAULT_REGISTER_LAST_NAME,
  });

  if (!user) throw new UserCreationFailedError();

  const jwtUrl = securityService.genJwtUrl(user.id);

  await emailService.sendAccountCreated(email, DEFAULT_REGISTER_FIRST_NAME, jwtUrl);

  return {
    email,
    message: 'Registration successful. Please check your email to confirm your account.',
  };
};

export const authService = {
  register,
  login,
  logout,
};
