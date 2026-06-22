import { ErrorDefaults } from './defaults';
import type { ApiErrorCode } from './api-error-code';

/**
 * AppError is a custom error class that extends the built-in Error class.
 * It includes additional properties such as status and code to provide more context about the error.
 * * 400 Bad Request: The request was invalid or cannot be served.
 * * 401 Unauthorized: The request requires user authentication.
 * * 403 Forbidden: The server understood the request, but refuses to authorize it.
 * * 404 Not Found: The requested resource could not be found.
 * * 409 Conflict: The request could not be completed due to a conflict with the current state of the resource.
 * * 422 Unprocessable Entity: The request was well-formed but was unable to be followed due to semantic errors.
 * * 500 Internal Server Error: An unexpected condition was encountered on the server.
 */
export type ApiErrorStatus = 400 | 401 | 403 | 404 | 409 | 422 | 500;

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
