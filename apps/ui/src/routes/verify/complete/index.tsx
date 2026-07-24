import { component$ } from '@builder.io/qwik';
import { Form, routeAction$ } from '@builder.io/qwik-city';
import { completeRegistration } from '../../../lib/actions';
import {
  FormField,
  PasswordInput,
  TextInput,
  BordedCard,
} from '../../../components/ui';

export const useCompleteRegistrationAction = routeAction$(completeRegistration);

export default component$(() => {
  const completeRegistrationAction = useCompleteRegistrationAction();

  return (
    <BordedCard>
      <h1 class="text-2xl font-semibold text-white">
        Complete your registration
      </h1>

      <Form action={completeRegistrationAction} class="mt-6 space-y-4">
        <FormField
          id="firstName"
          name="firstName"
          label="FirstName"
          required
          aria-required
          aria-label="Please enter your email in this field"
        >
          <TextInput id="firstName" name="firstName" placeholder="First Name" />
        </FormField>

        <FormField
          id="lastName"
          name="lastName"
          label="LastName"
          required
          aria-required
          aria-label="Please enter your email in this field"
        >
          <TextInput id="lastName" name="lastName" placeholder="Last Name" />
        </FormField>

        <FormField
          id="password"
          name="password"
          label="Password"
          required
          aria-required
          aria-label="Please enter your password in this field"
        >
          <PasswordInput />
        </FormField>

        <FormField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          required
          aria-required
          aria-label="Please confirm your password in this field"
        >
          <PasswordInput id="confirmPassword" name="confirmPassword" />
        </FormField>

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
    </BordedCard>
  );
});
