import { api } from '../api';

export const applicationSummaries = async (sid?: string) => {
  const { data, error, status } = await api(sid).applications.get();

  if (status !== 200 || !data) {
    return {
      status: Number(status) || 500,
      error,
    };
  }

  return { success: true, data };
};
