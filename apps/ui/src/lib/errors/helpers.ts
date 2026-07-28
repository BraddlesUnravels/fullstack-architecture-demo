import { isFailureStatus } from '@app/utils';
import type { UiProblemKind } from '../types';
import type { FailureStatus } from '@app/types';

// ApiError mapper helpers
export const normaliseStatus = (status: number): FailureStatus =>
  isFailureStatus(status) ? status : 500;

export const kindFromStatus = (status: FailureStatus): UiProblemKind => {
  switch (status) {
    case 400:
    case 422:
      return 'validation';
    case 401:
      return 'unauthenticated';
    case 403:
      return 'forbidden';
    case 404:
    case 410:
      return 'not-found';
    case 409:
      return 'conflict';
    case 429:
    case 502:
    case 503:
    case 504:
      return 'unavailable';
    default:
      return 'unexpected';
  }
};

export const titleFromStatus = (status: FailureStatus): string => {
  switch (status) {
    case 400:
    case 422:
      return 'Check your request';

    case 401:
      return 'Authentication required';

    case 403:
      return 'Access denied';

    case 404:
      return 'Not found';

    case 409:
      return 'Request conflict';

    case 410:
      return 'No longer available';

    case 429:
      return 'Too many requests';

    case 502:
    case 503:
    case 504:
      return 'Service unavailable';

    case 500:
      return 'Something went wrong';
  }
};

export const isRetryableStatus = (status: FailureStatus): boolean => {
  switch (status) {
    case 429:
    case 502:
    case 503:
    case 504:
      return true;

    default:
      return false;
  }
};

// Error normalization helpers
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const asNonEmptyString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined;

export const normalizeCode = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.length > 0) return value;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
};
