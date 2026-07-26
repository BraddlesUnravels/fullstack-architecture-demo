import type { RuntimeError, UiError } from '../types';

export const mapRuntimeErrorToUi = (error: RuntimeError): UiError => {
  // Create unique id for the UI error
  const id = globalThis.crypto.randomUUID();
  const reference = error.code ?? id;

  return {
    id,
    level: 'error',
    title: 'Something went wrong',
    message:
      'An unexpected error occurred. Please reload the page and try again.',
    transient: false,
    metadata: {
      reference,
    },
  };
};
