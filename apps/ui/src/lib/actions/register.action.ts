import { api } from '../api/api';
import {
  mapApiError,
  normalizeError,
  transportProblem,
  validateInput,
  validationProblem,
} from '../errors';
import { logError } from '../logger/runtime';
import { register } from '@app/schemas';
import type { Register } from '@app/types';
import type { JSONObject, RequestEventAction } from '@builder.io/qwik-city';
import type { ActionFailure, ActionFieldErrors, UiProblem } from '../types';

const submitRegistration = (input: Register) => api().auth.put(input);

type RegistrationApiResult = Awaited<ReturnType<typeof submitRegistration>>;

const createActionFailure = (
  problem: UiProblem,
  fieldErrors: ActionFieldErrors<Register>,
  formErrors: string[] = [],
): ActionFailure<Register> => ({
  problem,
  fieldErrors,
  formErrors,
});

export const registerAction = async (
  form: JSONObject,
  event: RequestEventAction,
) => {
  const validation = validateInput(register, form);

  if (!validation.success) {
    const problem = validationProblem();
    return event.fail(
      problem.status,
      createActionFailure(
        problem,
        validation.fieldErrors,
        validation.formErrors,
      ),
    );
  }

  let result: RegistrationApiResult | undefined;

  try {
    result = await submitRegistration(validation.data);
  } catch (error) {
    logError(normalizeError(error), {
      action: 'registerAction',
      category: 'transport',
    });

    const problem = transportProblem();

    return event.fail(
      problem.status,
      createActionFailure(problem, { api: problem.message }),
    );
  }

  // Defensive fallback for an unexpected empty client result.
  if (result === undefined) {
    const problem = mapApiError({
      status: 500,
      value: undefined,
    });

    return event.fail(
      problem.status,
      createActionFailure(problem, {
        api: problem.message,
      }),
    );
  }

  if (result.error) {
    const problem = mapApiError(result.error);

    return event.fail(
      problem.status,
      createActionFailure(problem, {
        api: problem.message,
      }),
    );
  }

  return {
    success: true,
    ...result.data,
  };
};
