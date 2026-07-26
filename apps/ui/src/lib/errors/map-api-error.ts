// import * as v from 'valibot';
// import { validateInput } from './validation';
import { ErrorDefaults } from '@app/constants';
import type {
  UiProblemKind,
  // EdenError,
  // UiProblem,
  FailureStatus,
} from '../types';
// import type { ApiErrorStatus, ApiErrorCodes } from '../types/api-error-code';
// import { apiErrorResponseSchema } from '@app/schemas';

const isFailureStatus = (status: number): status is FailureStatus =>
  Object.hasOwn(ErrorDefaults, status);

export const normaliseStatus = (status: number): FailureStatus =>
  isFailureStatus(status) ? status : 500;

export const kindFromStatus = (status: FailureStatus): UiProblemKind => {
  switch (status) {
    case 400:
    case 422:
      return 'validation';
    case 404:
    case 410:
      return 'not-found';
    case 429:
    case 502:
    case 503:
    case 504:
      return 'unavailable';
    case 401:
      return 'unauthenticated';
    case 403:
      return 'forbidden';
    case 409:
      return 'conflict';
    default:
      return 'unexpected';
  }
};

// const defaultUiProblem = (status: FailureStatus): Omit<UiProblem, 'status', 'kind'> => {
//   const defaults = ErrorDefaults[status]

//   switch
// }

// export const mapApiError = (error: EdenError, response: Response): UiProblem => {
//   const status = normaliseStatus(response.status);
//   const kind = kindFromStatus(status);
//   const fallBack = ErrorDefaults[status as ApiErrorStatus] ?? ErrorDefaults[500];
// }
