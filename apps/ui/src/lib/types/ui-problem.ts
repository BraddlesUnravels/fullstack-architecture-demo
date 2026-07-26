export type FailureStatus =
  | 400
  | 401
  | 403
  | 404
  | 409
  | 410
  | 422
  | 429
  | 500
  | 502
  | 503
  | 504;

export type AppError = FailureStatus;

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
  transient?: boolean; // toast vs persistent
  action?: { label: string; id?: string };
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
