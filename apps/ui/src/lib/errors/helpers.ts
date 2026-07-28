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

export const isArrayRecord = (
  value: unknown,
): value is Record<string, unknown>[] =>
  Array.isArray(value) && value.every((item) => isRecord(item));

export const asNonEmptyString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined;

export const normalizeCode = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.length > 0) return value;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
};

type StringProperty = 'message' | 'name';

export const getNonEmptyStringProperty = (
  value: unknown,
  property: StringProperty,
): string | undefined => {
  if (
    value === null ||
    (typeof value !== 'object' && typeof value !== 'function')
  ) {
    return undefined;
  }

  try {
    return asNonEmptyString(Reflect.get(value, property));
  } catch {
    return undefined;
  }
};

export const safelyConvertToString = (value: unknown): string => {
  try {
    return String(value);
  } catch {
    return '[Unprintable thrown value]';
  }
};

export const describeThrownValue = (error: unknown): string => {
  if (error === undefined) return 'undefined';
  if (error === null) return 'null';

  if (typeof error === 'string')
    return asNonEmptyString(error) ?? '[Empty string]';

  const directMessage = asNonEmptyString(error);
  if (directMessage) return directMessage;

  const objectMessage = getNonEmptyStringProperty(error, 'message');
  if (objectMessage) return objectMessage;

  if (error instanceof Error)
    return getNonEmptyStringProperty(error, 'name') ?? 'Error';

  if (Array.isArray(error)) {
    const messages = error.map(
      (item) =>
        asNonEmptyString(item) ?? getNonEmptyStringProperty(item, 'message'),
    );

    if (
      messages.length > 0 &&
      messages.every((message): message is string => message !== undefined)
    )
      return messages.join('; ');
  }

  switch (typeof error) {
    case 'number':
    case 'bigint':
    case 'boolean':
    case 'symbol':
      return safelyConvertToString(error);

    case 'function': {
      const name = getNonEmptyStringProperty(error, 'name');
      return name ? `[Function ${name}]` : '[Function]';
    }
  }

  try {
    const serialized = JSON.stringify(error);

    if (serialized !== undefined) return serialized;
  } catch {
    // Ignore serialization errors
  }

  return safelyConvertToString(error);
};
