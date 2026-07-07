import { component$ } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import { FormField, TextInput } from '../../ui';
import type { RegistrationStore } from '../../../routes';

type LoginCardProps = {
  registerAction: RegistrationStore;
};

export default component$<LoginCardProps>(({ registerAction }) => (
  <div
    id="form-wrap"
    class="flex min-w-full justify-center"
    aria-label="Please enter your login details in the form below"
  >
    <div class="w-full max-w-md rounded-2xl bg-linear-to-b from-transparent via-white/40 to-transparent p-px shadow-2xl shadow-black/30">
      <Form
        action={registerAction}
        class="rounded-[calc(1rem-1px)] bg-[#16232d] p-8 backdrop-blur-xl"
      >
        <div class="mb-4">
          <h2 class="text-2xl font-bold tracking-tight text-white">User Registration</h2>

          <p class="mt-2 text-sm leading-6 text-slate-400">
            To register enter your email and click Join
          </p>
        </div>

        <div class="space-y-5">
          <FormField
            name="email"
            aria-required
            aria-label="Please enter your email in this field"
            error={registerAction.value?.failed}
            message={registerAction.value?.message}
          >
            <div class="flex w-full overflow-hidden rounded-lg border border-white/10 bg-white/6 transition focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/20">
              <TextInput
                id="email"
                name="email"
                className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                type="email"
                placeholder="Please enter your email"
                autocomplete="email"
                disabled={registerAction.isRunning}
              />

              <button
                type="submit"
                disabled={registerAction.isRunning}
                class="shrink-0 border-l border-white/10 bg-cyan-400/10 px-5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400/40"
              >
                Join
              </button>
            </div>
          </FormField>
        </div>
      </Form>
    </div>
  </div>
));
