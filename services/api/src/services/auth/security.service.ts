import argon2id from 'argon2';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'node:crypto';
import { JwtVerificationError, SessionCreateFailedError } from '../../modules/auth/errors.auth';
import type { CookieJar } from '../../types';
import { API_CONSTANTS } from '../../config';

const API_URL = process.env.API_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const { COOKIE_NAME, TTL_SECONDS } = API_CONSTANTS.cookie;

export const isPasswordMatch = async (password: string, hash: string): Promise<boolean> => {
  return argon2id.verify(hash, password);
};

export const hashNewPassword = async (password: string): Promise<string> => {
  return argon2id.hash(password);
};

export const genJwtUrl = (userId: string) => {
  const token = jwt.sign({ userId, purpose: 'email-verification' }, JWT_SECRET!, {
    expiresIn: '1d',
  });
  return `${API_URL}/auth/verify-email?token=${token}`;
};

export const jwtVerify = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    return decoded;
  } catch (err) {
    throw new JwtVerificationError('Invalid jwt token', err);
  }
};

export const createSessionToken = (): string => randomBytes(32).toString('base64url');

export const hashSessionToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

export const setSessionCookie = (cookie: CookieJar, sessionToken: string) => {
  const sessionCookie = cookie[COOKIE_NAME];
  if (!sessionCookie) throw new SessionCreateFailedError();

  sessionCookie.value = sessionToken;

  sessionCookie.set({
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: TTL_SECONDS,
  });
};
