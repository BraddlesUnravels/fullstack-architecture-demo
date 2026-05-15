import { ApiError } from '../../errors';

export class UserNotFoundError extends ApiError {
  constructor(message = 'User not found') {
    super({
      status: 404,
      code: 'USER_NOT_FOUND',
      message,
    });
    this.name = 'UserNotFoundError';
  }
}

export class UserEmailConflictError extends ApiError {
  constructor(message = 'The email provided belongs to an existing account') {
    super({
      status: 409,
      code: 'USER_EMAIL_CONFLICT',
      message,
    });
    this.name = 'UserEmailConflictError';
  }
}

export class UserCreateFailedError extends ApiError {
  constructor(message = 'Failed to create user') {
    super({
      status: 422,
      code: 'USER_CREATION_FAILED',
      message,
    });
    this.name = 'UserCreateFailedError';
  }
}

export class UserUpdateFailedError extends ApiError {
  constructor(message = 'Failed to update user') {
    super({
      status: 422,
      code: 'USER_UPDATE_FAILED',
      message,
    });
    this.name = 'UserUpdateFailedError';
  }
}

export class UserDeleteFailedError extends ApiError {
  constructor(message = 'Failed to delete user') {
    super({
      status: 422,
      code: 'USER_DELETE_FAILED',
      message,
    });
    this.name = 'UserDeleteFailedError';
  }
}
