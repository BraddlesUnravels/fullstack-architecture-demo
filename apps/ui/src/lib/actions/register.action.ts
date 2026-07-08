import { api } from '../api';
import type { Register } from '@app/types/auth';
import type { JSONObject, RequestEventAction } from '@builder.io/qwik-city';

export const registerAction = async (form: JSONObject, e: RequestEventAction) => {
  const input = form as Register;
  const { data, error, status } = await api.auth.put(input);
  console.log(data, error);
  if (status !== 200 || !data) {
    return e.fail(status ?? 500, {
      ...error,
    });
  }
  console.log(data, error);
  return { success: true, ...data };
};
