import { component$, useStore, $ } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import { FormField, TextInput, ButtonAura } from '../../components/ui';

export const LoginCard = component$(() => {
  const loginStore = useStore({
    email: '',
    password: '',
  });

  const storeUpdate = $((e: InputEvent) => {
    const data = e.target as HTMLInputElement;
    if (data.name === 'email') loginStore.email = data.value;
    else loginStore.password = data.value;
  });

  return (
    <div id="form-wrap" class="justify-items-center">
      <Form class="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold tracking-tight text-white">Welcome back</h2>

          <p class="mt-2 text-sm leading-6 text-slate-400">
            Sign in to continue to the job application tracker.
          </p>
        </div>

        <div class="space-y-5">
          <FormField label="Email" required>
            <TextInput
              name="email"
              className="w-full rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
              value={loginStore.email}
              type="email"
              placeholder="Please enter your email"
              returnInput$={storeUpdate}
            />
          </FormField>

          <FormField label="Password" required>
            <TextInput
              name="password"
              className="w-full rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
              value={loginStore.password}
              type="password"
              placeholder="Please enter password"
              returnInput$={storeUpdate}
            />
          </FormField>
        </div>
        <div>
          <ButtonAura label="Login" size="md" type="submit" className="btn btn-accent w-full" />
        </div>
      </Form>
    </div>
  );
});
