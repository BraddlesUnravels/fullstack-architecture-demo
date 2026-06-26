import { ApiError } from '../../errors';

export class ApplicationNotFoundError extends ApiError {
  constructor(message = 'Application not found') {
    super({
      status: 404,
      code: 'APPLICATION_NOT_FOUND',
      message,
    });
    this.name = 'ApplicationNotFoundError';
  }
}

export class ApplicationCreateFailedError extends ApiError {
  constructor(message = 'Failed to create application') {
    super({
      status: 422,
      code: 'APPLICATION_CREATION_FAILED',
      message,
    });
    this.name = 'ApplicationCreateFailedError';
  }
}

export class ApplicationUpdateFailedError extends ApiError {
  constructor(message = 'Failed to update application') {
    super({
      status: 422,
      code: 'APPLICATION_UPDATE_FAILED',
      message,
    });
    this.name = 'ApplicationUpdateFailedError';
  }
}

export class ApplicationDeleteFailedError extends ApiError {
  constructor(message = 'Failed to delete application') {
    super({
      status: 422,
      code: 'APPLICATION_DELETE_FAILED',
      message,
    });
    this.name = 'ApplicationDeleteFailedError';
  }
}
