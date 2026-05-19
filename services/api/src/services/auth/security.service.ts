import argon2id from 'argon2';
import jwt from 'jsonwebtoken';
import { JwtVerificationError } from '../../modules/auth/errors.auth';

const API_URL = process.env.API_URL;
const JWT_SECRET = process.env.JWT_SECRET;

export const isPasswordMatch = async (password: string, hash: string): Promise<boolean> => {
  return argon2id.verify(hash, password);
};

const hashNewPassword = async (password: string): Promise<string> => {
  return argon2id.hash(password);
};

const genJwtUrl = (userId: string) => {
  const token = jwt.sign({ userId, purpose: 'email-verification' }, JWT_SECRET!, {
    expiresIn: '1d',
  });
  return `${API_URL}/auth/verify-email?token=${token}`;
};

const jwtVerify = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    return decoded;
  } catch (err) {
    throw new JwtVerificationError('Invalid jwt token', err);
  }
};

export const securityService = {
  isPasswordMatch,
  hashNewPassword,
  genJwtUrl,
  jwtVerify,
};
