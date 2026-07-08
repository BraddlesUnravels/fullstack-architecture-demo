import { component$ } from '@builder.io/qwik';
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

  return (
    <div class="grid min-h-full min-w-full grid-cols-1 overflow-hidden bg-[#101923] text-slate-100 md:grid-cols-[35%_65%] lg:grid-cols-[32%_68%]">
      <section id="left-wrapper" class="relative flex flex-col items-center justify-center w-full">
        <div class="absolute inset-y-0 right-0 hidden w-px bg-linear-to-b from-transparent via-white/40 to-transparent md:block" />

        <div class="relative z-10 w-full">
          <LoginCard loginAction={loginAction} />
          <RegistrationCard registerAction={registerAction} />
        </div>
      </section>
      <section
        id="right-wrapper"
        class="relative flex flex-col items-center justify-center m-w-full min-w-full p-4"
      >
        <PublicGradient />

        <IntroSection />
      </section>
    </div>
  );
});
