import { ApiErrorCodes } from '../errors';

export const ErrorDefaults = {
  400: {
    code: 'BAD_REQUEST',
    status: 400,
    message: 'Bad request',
  },
  401: {
    code: 'UNAUTHORIZED',
    status: 401,
    message: 'Unauthorized',
  },
  403: {
    code: 'FORBIDDEN',
    status: 403,
    message: 'Forbidden',
  },
  404: {
    code: 'NOT_FOUND',
    status: 404,
    message: 'Not found',
  },
  409: {
    code: 'CONFLICT',
    status: 409,
    message: 'Conflict',
  },
  422: {
    code: 'UNPROCESSABLE_ENTITY',
    status: 422,
    message: 'Unprocessable entity',
  },
  500: {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500,
    message: 'Internal server error',
  },
} as const satisfies ApiErrorCodes;
