import { component$, Slot } from '@builder.io/qwik';
import type {
  ClassList,
  InputHTMLAttributes,
  QRL,
  TextareaHTMLAttributes,
  HTMLAttributes,
  JSXOutput,
} from '@builder.io/qwik';

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
        ['input input-bordered outline-none rounded-lg', containerClass],
        'border-white/10 bg-white/3 text-slate-200',
        error
          ? 'border-error focus-within:border-error'
          : 'focus-within:border-primary',
      ]}
    >
      {icon && iconPosition === 'start' && (
        <span
          class={[
            'flex h-full shrink-0 items-stretch text-slate-400',
            iconClass,
          ]}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <input
        {...inputProps}
        type={type}
        class={inputClass}
        onInput$={returnInput$}
      />
      {icon && iconPosition === 'end' && (
        <span
          class={[
            'flex h-full shrink-0 items-stretch text-slate-400',
            iconClass,
          ]}
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
