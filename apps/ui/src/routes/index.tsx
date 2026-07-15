import { component$, useSignal, $ } from '@builder.io/qwik';
import { routeAction$ } from '@builder.io/qwik-city';
import { registerAction, loginAction } from '../lib/actions';
import {
  PublicGradient,
  IntroSection,
  LoginCard,
  RegistrationCard,
} from '../components/layout/public-assets';

export const useLoginAction = routeAction$(async (form, event) => await loginAction(form, event));
export const useRegisterAction = routeAction$(
  async (form, event) => await registerAction(form, event),
);

export type LoginActionStore = ReturnType<typeof useLoginAction>;
export type RegistrationStore = ReturnType<typeof useRegisterAction>;

export default component$(() => {
  const loginAction = useLoginAction();
  const registerAction = useRegisterAction();
  const authMode = useSignal<'register' | 'login'>('register');

  const showLogin = $(() => {
    authMode.value = 'login';
  });

  const showRegister = $(() => {
    authMode.value = 'register';
  });

  return (
    <div
      id="public-layout"
      class="grid min-h-full min-w-full grid-cols-1 overflow-hidden bg-[#101923] text-slate-100 lg:grid-cols-[40%_65%] xl:grid-cols-[30%_70%]"
    >
      <section id="left-wrapper" class="relative flex flex-col items-center justify-center">
        <div class="absolute inset-y-0 right-0 hidden w-px bg-linear-to-b from-transparent via-green-300/60 to-transparent lg:block" />

        <div class="relative z-10 grid w-full h-full overflow-hidden items-center pl-3 pr-3">
          <div
            aria-hidden={authMode.value !== 'register'}
            class={[
              'col-start-1 row-start-1 transition duration-500 ease-out',
              authMode.value === 'register'
                ? 'translate-x-0 opacity-100'
                : 'translate-x-[-110%] opacity-0 pointer-events-none',
            ]}
          >
            <RegistrationCard registerAction={registerAction} onShowLogin$={showLogin} />
          </div>

          <div
            aria-hidden={authMode.value !== 'login'}
            class={[
              'col-start-1 row-start-1 transition duration-500 ease-out',
              authMode.value === 'login'
                ? 'translate-x-0 opacity-100'
                : 'translate-x-[110%] opacity-0 pointer-events-none',
            ]}
          >
            <LoginCard loginAction={loginAction} onShowRegister$={showRegister} />
          </div>
        </div>
      </section>

      <section
        id="right-wrapper"
        class="relative flex flex-col items-center justify-center min-w-full p-4"
      >
        <PublicGradient />

        <IntroSection />
      </section>
    </div>
  );
});
