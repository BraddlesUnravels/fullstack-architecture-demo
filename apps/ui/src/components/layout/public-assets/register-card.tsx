import { component$, type QRL } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import { RegisterEmailInput, BordedCard } from '../../ui';
import type { RegistrationStore } from '../../../routes';

type LoginCardProps = {
  registerAction: RegistrationStore;
  onShowLogin$: QRL<() => void>;
};

export default component$<LoginCardProps>(
  ({ registerAction, onShowLogin$ }) => (
    <BordedCard>
      <Form
        action={registerAction}
        preventdefault:submit
        aria-label="Please enter your email in the form below to register"
      >
        <div class="">
          <h2 class="text-2xl font-bold tracking-tight text-white">
            User Registration
          </h2>

          <p class="mt-2 text-sm leading-6 text-slate-400">
            To register enter your email and click Join
          </p>
        </div>

        <RegisterEmailInput
          registerAction={registerAction}
          onShowLogin$={onShowLogin$}
        />
      </Form>
    </BordedCard>
  ),
);
