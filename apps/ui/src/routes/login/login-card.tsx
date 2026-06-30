import { component$ } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import { FormField, TextInput, ButtonAura } from '../../components/ui';
import type { LoginActionStore } from './index';

type LoginCardProps = {
  loginAction: LoginActionStore;
};

export const LoginCard = component$<LoginCardProps>(({ loginAction }) => (
  <div
    id="form-wrap"
    class="justify-items-center mt-5"
    aria-label="Please enter your login details in the form below"
  >
    <Form
      action={loginAction}
      class="rounded-3xl border border-white/10 bg-slate-900/7 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
    >
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
            name="email"
            className="w-full rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
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
            className="w-full rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
          />
        </FormField>

        <div id="button-wrap" aria-controls="Login button" aria-label="Login button">
          <ButtonAura label="Login" size="md" type="submit" className="btn btn-accent w-full" />
        </div>
      </div>
    </Form>
  </div>
));
