import { api } from '../api';

export const loadName = async (sid?: string) => {
  const { data, error, status } = await api(sid).users.get();

  if (status !== 200 || error)
    return {
      status: Number(status) || 500,
      error,
    };

  return { name: data.firstName };
};
