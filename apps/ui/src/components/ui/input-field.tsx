import { component$, Slot, useSignal } from '@builder.io/qwik';
import type {
  ClassList,
  InputHTMLAttributes,
  QRL,
  TextareaHTMLAttributes,
  HTMLAttributes,
  JSXOutput,
} from '@builder.io/qwik';
import { HiEyeSlashSolid, HiEyeOutline } from '@qwikest/icons/heroicons';
import type { RegistrationStore } from '../../routes';

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  class?: ClassList;
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  hintMessage?: string;
}

export const FormField = component$<FormFieldProps>(
  ({
    id,
    label,
    required = false,
    errorMessage,
    hintMessage,
    class: className,
    ...rest
  }) => {
    const message = errorMessage ?? hintMessage;
    const messageId = id && message ? `${id}-message` : undefined;

    return (
      <div {...rest} class={['form-control', className]}>
        {label && (
          <label class="label" for={id}>
            <span class="label-text">
              {label}

              {required && (
                <span class="ml-1 text-error" aria-hidden="true">
                  *
                </span>
              )}
            </span>
          </label>
        )}

        <Slot />

        {message && (
          <p
            id={messageId}
            class={[
              'label-text-alt mt-1',
              errorMessage ? 'text-error' : 'text-base-content/70',
            ]}
          >
            {message}
          </p>
        )}
      </div>
    );
  },
);

interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'class' | 'onInput$'
> {
  containerClass?: string;
  inputClass?: string;
  icon?: JSXOutput;
  iconPosition?: 'start' | 'end';
  iconClass?: string;
  error?: boolean;
  returnInput$?: QRL<(event: InputEvent) => void>;
}

const textInputDefaultSyles = {
  inputClass:
    'h-10.5 min-w-0 flex-1 border-0 bg-transparent text-sm leading-none text-slate-100 placeholder:text-slate-500 outline-none',
  containerClass: 'flex h-10.5 min-w-0 flex-1 border-0 bg-transparent p-0',
};

export const TextInput = component$<TextInputProps>(
  ({
    containerClass,
    inputClass,
    icon,
    iconPosition = 'start',
    iconClass,
    error = false,
    returnInput$,
    type = 'text',
    ...inputProps
  }) => (
    <div
      class={[
        'flex w-full overflow-hidden',
        containerClass ?? textInputDefaultSyles.containerClass,
        'rounded-lg border border-white/10 bg-white/6',
        'transition focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-400/20',
        error &&
          'transition border-error focus-within:border-error focus-within:ring-error',
      ]}
    >
      {icon && iconPosition === 'start' && (
        <span
          class={[
            'flex shrink-0 items-center justify-center',
            '[&>svg]:h-4 [&>svg]:w-4',
            iconClass,
          ].join(' ')}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <input
        {...inputProps}
        type={type}
        class={inputClass ?? textInputDefaultSyles.inputClass}
        onInput$={returnInput$}
      />
      {icon && iconPosition === 'end' && (
        <span
          class={[
            'flex h-full shrink-0 items-center justify-center',
            '[&>svg]:h-4 [&>svg]:w-4',
            iconClass,
          ].join(' ')}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
    </div>
  ),
);

interface TextareaProps<T> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  placeholder?: string;
  rows?: number;
  returnInput: QRL<(v: T) => void>;
}

export const TextArea = component$<TextareaProps<InputEvent>>(
  ({ value, placeholder, rows = 4, returnInput, ...rest }) => (
    <textarea
      {...rest}
      class="text-area text-area-primary"
      placeholder={placeholder}
      value={value}
      rows={rows}
      onInput$={returnInput}
    />
  ),
);

export const EmailInput = component$(() => (
  <TextInput
    id="email"
    name="email"
    type="email"
    placeholder="Please enter your email"
    autocomplete="email"
  />
));

interface PasswordInputProps {
  id?: string;
  name?: string;
}

export const PasswordInput = component$<PasswordInputProps>(({ id, name }) => {
  const isPasswordVisible = useSignal(false);
  return (
    <div id="password-input-comntainer" class="relative">
      <TextInput
        id={id ?? 'password'}
        name={name ?? 'password'}
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
  );
});

interface RegisterEmailInputProps {
  registerAction: RegistrationStore;
  onShowLogin$: QRL<() => void>;
}

export const RegisterEmailInput = component$<RegisterEmailInputProps>(
  ({ onShowLogin$, registerAction }) => {
    return (
      <FormField
        id="email"
        name="email"
        aria-required
        aria-label="Please enter your email in this field"
      >
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
    );
  },
);
