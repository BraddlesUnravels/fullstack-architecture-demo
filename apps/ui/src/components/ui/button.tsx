import { component$, Slot } from '@builder.io/qwik';
import type { ButtonHTMLAttributes, QRL } from '@builder.io/qwik';

const buttonSizes = {
  sm: 'btn btn-sm',
  md: 'btn btn-md',
  lg: 'btn btn-lg',
  undefined: undefined,
} as const;

type ButtonSize = keyof typeof buttonSizes;

const buttonDefaultStyles = [
  'flex w-full h-full shrink-0 cursor-pointer',
  'items-center justify-center border-0 border-l border-white/10',
  'bg-linear-to-r from-teal-400 to-cyan-400 text-sm font-semibold',
  'leading-none text-slate-950 transition hover:brightness-110',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
  'focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60',
].join(' ');

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  onClick$?: QRL<() => void>;
  class?: string;
}

export const ButtonAura = component$<ButtonProps>(
  ({ onClick$, size, class: className, ...rest }) => (
    <div class="aura w-full h-10 rounded-lg overflow-hidden">
      <button
        {...rest}
        class={[
          buttonSizes[size ?? 'undefined'],
          className ?? buttonDefaultStyles,
        ].join(' ')}
        onClick$={onClick$}
      >
        <Slot />
      </button>
    </div>
  ),
);

export const Button = component$<ButtonProps>(
  ({ onClick$, size, class: className, ...rest }) => (
    <div class="w-full h-10 rounded-lg overflow-hidden">
      <button
        {...rest}
        class={[
          buttonSizes[size ?? 'undefined'],
          className ?? buttonDefaultStyles,
        ].join(' ')}
        onClick$={onClick$}
      >
        <Slot />
      </button>
    </div>
  ),
);

export const ButtonText = component$<ButtonProps>(
  ({ onClick$, size, class: className, ...rest }) => (
    <button
      {...rest}
      class={[
        buttonSizes[size ?? 'undefined'],
        className,
        'cursor-pointer font-semibold w-auto text-cyan-300 transition hover:text-cyan-200',
      ].join(' ')}
      onClick$={onClick$}
    >
      <Slot />
    </button>
  ),
);
