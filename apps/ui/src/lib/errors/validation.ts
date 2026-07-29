import * as v from 'valibot';
import type { ValidationResult, UiProblem, FieldErrors } from '../types';

const firstFieldMessages = <T>(
  nested: Record<string, string[] | undefined> | undefined,
): FieldErrors<T> =>
  Object.fromEntries(
    Object.entries(nested ?? {}).map(([path, messages]) => [
      path,
      messages?.[0] ?? 'Invalid value',
    ]),
  ) as FieldErrors<T>;

export const validateInput = <TSchema extends v.GenericSchema>(
  schema: TSchema,
  input: unknown,
): ValidationResult<v.InferOutput<TSchema>> => {
  // return early if the input is valid
  const result = v.safeParse(schema, input);
  if (result.success)
    return {
      success: true,
      data: result.output,
    };

  const flattened = v.flatten(result.issues);

  return {
    success: false,
    fieldErrors: firstFieldMessages<v.InferOutput<TSchema>>(flattened.nested),
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
  title: 'Service temporarily unavailable',
  message: 'The service is temporarily unavailable. Please try again shortly.',
  retryable: true,
});
