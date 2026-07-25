import { createHash, randomBytes } from 'node:crypto';
import { emailService } from '../../services';
import {
  hashNewPassword,
  hashSessionToken,
  createSessionToken,
} from '../../services';
import { credentialRepo, userRepo } from '@app/db';
import { UserNotFoundError } from '../user/errors.user';
import { API_CONSTANTS } from '../../config';
import {
  createSession,
  consumePendingRegistration,
  createPendingRegistration,
  readPendingRegistration,
} from '@app/redis';
import {
  CredentialCreationFailedError,
  EmailConflictError,
  PasswordConfirmationMismatchError,
  RegistrationLinkExpiredError,
  UserCreationFailedError,
} from './errors.auth';
import type {
  CompleteRegistration,
  LoggedIn,
  Register,
  Registration,
  VerifiedEmail,
  VerifyEmail,
} from '@app/types';

const { TTL_SECONDS } = API_CONSTANTS.cookie;

const REGISTRATION_LINK_TTL_SECONDS = 60 * 15;
const DEFAULT_APP_LINK = process.env.CORS_ORIGIN || 'http://localhost:3000';

const createRegistrationId = (): string => {
  return randomBytes(32).toString('hex');
};

const hashString = (str: string): string => {
  return createHash('sha256').update(str).digest('hex');
};

const encodeRegistrationId = (registrationId: string): string => {
  return Buffer.from(registrationId).toString('base64url');
};

const createVerificationUrl = (encodedId: string): string => {
  const appLink = DEFAULT_APP_LINK.endsWith('/')
    ? DEFAULT_APP_LINK.slice(0, -1)
    : DEFAULT_APP_LINK;

  return `${appLink}/verify/${encodedId}`;
};

const handleRegistrationId = () => {
  const registrationId = createRegistrationId();
  const encodedId = encodeRegistrationId(registrationId);
  const hashedId = hashString(encodedId);
  return { encodedId, hashedId };
};

// Provides default response for email conflict as when it has been successful to mitigate user enumeration attacks.
const register = async ({ email }: Register): Promise<Registration> => {
  const existingUser = await userRepo.findUserByEmail(email);
  if (existingUser.length > 0)
    throw new EmailConflictError(
      'If this email can be registered, we’ll send a verification code.',
    );

  const { encodedId, hashedId } = handleRegistrationId();

  await createPendingRegistration(
    hashedId,
    email,
    REGISTRATION_LINK_TTL_SECONDS,
  );

  await emailService.sendConfirmEmail(email, createVerificationUrl(encodedId));

  return {
    email,
    message:
      'Registration started. Please check your email to verify your account.',
  };
};

const verifyEmail = async ({ id }: VerifyEmail): Promise<VerifiedEmail> => {
  const hashedId = hashString(id);
  const record = await readPendingRegistration(hashedId);
  if (!record) throw new RegistrationLinkExpiredError();

  const [existingUser] = await userRepo.findUserByEmail(record.email);

  if (existingUser) {
    await consumePendingRegistration(hashedId);
    return {
      success: true,
      userId: existingUser.id,
      message: 'Email verified. Complete registration to continue.',
    };
  }

  const [createdUser] = await userRepo.createUser({
    email: record.email,
  });
  if (!createdUser) throw new UserCreationFailedError();

  await consumePendingRegistration(hashedId);

  return {
    success: true,
    userId: createdUser.id,
    message: 'Email verified.',
  };
};

const completeRegistration = async ({
  userId,
  firstName,
  lastName,
  password,
  confirmPassword,
}: CompleteRegistration): Promise<LoggedIn> => {
  if (password !== confirmPassword)
    throw new PasswordConfirmationMismatchError();

  const [user] = await userRepo.findUserById(userId);
  if (!user)
    throw new UserNotFoundError('No user exists for the verified registration');

  const [updatedUser] = await userRepo.updateUser(user.id, {
    firstName,
    lastName,
  });
  if (!updatedUser || !updatedUser.firstName)
    throw new UserCreationFailedError('Failed to complete registration');

  const hash = await hashNewPassword(password);
  const [createdCredential] = await credentialRepo.createCredential({
    userId: user.id,
    hash,
  });
  if (!createdCredential) throw new CredentialCreationFailedError();

  await emailService.sendAccountCreated(
    updatedUser.email,
    updatedUser.firstName,
    DEFAULT_APP_LINK,
  );

  const { token, hash: sessionTokenHash } =
    hashSessionToken(createSessionToken());

  await createSession(
    sessionTokenHash,
    updatedUser.id,
    updatedUser.tier,
    TTL_SECONDS,
  );

  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;

  return {
    success: true,
    token,
    exp,
  };
};

export const registrationService = {
  register,
  verifyEmail,
  completeRegistration,
};
