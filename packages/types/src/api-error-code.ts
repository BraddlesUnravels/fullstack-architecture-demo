import { ErrorDefaults } from '@app/constants';

/**
 * ApiError is a custom error class that extends the built-in Error class.
 * It includes additional properties such as status and code to provide more context about the error.
 * * 400 Bad Request: The request was invalid or cannot be served.
 * * 401 Unauthorized: The request requires user authentication.
 * * 403 Forbidden: The server understood the request, but refuses to authorize it.
 * * 404 Not Found: The requested resource could not be found.
 * * 409 Conflict: The request could not be completed due to a conflict with the current state of the resource.
 * * 410 Gone: The requested resource no longer exists.
 * * 422 Unprocessable Entity: The request was well-formed but was unable to be followed due to semantic errors.
 * * 500 Internal Server Error: An unexpected condition was encountered on the server.
 */

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'GONE'
  | 'UNPROCESSABLE_ENTITY'
  | 'INTERNAL_SERVER_ERROR'
  | 'BAD_GATEWAY'
  | 'GATEWAY_TIMEOUT'
  | 'SERVICE_UNAVAILABLE'
  | 'TOO_MANY_REQUESTS'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_NO_CREDENTIALS'
  | 'AUTH_CREDENTIAL_CREATE_FAILED'
  | 'AUTH_PASSWORD_CONFIRMATION_MISMATCH'
  | 'AUTH_SESSION_NOT_FOUND'
  | 'AUTH_SESSION_CREATE_FAILED'
  | 'AUTH_EMAIL_CONFLICT'
  | 'AUTH_USER_CREATION_FAILED'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_REGISTRATION_LINK_EXPIRED'
  | 'JWT_VERIFICATION_FAILED'
  | 'USER_NOT_FOUND'
  | 'USER_EMAIL_CONFLICT'
  | 'USER_CREATION_FAILED'
  | 'USER_UPDATE_FAILED'
  | 'USER_DELETE_FAILED'
  | 'APPLICATION_NOT_FOUND'
  | 'APPLICATION_CREATION_FAILED'
  | 'APPLICATION_UPDATE_FAILED'
  | 'APPLICATION_DELETE_FAILED';

export type ApiErrorStatus =
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

export type ApiErrorDefaults = Record<
  ApiErrorStatus,
  {
    status: ApiErrorStatus;
    code: ApiErrorCode;
    message: string;
  }
>;

export type ApiErrorParams = {
  status: ApiErrorStatus;
  code?: ApiErrorCode;
  message?: string;
  cause?: unknown;
};

export type ApiErrorCodes = {
  [key in ApiErrorStatus]: ApiErrorParams;
};

export class ApiError extends Error {
  public readonly status: ApiErrorStatus;
  public readonly code: ApiErrorCode;

  constructor({ status, code, message, cause }: ApiErrorParams) {
    const defaults = ErrorDefaults[status] ?? ErrorDefaults[500];
    super(message ?? defaults.message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.code = code ?? defaults.code;
    this.cause = cause;
  }

  toResponse() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export type FailureStatus = keyof typeof ErrorDefaults;

export type ErrorDefault = (typeof ErrorDefaults)[FailureStatus];

export type DefaultErrorCode = ErrorDefault['code'];
