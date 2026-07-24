import { component$, type QRL } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import {
  FormField,
  ButtonAura,
  Button,
  ButtonText,
  EmailInput,
  PasswordInput,
  BordedCard,
} from '../../ui';

import type { LoginActionStore } from '../../../routes';

type LoginFormProps = {
  loginAction: LoginActionStore;
  onShowRegister$: QRL<() => void>;
};

export default component$<LoginFormProps>(
  ({ loginAction, onShowRegister$ }) => (
    <BordedCard>
      <Form
        preventdefault:submit
        action={loginAction}
        aria-label="Please enter your login details in the form below"
      >
        <div class="mb-3">
          <h2 class="text-2xl font-bold tracking-tight text-white">
            Welcome back
          </h2>

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
            <EmailInput />
          </FormField>

          <FormField
            name="password"
            label="Password"
            required
            aria-required
            aria-label="Please enter your password in this field"
          >
            <PasswordInput />
          </FormField>

          <div
            id="button-wrap"
            class=""
            aria-controls="Login button"
            aria-label="Login button"
          >
            {loginAction.isRunning && (
              <ButtonAura size="md" type="submit" disabled>
                Logging in...
              </ButtonAura>
            )}
            {!loginAction.isRunning && (
              <Button size="md" type="submit">
                Login
              </Button>
            )}
          </div>
        </div>
        <div class="mt-5 text-center text-sm text-slate-400">
          Need an account?{' '}
          <ButtonText type="button" onClick$={onShowRegister$}>
            Register
          </ButtonText>
        </div>
      </Form>
    </BordedCard>
  ),
);
