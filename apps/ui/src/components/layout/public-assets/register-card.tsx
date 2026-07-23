import { component$, type QRL } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import { FormField, TextInput } from '../../ui';
import type { RegistrationStore } from '../../../routes';

type LoginCardProps = {
  registerAction: RegistrationStore;
  onShowLogin$: QRL<() => void>;
};

export default component$<LoginCardProps>(
  ({ registerAction, onShowLogin$ }) => (
    <div
      id="form-wrap"
      class="flex min-w-full justify-center"
      aria-label="Please enter your login details in the form below"
    >
      <div class="w-full max-w-md rounded-2xl bg-linear-to-b from-transparent via-green-300/60 to-transparent p-px shadow-2xl shadow-black/30">
        <Form
          action={registerAction}
          preventdefault:submit
          aria-label="Please enter your email in the form below to register"
          class="rounded-[calc(1rem-1px)] bg-[#16232d] p-8 backdrop-blur-xl"
        >
          <div class="">
            <h2 class="text-2xl font-bold tracking-tight text-white">
              User Registration
            </h2>

            <p class="mt-2 text-sm leading-6 text-slate-400">
              To register enter your email and click Join
            </p>
          </div>

          <div class="space-y-5">
            <FormField
              name="email"
              aria-required
              aria-label="Please enter your email in this field"
              errorMessage={
                registerAction.value?.failed
                  ? registerAction.value?.message
                  : undefined
              }
            >
              <div class="flex h-12 w-full overflow-hidden rounded-lg border border-white/10 bg-white/6 transition focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/20">
                <TextInput
                  id="email"
                  name="email"
                  icon={
                    <button
                      type="submit"
                      disabled={registerAction.isRunning}
                      class="flex h-full w-20 shrink-0 cursor-pointer items-center justify-center border-0 border-l border-white/10 bg-linear-to-r from-teal-400 to-cyan-400 text-sm font-semibold leading-none text-slate-950 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Join
                    </button>
                  }
                  iconPosition="end"
                  iconClass="h-full"
                  inputClass="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-sm leading-none text-slate-100 placeholder:text-slate-500 outline-none"
                  containerClass="flex h-full min-w-0 flex-1 border-0 bg-transparent p-0"
                  type="email"
                  placeholder="Please enter your email"
                  autocomplete="email"
                  disabled={registerAction.isRunning}
                />
              </div>
              <div class="mt-5 text-center text-sm text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick$={onShowLogin$}
                  class="cursor-pointer font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Login
                </button>
              </div>
            </FormField>
          </div>
        </Form>
      </div>
    </div>
  ),
);
