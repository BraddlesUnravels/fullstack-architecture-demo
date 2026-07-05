import { component$ } from '@builder.io/qwik';
import { routeAction$ } from '@builder.io/qwik-city';
import { api } from '../../lib';
import PublicLayout from '../../components/layout/public-layout';
import { BgGradient } from '../../components/ui/bg-gradient';
import { ProjectIntro } from './intro-section';
import { LoginCard } from './login-card';
import { ProjectScope } from './project-scope';
type LoginFormInput = {
  email: string;
  password: string;
};

export const useLoginAction = routeAction$(async (rawForm, { fail }) => {
  const form = rawForm as LoginFormInput;
  const { data, error, status } = await api.auth.post(form);

  if (status !== 200 || !data) {
    const statusCode = typeof status === 'number' ? status : 500;
    const errorCode =
      typeof error === 'object' && error && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'AUTH_LOGIN_FAILED';
    const errorMessage =
      typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
        ? error.message
        : 'Login failed';

    return fail(statusCode, { code: errorCode, message: errorMessage });
  }
  return {
    success: data.success,
    user: data.user,
  };
});

export type LoginActionStore = ReturnType<typeof useLoginAction>;

export default component$(() => {
  const loginAction = useLoginAction();
  return (
    <PublicLayout>
      <BgGradient />

      <ProjectIntro />

      <LoginCard loginAction={loginAction} />

      <ProjectScope />
    </PublicLayout>
  );
});
