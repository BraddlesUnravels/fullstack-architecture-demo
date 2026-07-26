import * as v from 'valibot';
import type { ValidationResult, UiProblem } from '../types';

export const validateInput = <TSchema extends v.GenericSchema>(
  schema: TSchema,
  input: unknown,
): ValidationResult<v.InferOutput<TSchema>> => {
  const result = v.safeParse(schema, input);
  if (result.success)
    return {
      success: true,
      data: result.output,
    };

  const flattened = v.flatten(result.issues);

  const fieldErrors = Object.fromEntries(
    Object.entries(flattened.nested ?? {}).map(([path, messages]) => [
      path,
      messages?.[0] ?? 'Invalid value',
    ]),
  );

  return {
    success: false,
    fieldErrors,
    formErrors: [...(flattened.root ?? []), ...(flattened.other ?? [])],
  };
};

export const validationProblem = (): UiProblem => ({
  code: 'VALIDATION_ERROR',
  kind: 'validation',
  status: 422,
  title: 'Check the highlighted fields',
  message: 'The request could not be processed due to validation errors.',
  retryable: false,
});

export const transportProblem = (): UiProblem => ({
  code: 'API_UNREACHABLE',
  kind: 'unavailable',
  status: 503,
  title: 'Unable to reach the server',
  message:
    'Check your connection and try again. The service may be temporarily unavailable.',
  retryable: true,
});
