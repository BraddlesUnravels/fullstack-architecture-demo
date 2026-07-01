import { ApiError } from '../../errors';

// Auth errors
export class InvalidCredentialsError extends ApiError {
  constructor(message = 'Invalid email or password') {
    super({
      status: 401,
      code: 'AUTH_INVALID_CREDENTIALS',
      message,
    });
    this.name = 'InvalidCredentialsError';
  }
}

export class RegistrationLinkExpiredError extends ApiError {
  constructor(message = 'Registration link has expired') {
    super({
      status: 410,
      code: 'AUTH_REGISTRATION_LINK_EXPIRED',
      message,
    });
    this.name = 'RegistrationLinkExpiredError';
  }
}

export class NoCredentialsSetError extends ApiError {
  constructor(message = 'No credentials set for this user') {
    super({
      status: 401,
      code: 'AUTH_NO_CREDENTIALS',
      message,
    });
    this.name = 'NoCredentialsSetError';
  }
}

export class SessionNotFoundError extends ApiError {
  constructor(message = 'Session not found') {
    super({
      status: 404,
      code: 'AUTH_SESSION_NOT_FOUND',
      message,
    });
    this.name = 'SessionNotFoundError';
  }
}

export class MissingSessionTokenError extends ApiError {
  constructor(message = 'Authorization header is required') {
    super({
      status: 401,
      code: 'AUTH_MISSING_SESSION_TOKEN',
      message,
    });
    this.name = 'MissingSessionTokenError';
  }
}

export class InvalidSessionTokenError extends ApiError {
  constructor(message = 'Session token is invalid') {
    super({
      status: 401,
      code: 'AUTH_INVALID_SESSION_TOKEN',
      message,
    });
    this.name = 'InvalidSessionTokenError';
  }
}

export class SessionExpiredError extends ApiError {
  constructor(message = 'Session has expired') {
    super({
      status: 401,
      code: 'AUTH_SESSION_EXPIRED',
      message,
    });
    this.name = 'SessionExpiredError';
  }
}

export class SessionCreateFailedError extends ApiError {
  constructor(message = 'Failed to create session') {
    super({
      status: 500,
      code: 'AUTH_SESSION_CREATE_FAILED',
      message,
    });
    this.name = 'SessionCreateFailedError';
  }
}

export class PasswordConfirmationMismatchError extends ApiError {
  constructor(message = 'Password and confirm password do not match') {
    super({
      status: 400,
      code: 'AUTH_PASSWORD_CONFIRMATION_MISMATCH',
      message,
    });
    this.name = 'PasswordConfirmationMismatchError';
  }
}

export class JwtVerificationError extends ApiError {
  constructor(message = 'Invalid jwt token', cause?: unknown) {
    super({
      status: 401,
      code: 'JWT_VERIFICATION_FAILED',
      message,
      cause,
    });
    this.name = 'JwtVerificationError';
  }
}

// Email errors
export class EmailConflictError extends ApiError {
  constructor(message = 'A user with this email already exists') {
    super({
      status: 409,
      code: 'AUTH_EMAIL_CONFLICT',
      message,
    });
    this.name = 'EmailConflictError';
  }
}

export class EmailConfirmationMismatchError extends ApiError {
  constructor(message = 'Email and confirm email do not match') {
    super({
      status: 400,
      code: 'AUTH_EMAIL_CONFIRMATION_MISMATCH',
      message,
    });
    this.name = 'EmailConfirmationMismatchError';
  }
}

// User errors
export class UserCreationFailedError extends ApiError {
  constructor(message = 'Failed to create user') {
    super({
      status: 500,
      code: 'AUTH_USER_CREATION_FAILED',
      message,
    });
    this.name = 'UserCreationFailedError';
  }
}

export class CredentialCreationFailedError extends ApiError {
  constructor(message = 'Failed to create user credentials') {
    super({
      status: 500,
      code: 'AUTH_CREDENTIAL_CREATE_FAILED',
      message,
    });
    this.name = 'CredentialCreationFailedError';
  }
}
