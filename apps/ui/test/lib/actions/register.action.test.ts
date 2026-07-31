import { ErrorDefaults } from '@app/types';
import type { JSONObject, RequestEventAction } from '@builder.io/qwik-city';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerAction } from '../../../src/lib/actions/register.action';
import { api } from '../../../src/lib/api/api';
import { logError } from '../../../src/lib/logger/runtime';

vi.mock('../../../src/lib/api/api', () => ({
  api: vi.fn(),
}));

vi.mock('../../../src/lib/logger/runtime', () => ({
  logError: vi.fn(),
}));

const put = vi.fn();
const mockedApi = vi.mocked(api);
const mockedLogError = vi.mocked(logError);

const createEvent = () => {
  const fail = vi.fn((status: number, data: Record<string, unknown>) => ({
    failed: true as const,
    status,
    ...data,
  }));

  return {
    event: {
      fail,
    } as unknown as RequestEventAction,
    fail,
  };
};

beforeEach(() => {
  vi.resetAllMocks();

  mockedApi.mockReturnValue({
    auth: {
      put,
    },
  } as unknown as ReturnType<typeof api>);
});

describe('registerAction', () => {
  it('should preserve the successful registration response', async () => {
    put.mockResolvedValue({
      data: {
        email: 'person@example.com',
        message:
          'Registration started. Please check your email to verify your account.',
      },
      error: null,
      status: 200,
      response: new Response(null, {
        status: 200,
      }),
    });

    const { event, fail } = createEvent();

    const result = await registerAction(
      {
        email: 'person@example.com',
      },
      event,
    );

    expect(put).toHaveBeenCalledOnce();

    expect(put).toHaveBeenCalledWith({
      email: 'person@example.com',
    });

    expect(fail).not.toHaveBeenCalled();

    expect(result).toEqual({
      success: true,
      email: 'person@example.com',
      message:
        'Registration started. Please check your email to verify your account.',
    });
  });

  it.each([
    {
      description: 'an invalid email',
      form: {
        email: 'not-an-email',
      },
    },
    {
      description: 'a missing email',
      form: {},
    },
  ] satisfies readonly {
    description: string;
    form: JSONObject;
  }[])(
    'should reject $description without calling the API',
    async ({ form }) => {
      const { event, fail } = createEvent();
      // @ts-ignore
      const result = await registerAction(form, event);

      expect(put).not.toHaveBeenCalled();

      expect(fail).toHaveBeenCalledWith(
        422,
        expect.objectContaining({
          problem: {
            code: 'VALIDATION_ERROR',
            kind: 'validation',
            status: 422,
            title: 'Check the highlighted fields',
            message:
              'The request could not be processed due to validation errors.',
            retryable: false,
          },
          fieldErrors: {
            email: expect.any(String),
          },
          formErrors: [],
        }),
      );

      expect(result).toMatchObject({
        failed: true,
        status: 422,
        fieldErrors: {
          email: expect.any(String),
        },
        formErrors: [],
      });
    },
  );
  it('should map a structured Eden error to the api field', async () => {
    put.mockResolvedValue({
      data: null,
      error: {
        status: 409,
        value: {
          code: 'AUTH_EMAIL_CONFLICT',
          message: 'Unable to begin registration',
          requestId: 'request-123',
        },
      },
      status: 409,
      response: new Response(null, {
        status: 409,
      }),
    });

    const { event } = createEvent();

    const result = await registerAction(
      {
        email: 'person@example.com',
      },
      event,
    );

    expect(result).toMatchObject({
      failed: true,
      status: 409,
      problem: {
        code: 'AUTH_EMAIL_CONFLICT',
        kind: 'conflict',
        status: 409,
        title: 'Request conflict',
        message: 'Unable to begin registration',
        retryable: false,
        requestId: 'request-123',
      },
      fieldErrors: {
        api: 'Unable to begin registration',
      },
      formErrors: [],
    });
  });

  it('should map a thrown transport error to a safe 503 problem', async () => {
    const transportError = new TypeError('fetch failed: ECONNREFUSED');

    put.mockRejectedValue(transportError);

    const { event } = createEvent();

    const result = await registerAction(
      {
        email: 'person@example.com',
      },
      event,
    );

    expect(mockedLogError).toHaveBeenCalledOnce();

    expect(mockedLogError).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'TypeError',
        message: 'fetch failed: ECONNREFUSED',
      }),
      {
        action: 'registerAction',
        category: 'transport',
      },
    );

    expect(result).toMatchObject({
      failed: true,
      status: 503,
      problem: {
        code: 'API_UNREACHABLE',
        kind: 'unavailable',
        status: 503,
        title: 'Service temporarily unavailable',
        message:
          'The service is temporarily unavailable. Please try again shortly.',
        retryable: true,
      },
      fieldErrors: {
        api: 'The service is temporarily unavailable. Please try again shortly.',
      },
      formErrors: [],
    });

    expect(JSON.stringify(result)).not.toContain('ECONNREFUSED');
  });

  it('should use a safe 500 fallback for an empty success response', async () => {
    put.mockResolvedValueOnce(undefined);

    const { event } = createEvent();

    const result = await registerAction(
      {
        email: 'person@example.com',
      },
      event,
    );

    expect(result).toMatchObject({
      failed: true,
      status: 500,
      problem: {
        code: ErrorDefaults[500].code,
        kind: 'unexpected',
        status: 500,
        title: 'Something went wrong',
        message: ErrorDefaults[500].message,
        retryable: false,
      },
      fieldErrors: {
        api: ErrorDefaults[500].message,
      },
      formErrors: [],
    });
  });

  it('should reject a malformed API error body and not expose raw Eden data', async () => {
    put.mockResolvedValue({
      data: null,
      error: {
        status: 503,
        value: {
          code: 'UPSTREAM_FAILURE',
          message: 'Registration is temporarily unavailable',
          internal: 'private infrastructure detail',
        },
      },
      status: 503,
      response: new Response('private response body', {
        status: 503,
      }),
    });

    const { event } = createEvent();

    const result = await registerAction(
      {
        email: 'person@example.com',
      },
      event,
    );

    expect(result).toMatchObject({
      failed: true,
      status: 503,
      problem: {
        code: ErrorDefaults[503].code,
        status: 503,
        message: ErrorDefaults[503].message,
      },
      fieldErrors: {
        api: ErrorDefaults[503].message,
      },
    });

    expect(result).not.toHaveProperty('error');
    expect(result).not.toHaveProperty('value');
    expect(result).not.toHaveProperty('response');

    const serialisedResult = JSON.stringify(result);

    expect(serialisedResult).not.toContain('private infrastructure detail');

    expect(serialisedResult).not.toContain('private response body');
  });
});
