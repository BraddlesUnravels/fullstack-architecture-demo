import { api } from './api';

export const login = async (email: string, password: string) => {
  const { data } = await api.auth.login.post({ password, email });

  return {
    ...data,
  };
};
