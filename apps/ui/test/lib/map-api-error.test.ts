import { describe, expect, it } from 'vitest';
import { ErrorDefaults, type FailureStatus } from '@app/types';
import { isFailureStatus } from '@app/utils';
import { mapApiError } from '../../src/lib/errors/map-api-error';

const supportedStatuses = [
  400, 401, 403, 404, 409, 410, 422, 429, 500, 502, 503, 504,
] as const satisfies readonly FailureStatus[];

const statusCases = [
  {
    status: 400,
    kind: 'validation',
    title: 'Check your request',
    retryable: false,
  },
  {
    status: 401,
    kind: 'unauthenticated',
    title: 'Authentication required',
    retryable: false,
  },
  {
    status: 403,
    kind: 'forbidden',
    title: 'Access denied',
    retryable: false,
  },
  {
    status: 404,
    kind: 'not-found',
    title: 'Not found',
    retryable: false,
  },
  {
    status: 409,
    kind: 'conflict',
    title: 'Request conflict',
    retryable: false,
  },
  {
    status: 410,
    kind: 'not-found',
    title: 'No longer available',
    retryable: false,
  },
  {
    status: 422,
    kind: 'validation',
    title: 'Check your request',
    retryable: false,
  },
  {
    status: 429,
    kind: 'unavailable',
    title: 'Too many requests',
    retryable: true,
  },
  {
    status: 500,
    kind: 'unexpected',
    title: 'Something went wrong',
    retryable: false,
  },
  {
    status: 502,
    kind: 'unavailable',
    title: 'Service unavailable',
    retryable: true,
  },
  {
    status: 503,
    kind: 'unavailable',
    title: 'Service unavailable',
    retryable: true,
  },
  {
    status: 504,
    kind: 'unavailable',
    title: 'Service unavailable',
    retryable: true,
  },
] as const;

describe('isFailureStatus', () => {
  it('accepts every supported failure status', () => {
    for (const status of supportedStatuses) {
      expect(isFailureStatus(status)).toBe(true);
    }
  });

  it('rejects unsupported and non-numeric values', () => {
    const unsupportedValues: unknown[] = [
      200,
      418,
      501,
      -1,
      400.5,
      '400',
      null,
      undefined,
      {},
      [],
    ];

    for (const value of unsupportedValues) {
      expect(isFailureStatus(value)).toBe(false);
    }
  });
});

describe('mapApiError', () => {
  it('preserves a validated API error response', () => {
    const problem = mapApiError({
      status: 409,
      value: {
        code: 'AUTH_EMAIL_CONFLICT',
        message: 'Unable to begin registration',
        requestId: 'request-123',
      },
    });

    expect(problem).toEqual({
      code: 'AUTH_EMAIL_CONFLICT',
      kind: 'conflict',
      status: 409,
      title: 'Request conflict',
      message: 'Unable to begin registration',
      retryable: false,
      requestId: 'request-123',
    });
  });

  it('uses status defaults when the response body is invalid', () => {
    const problem = mapApiError({
      status: 422,
      value: {
        code: 123,
        message: null,
      },
    });

    expect(problem).toEqual({
      code: ErrorDefaults[422].code,
      kind: 'validation',
      status: 422,
      title: 'Check your request',
      message: ErrorDefaults[422].message,
      retryable: false,
    });
  });

  it('uses the complete 500 fallback for unsupported statuses', () => {
    const problem = mapApiError({
      status: 418,
      value: {
        code: 'UNKNOWN_ERROR',
        message: 'Unsupported response',
        requestId: 'request-456',
      },
    });

    expect(problem).toEqual({
      code: ErrorDefaults[500].code,
      kind: 'unexpected',
      status: 500,
      title: 'Something went wrong',
      message: ErrorDefaults[500].message,
      retryable: false,
      requestId: 'request-456',
    });
  });

  for (const testCase of statusCases) {
    it(`maps status ${testCase.status} consistently`, () => {
      const fallback = ErrorDefaults[testCase.status];

      const problem = mapApiError({
        status: testCase.status,
        value: {
          code: fallback.code,
          message: fallback.message,
        },
      });

      expect(problem).toEqual({
        code: fallback.code,
        kind: testCase.kind,
        status: testCase.status,
        title: testCase.title,
        message: fallback.message,
        retryable: testCase.retryable,
      });
    });
  }
});
