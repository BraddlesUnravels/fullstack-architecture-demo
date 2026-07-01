import { component$ } from '@builder.io/qwik';
import { routeAction$ } from '@builder.io/qwik-city';
import { api } from '../../lib';
import { BgGradient } from './bg-gradient';
import { ProjectIntro } from './intro-section';
import { LoginCard } from './login-card';
import { ProjectScope } from './project-scope';
type LoginFormInput = {
  email: string;
  password: string;
};

export const useLoginAction = routeAction$(async (rawForm, { fail }) => {
  const form = rawForm as LoginFormInput;
  const { data, error, status } = await api.auth.login.post(form);

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
    sessionId: data.sessionId,
    user: data.user,
  };
});

export type LoginActionStore = ReturnType<typeof useLoginAction>;

export default component$(() => {
  const loginAction = useLoginAction();
  return (
    <div id="login-page-container" class="flex-1 h-full justify-items-center">
      <div class="min-w-xs max-w-sm h-full sm:max-w-2/3 md:max-w-2/3 lg:max-w-1/2 xl:max-w-2/3">
        <BgGradient />

        <ProjectIntro />

        <LoginCard loginAction={loginAction} />

        <ProjectScope />
      </div>
    </div>
  );
});
