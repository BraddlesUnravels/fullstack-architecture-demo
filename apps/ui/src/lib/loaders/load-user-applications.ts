import { api } from '../api/api';

export const loadApplicationSummaries = async (sid?: string) => {
  const { data, error, status } = await api(sid).applications.get();

  if (status !== 200 || error) {
    return {
      status: Number(status) || 500,
      error,
    };
  }

  return { success: true, data };
};
