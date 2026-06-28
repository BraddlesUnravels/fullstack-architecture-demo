import { component$, Slot } from '@builder.io/qwik';
import type {
  InputHTMLAttributes,
  QRL,
  TextareaHTMLAttributes,
  FormHTMLAttributes,
} from '@builder.io/qwik';

interface FormFieldProps extends FormHTMLAttributes<HTMLFormElement> {
  label: string;
  required: boolean;
  error?: string;
  hint?: string;
}

export const FormField = component$<FormFieldProps>(({ label, required = false, error, hint }) => (
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
        <span class="label-text-alt text-error">{error}</span>
      </label>
    )}

    {hint && (
      <label class="label">
        <span class="label-text-alt text-base/70">{hint}</span>
      </label>
    )}
  </div>
));

interface TextInputProps<T> extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  required?: boolean;
  onChange: QRL<(v: T) => void>;
}

export const TextInput = component$<TextInputProps<InputEvent>>(
  ({ value, placeholder, type = 'text', required = false, onChange, ...rest }) => (
    <input
      {...rest}
      type={type}
      class="input input-primary"
      placeholder={placeholder}
      value={value}
      required={required}
      onInput$={onChange}
    />
  ),
);

interface TextareaProps<T> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: QRL<(v: T) => void>;
}

export const TextArea = component$<TextareaProps<InputEvent>>(
  ({ value, placeholder, rows = 4, onChange, ...rest }) => (
    <textarea
      {...rest}
      class="text-area text-area-primary"
      placeholder={placeholder}
      value={value}
      rows={rows}
      onInput$={onChange}
    />
  ),
);
