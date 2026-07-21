import { component$, useSignal, type QRL } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import { FormField, TextInput, ButtonAura, Button } from '../../ui';
import { HiEyeSlashSolid, HiEyeOutline } from '@qwikest/icons/heroicons';
import type { LoginActionStore } from '../../../routes';

type LoginCardProps = {
  loginAction: LoginActionStore;
  onShowRegister$: QRL<() => void>;
};

export default component$<LoginCardProps>(({ loginAction, onShowRegister$ }) => {
  const isPasswordVisible = useSignal(false);

  return (
    <div
      id="form-wrap"
      class="flex min-w-full justify-center"
      aria-label="Please enter your login details in the form below"
    >
      <div class="w-full max-w-md rounded-2xl bg-linear-to-b from-transparent via-green-300/60 to-transparent p-px shadow-2xl shadow-black/30">
        <Form
          action={loginAction}
          class="rounded-[calc(1rem-1px)] bg-[#16232d] p-8 backdrop-blur-xl"
        >
          <div class="mb-3">
            <h2 class="text-2xl font-bold tracking-tight text-white">Welcome back</h2>

            <p class="mt-2 text-sm leading-6 text-slate-400">
              Sign in to continue to the job application tracker.
            </p>
          </div>

          <div class="space-y-5">
            <FormField
              name="email"
              label="Email"
              required
              aria-required
              aria-label="Please enter your email in this field"
            >
              <TextInput
                id="email"
                name="email"
                inputClass="w-full rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                containerClass="flex w-full h-full min-w-0 flex-1 border-0 bg-transparent p-0"
                type="email"
                placeholder="Please enter your email"
                autocomplete="email"
              />
            </FormField>

            <FormField
              name="password"
              label="Password"
              required
              aria-required
              aria-label="Please enter your password in this field"
            >
              <div class="relative">
                <TextInput
                  id="password"
                  name="password"
                  inputClass="w-full rounded-lg border border-white/10 bg-white/6 px-4 py-3 pr-12 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  containerClass="flex w-full h-full min-w-0 flex-1 border-0 bg-transparent p-0"
                  type={isPasswordVisible.value ? 'text' : 'password'}
                  autocomplete="current-password"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick$={() => {
                    isPasswordVisible.value = !isPasswordVisible.value;
                  }}
                  class="absolute inset-y-0 right-0 flex w-12 items-center justify-center cursor-pointer text-slate-400 transition hover:text-slate-200"
                  aria-label={isPasswordVisible.value ? 'Hide password' : 'Show password'}
                >
                  {isPasswordVisible.value ? <HiEyeOutline /> : <HiEyeSlashSolid />}
                </button>
              </div>
            </FormField>

            <div id="button-wrap" aria-controls="Login button" aria-label="Login button">
              {loginAction.isRunning && (
                <ButtonAura
                  label="Login"
                  size="md"
                  type="submit"
                  className="w-full cursor-pointer rounded-lg bg-linear-to-r from-teal-400 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                />
              )}
              {!loginAction.isRunning && (
                <Button
                  label="Login"
                  size="md"
                  type="submit"
                  className="w-full cursor-pointer rounded-lg bg-linear-to-r from-teal-400 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
                />
              )}
            </div>
          </div>
          <div class="mt-5 text-center text-sm text-slate-400">
            Need an account?{' '}
            <button
              type="button"
              onClick$={onShowRegister$}
              class="cursor-pointer font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
});
