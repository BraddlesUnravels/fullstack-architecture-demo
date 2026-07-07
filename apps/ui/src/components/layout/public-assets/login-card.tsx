import { component$ } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import { FormField, TextInput, ButtonAura } from '../../ui';
import type { LoginActionStore } from '../../../routes/index';

type LoginCardProps = {
  loginAction: LoginActionStore;
};

export default component$<LoginCardProps>(({ loginAction }) => (
  <div
    id="form-wrap"
    class="flex min-w-full justify-center"
    aria-label="Please enter your login details in the form below"
  >
    <div class="w-full max-w-md rounded-2xl bg-linear-to-b from-transparent via-white/40 to-transparent p-px shadow-2xl shadow-black/30">
      <Form action={loginAction} class="rounded-[calc(1rem-1px)] bg-[#16232d] p-8 backdrop-blur-xl">
        <div class="mb-8">
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
              className="w-full rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
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
            <TextInput
              id="password"
              name="password"
              className="w-full rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              type="password"
              autocomplete="current-password"
              placeholder="Enter your password"
            />
          </FormField>

          <div id="button-wrap" aria-controls="Login button" aria-label="Login button">
            <ButtonAura
              label="Login"
              size="md"
              type="submit"
              className="w-full cursor-pointer rounded-lg bg-linear-to-r from-teal-400 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
            />
          </div>
        </div>
      </Form>
    </div>
  </div>
));
