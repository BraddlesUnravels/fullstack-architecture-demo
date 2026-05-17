import argon2id from 'argon2';

export const isPasswordMatch = async (password: string, hash: string): Promise<boolean> => {
  return argon2id.verify(hash, password);
};

const hashNewPassword = async (password: string): Promise<string> => {
  return argon2id.hash(password);
};

export const securityService = {
  isPasswordMatch,
  hashNewPassword,
};
