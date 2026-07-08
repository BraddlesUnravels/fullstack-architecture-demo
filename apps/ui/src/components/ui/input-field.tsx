import { component$, Slot } from '@builder.io/qwik';
import type {
  InputHTMLAttributes,
  QRL,
  TextareaHTMLAttributes,
  FormHTMLAttributes,
} from '@builder.io/qwik';
// import { HiEyeSlashSolid, HiEyeOutline } from '@qwikest/icons/heroicons';

interface FormFieldProps extends FormHTMLAttributes<HTMLFormElement> {
  label?: string;
  required?: boolean;
  error?: boolean;
  hint?: boolean;
  message?: string;
}

export const FormField = component$<FormFieldProps>(
  ({ label, required = false, error, hint, message }) => (
    <div class="form-control">
      <label class="label">
        <span class="label-text">
          {label}
          {required && <span class="text-error ml-1">*</span>}
        </span>
      </label>
      {/* inputs are wrrapped in this slot */}
      <Slot />

      {error && (
        <label class="label">
          <span class="label-text-alt text-error">{message}</span>
        </label>
      )}

      {hint && (
        <label class="label">
          <span class="label-text-alt text-base/70">{message}</span>
        </label>
      )}
    </div>
  ),
);

interface TextInputProps<T> extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  className?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  required?: boolean;
  returnInput$?: QRL<(v: T) => void>;
}

export const TextInput = component$<TextInputProps<InputEvent>>(
  ({ value, placeholder, className, type = 'text', required = false, returnInput$, ...rest }) => (
    <input
      {...rest}
      type={type}
      class={className ?? 'input input-primary min-w-full'}
      placeholder={placeholder}
      value={value}
      required={required}
      onInput$={returnInput$}
    />
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

export const PasswordInput = component$<TextInputProps<InputEvent>>(() => {
  return <TextInput />;
});
