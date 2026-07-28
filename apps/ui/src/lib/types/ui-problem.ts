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

export type ActionFailure = {
  problem: UiProblem;
  fieldErrors?: Record<string, string>;
  formErrors?: string[];
};

export type { FailureStatus } from '@app/types';
