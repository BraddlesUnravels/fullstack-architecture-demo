import { component$, type QRL, Slot } from '@builder.io/qwik';

interface FormFieldProps {
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

interface TextInputProps {
  value: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  required?: boolean;
  onInput$: QRL<(value: string) => void>;
}

export const TextInput = component$<TextInputProps>(
  ({ value, placeholder, type = 'text', required = false, onInput$ }) => (
    <input
      type={type}
      class="input input-primary"
      placeholder={placeholder}
      value={value}
      required={required}
      onInput$={(e) => onInput$((e.target as HTMLInputElement).value)}
    />
  ),
);

interface TextareaProps {
  value: string;
  placeholder?: string;
  rows?: number;
  onInput$: QRL<(value: string) => void>;
}

export const TextArea = component$<TextareaProps>(({ value, placeholder, rows = 4, onInput$ }) => (
  <textarea
    class="text-area text-area-primary"
    placeholder={placeholder}
    value={value}
    rows={rows}
    onInput$={(e) => onInput$((e.target as HTMLTextAreaElement).value)}
  />
));
