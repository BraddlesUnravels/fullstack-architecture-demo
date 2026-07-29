import type { JSXOutput } from '@builder.io/qwik';
import type { IconProps } from '@qwikest/icons';
import type { FieldErrors } from './ui-problem';

// exports
export * from './ui-problem';
export * from './eden';
export * from './session-cookie';
export * from './runtime-error';

export type NavItem = {
  label: string;
  href: string;
  icon: (props: IconProps) => JSXOutput;
};

export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      fieldErrors: FieldErrors<T>;
      formErrors: string[];
    };
