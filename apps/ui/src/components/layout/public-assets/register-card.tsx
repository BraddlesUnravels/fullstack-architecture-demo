import { component$, type QRL } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import { RegisterEmailInput, BordedCard, FormErrorSummary } from '../../ui';
import type { RegistrationStore } from '../../../routes/login';
import { useActionFormFeedback } from '../../../lib/forms/use-form-feedback';
import type { Register } from '@app/types';

type RegistrationCardProps = {
  registerAction: RegistrationStore;
  onShowLogin$: QRL<() => void>;
};

type RegistrationFormContentProps = {
  value: RegistrationStore['value'];
  isRunning: boolean;
  onShowLogin$: QRL<() => void>;
};

const RegistrationFormContent = component$<RegistrationFormContentProps>(
  (props) => {
    const feedback = useActionFormFeedback<Register>(props);
    console.log('RegistrationFormContent feedback:', feedback); // Debugging log
    return (
      <>
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-white">
            User Registration
          </h2>

          <p class="mt-2 text-sm leading-6 text-slate-400">
            To register enter your email and click Join
          </p>
        </div>

        <FormErrorSummary
          name="email"
          problem={feedback.problem}
          apiError={feedback.apiError}
          formErrors={feedback.formErrors}
        />

        <RegisterEmailInput
          name="email"
          isRunning={props.isRunning}
          emailError={feedback.fieldErrors?.email}
          onInput$={feedback.onFieldInput$}
          onShowLogin$={props.onShowLogin$}
        />
      </>
    );
  },
);

export default component$<RegistrationCardProps>(
  ({ registerAction, onShowLogin$ }) => (
    <BordedCard>
      <Form
        action={registerAction}
        preventdefault:submit
        noValidate
        aria-busy={registerAction.isRunning}
        class="flex flex-col gap-5"
        aria-label="Please enter your email in the form below to register"
      >
        <RegistrationFormContent
          value={registerAction.value}
          isRunning={registerAction.isRunning}
          onShowLogin$={onShowLogin$}
        />
        <div class="text-center text-sm text-slate-400">
          Already registered?{' '}
          <button
            type="button"
            onClick$={onShowLogin$}
            class="cursor-pointer font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            Login
          </button>
        </div>
      </Form>
    </BordedCard>
  ),
);
