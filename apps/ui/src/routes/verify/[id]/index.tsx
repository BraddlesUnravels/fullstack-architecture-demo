import { component$ } from '@builder.io/qwik';
import { Form, routeAction$, routeLoader$ } from '@builder.io/qwik-city';
import type { CompleteRegistration } from '@app/types';
import { api } from '../../../lib/api';

type VerificationData = {
  message: string;
  userId: string;
};

export const useVerificationLoader = routeLoader$(async (event) => {
  const id = event.params.id;

  if (!id) throw event.redirect(303, '/?error=Missing verification token');

  const { data, error, status } = await api().auth({ id }).get();

  if (status !== 200 || !data) {
    throw event.redirect(303, `/?error=${encodeURIComponent(error?.value?.message || 'Verification failed')}`);
  }

  return {
    message: data.message,
    userId: data.userId,
  } satisfies VerificationData;
});

export const useCompleteRegistrationAction = routeAction$(
  async (form, event) => {
    const payload = form as unknown as CompleteRegistration;
    const { data, error, status } = await api().auth.patch(payload);

    if (status !== 200 || !data) {
      return event.fail(status ?? 500, {
        message: error?.value?.message || 'Failed to complete registration',
      });
    }

    throw event.redirect(303, '/?registered=true');
  },
);

export default component$(() => {
  const verification = useVerificationLoader();
  const completeRegistrationAction = useCompleteRegistrationAction();

  return (
    <main class="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4 py-10">
      <section class="w-full rounded-2xl border border-white/10 bg-[#16232d] p-6 text-slate-100 shadow-2xl shadow-black/30 md:p-8">
        <h1 class="text-2xl font-semibold text-white">Complete your registration</h1>

        <p class="mt-2 text-sm text-slate-300">{verification.value.message}</p>

        <Form action={completeRegistrationAction} class="mt-6 space-y-4">
          <input type="hidden" name="userId" value={verification.value.userId} />

          <label class="flex flex-col gap-1">
            <span class="text-sm text-slate-200">First name</span>
            <input
              class="h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-slate-100 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              name="firstName"
              required
              type="text"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-sm text-slate-200">Last name</span>
            <input
              class="h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-slate-100 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              name="lastName"
              required
              type="text"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-sm text-slate-200">Password</span>
            <input
              class="h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-slate-100 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              name="password"
              required
              type="password"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-sm text-slate-200">Confirm password</span>
            <input
              class="h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-slate-100 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              name="confirmPassword"
              required
              type="password"
            />
          </label>

          {completeRegistrationAction.value?.failed && (
            <p class="text-sm text-rose-300">
              {completeRegistrationAction.value.message}
            </p>
          )}

          <button
            class="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-linear-to-r from-teal-400 to-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-60"
            disabled={completeRegistrationAction.isRunning}
            type="submit"
          >
            Complete registration
          </button>
        </Form>
      </section>
    </main>
  );
});
