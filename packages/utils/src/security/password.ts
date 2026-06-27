import argon2id from 'argon2';

export const hashNewPassword = async (password: string): Promise<string> => {
  return argon2id.hash(password);
};
