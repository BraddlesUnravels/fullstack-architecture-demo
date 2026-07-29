import type { FailureStatus } from '@app/types';

export type UiProblemKind =
  | 'validation'
  | 'unauthenticated'
  | 'forbidden'
  | 'not-found'
  | 'conflict'
  | 'unavailable'
  | 'unexpected';

export type UiError = {
  id: string;
  level: 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  transient?: boolean;
  action?: {
    label: string;
    id?: string;
  };
  metadata?: Record<string, unknown>;
};

export type UiProblem = {
  code: string;
  kind: UiProblemKind;
  status: FailureStatus;
  title: string;
  message: string;
  retryable: boolean;
  requestId?: string;
};

export type FieldErrors<T> = Partial<Record<Extract<keyof T, string>, string>>;

export type ActionFieldErrors<T> = Partial<
  Record<Extract<keyof T, string> | 'api', string>
>;

export type ActionFailure<T> = {
  problem: UiProblem;
  fieldErrors: ActionFieldErrors<T>;
  formErrors: string[];
};

export type { FailureStatus } from '@app/types';
