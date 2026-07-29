import * as v from 'valibot';
import {
  normalizeStatus,
  kindFromStatus,
  titleFromStatus,
  isRetryableStatus,
} from './helpers';
import { apiErrorResponseSchema } from '@app/schemas';
import { ErrorDefaults } from '@app/types';
import { isFailureStatus } from '@app/utils';
import type { EdenError, UiProblem } from '../types';

/*
 * Import { validateInput } from ../validation.ts
 * Is deliberately not used it's intended for form input.
 * It flattens validation issues into field and form errors.
 */

export const mapApiError = (error: EdenError): UiProblem => {
  // Uses isFailureStatus directly to avoid normalizing the status to 500
  const isSupported = isFailureStatus(error.status);
  // If the status is not supported, its normalized to 500
  const status = normalizeStatus(error.status);
  const fallback = ErrorDefaults[status];

  const validated = v.safeParse(apiErrorResponseSchema, error.value);

  const response =
    isSupported && validated?.success ? validated.output : fallback;

  const requestId = validated?.success
    ? validated?.output?.requestId
    : undefined;

  return {
    code: response.code,
    kind: kindFromStatus(status),
    status,
    title: titleFromStatus(status),
    message: response.message,
    retryable: isRetryableStatus(status),
    ...(requestId === undefined ? {} : { requestId }),
  };
};
