import type { JSXOutput } from '@builder.io/qwik';
import type { IconProps } from '@qwikest/icons';

export type NavItem = {
  label: string;
  href: string;
  icon: (props: IconProps) => JSXOutput;
};

export type ErrorKind =
  | 'validation'
  | 'auth'
  | 'network'
  | 'not-found'
  | 'forbidden'
  | 'unknown';

export type AppError = {
  readonly name: string;
  readonly message: string;
  readonly kind: ErrorKind;
  readonly code?: string;
  readonly metadata?: Record<string, unknown>;
};

export type UiError = {
  id: string;
  level: 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  transient?: boolean; // toast vs persistent
  action?: { label: string; id?: string };
  metadata?: Record<string, unknown>;
};
