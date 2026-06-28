import { component$ } from '@builder.io/qwik';
import type { ButtonHTMLAttributes, QRL } from '@builder.io/qwik';

const buttonSizes = {
  sm: 'btn btn-sm',
  md: 'btn btn-md',
  lg: 'btn btn-lg',
} as const;

type ButtonSize = keyof typeof buttonSizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size: ButtonSize;
  onClick: QRL<() => void>;
}

export const ButtonAura = component$<ButtonProps>(({ onClick, label, size, ...rest }) => (
  <div class="aura-dual">
    <button {...rest} class={buttonSizes[size]} onClick$={onClick}>
      {label}
    </button>
  </div>
));

export const Button = component$<ButtonProps>(({ onClick, label, size, ...rest }) => (
  <div>
    <button {...rest} class={buttonSizes[size]} onClick$={onClick}>
      {label}
    </button>
  </div>
));
