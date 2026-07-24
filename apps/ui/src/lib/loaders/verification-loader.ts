import { api } from '../api';
import type { RequestEventLoader } from '@builder.io/qwik-city';

export const verifyRegistrationToken = async (
  e: RequestEventLoader,
): Promise<{ userId: string }> => {
  const { redirect, cookie } = e;

  const id = e.params.id;
  if (!id) throw redirect(303, '/?error=Missing verification token');

  const { data, error, status } = await api().auth({ id }).get();
  if (status !== 200 || error)
    throw redirect(
      303,
      `/?error=${encodeURIComponent(error?.value?.message || 'Verification failed')}`,
    );

  cookie.set('vid', data.userId, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    expires: new Date(Date.now() + 5 * 60 * 1000),
  });

  throw redirect(303, '/verify/complete');
};
