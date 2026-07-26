import { api } from '../api/api';
import type { JSONObject, RequestEventAction } from '@builder.io/qwik-city';
import type { CompleteRegistration } from '@app/types';

export const completeRegistration = async (
  form: JSONObject,
  e: RequestEventAction,
) => {
  const { fail, redirect, cookie } = e;
  const userId = cookie.get('vid')?.value;
  if (!userId)
    throw redirect(
      303,
      '/?error=Verification session expired. Please verify your email again.',
    );

  cookie.delete('vid', { path: '/' });

  const payload: CompleteRegistration = {
    ...(form as CompleteRegistration),
    userId,
  };

  const { data, error, status } = await api().auth.patch(payload);

  if (status !== 200 || error)
    return fail(status ?? 500, {
      message: error?.value?.message || 'Failed to complete registration',
    });

  cookie.set('sid', data.token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
  });

  throw redirect(303, '/app');
};
