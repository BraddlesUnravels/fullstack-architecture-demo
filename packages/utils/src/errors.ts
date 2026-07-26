import { ErrorDefaults, type FailureStatus } from '@app/types';

export const isFailureStatus = (status: unknown): status is FailureStatus =>
  typeof status === 'number' &&
  Number.isInteger(status) &&
  Object.hasOwn(ErrorDefaults, status);
