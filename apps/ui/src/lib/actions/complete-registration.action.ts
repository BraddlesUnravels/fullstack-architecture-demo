import { api } from '../api';
import type { JSONObject, RequestEventAction } from '@builder.io/qwik-city';
import type { CompleteRegistration } from '@app/types';

export const completeRegistration = async (
  form: JSONObject,
  e: RequestEventAction,
) => {
  const { fail, redirect, cookie } = e;
  const userId = cookie.get('sid')?.value;
  if (!userId)
    throw redirect(
      303,
      '/?error=Verification session expired. Please verify your email again.',
    );
  const payload: CompleteRegistration = {
    ...(form as CompleteRegistration),
    userId,
  };

  const { error, status } = await api().auth.patch(payload);

  if (status !== 200 || error) {
    return fail(status ?? 500, {
      message: error?.value?.message || 'Failed to complete registration',
    });
  }

  cookie.set('sid', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    expires: new Date(Date.now() * 1000),
  });

  throw redirect(303, '/app');
};
