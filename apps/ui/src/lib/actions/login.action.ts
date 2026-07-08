import { api } from '../api';
import type { LoginInput } from '@app/types/auth';
import type { JSONObject, RequestEventAction } from '@builder.io/qwik-city';

export const loginAction = async (form: JSONObject, event: RequestEventAction) => {
  const { fail, cookie, redirect } = event;
  const formData = form as LoginInput;
  const { data, error, status } = await api.auth.post(formData);

  if (status !== 200 || !data) {
    return fail(status ?? 500, {
      ...error,
    });
  }

  // Set cookie manually because qwik sever will not pass to ui and will not set a cookie
  cookie.set('sid', data.token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    expires: new Date(data.exp * 1000),
  });

  throw redirect(303, '/app');
};
