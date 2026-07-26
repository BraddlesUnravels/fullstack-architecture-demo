const ErrorDefaults = {
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
  410: {
    code: 'GONE',
    status: 410,
    message: 'Gone',
  },
  422: {
    code: 'UNPROCESSABLE_ENTITY',
    status: 422,
    message: 'Unprocessable entity',
  },
  429: {
    code: 'TOO_MANY_REQUESTS',
    status: 429,
    message: 'Too many requests',
  },
  500: {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500,
    message: 'Internal server error',
  },
  502: {
    code: 'BAD_GATEWAY',
    status: 502,
    message: 'Bad gateway',
  },
  503: {
    code: 'SERVICE_UNAVAILABLE',
    status: 503,
    message: 'Service unavailable',
  },
  504: {
    code: 'GATEWAY_TIMEOUT',
    status: 504,
    message: 'Gateway timeout',
  },
} as const;

type FailureStatus = keyof typeof ErrorDefaults;

type ErrorDefault = (typeof ErrorDefaults)[FailureStatus];

type DefaultErrorCode = ErrorDefault['code'];

export {
  ErrorDefaults,
  type DefaultErrorCode,
  type ErrorDefault,
  type FailureStatus,
};
