import { randomUUID } from 'crypto';
import type { AppError, UiError } from '../types';

export const mapErrorToUi = (err: AppError): UiError => {
  switch (err.kind) {
    case 'validation':
      return {
        id: err.code ?? randomUUID(),
        level: 'warning',
        message: err.message,
        metadata: err.metadata,
      };
    case 'auth':
      return {
        id: err.code ?? randomUUID(),
        level: 'error',
        message: 'Authentication required',
        action: { label: 'Sign in', id: 'open-signin' },
      };
    case 'network':
      return {
        id: err.code ?? randomUUID(),
        level: 'error',
        message: 'Network error — check your connection and try again',
        transient: true,
      };
    case 'not-found':
      return {
        id: err.code ?? randomUUID(),
        level: 'warning',
        message: err.message || 'Not found',
      };
    default:
      return {
        id: err.code ?? randomUUID(),
        level: 'error',
        message: 'Something went wrong. Try again or contact support',
        metadata: { reference: err.code },
      };
  }
};
