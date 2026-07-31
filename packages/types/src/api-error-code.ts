import {
  ErrorDefaults,
  type DefaultErrorCode,
  type FailureStatus,
} from './api-error-default';

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
  | DefaultErrorCode
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

export type ApiErrorDefaults = Record<
  FailureStatus,
  {
    status: FailureStatus;
    code: ApiErrorCode;
    message: string;
  }
>;

export type ApiErrorParams = {
  status: FailureStatus;
  code?: ApiErrorCode;
  message?: string;
  cause?: unknown;
};

export type ApiErrorCodes = {
  [Status in FailureStatus]: ApiErrorParams;
};

export class ApiError extends Error {
  public readonly status: FailureStatus;
  public readonly code: ApiErrorCode;

  constructor({ status, code, message, cause }: ApiErrorParams) {
    const defaults = ErrorDefaults[status];

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
