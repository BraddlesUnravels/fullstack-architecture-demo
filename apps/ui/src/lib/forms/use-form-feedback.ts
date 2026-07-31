import { $, type QRL, useSignal, useTask$ } from '@builder.io/qwik';
import { isRecord } from '../errors/helpers';
import type { ActionFailureResult, FieldErrors, UiProblem } from '../types';

type FieldName<TFields> = Extract<keyof TFields, string>;

export type ActionFormState = Readonly<{
  value: unknown;
  isRunning: boolean;
}>;

export type ActionFormFeedback<TFields> = {
  problem?: UiProblem;
  fieldErrors: FieldErrors<TFields>;
  apiError?: string;
  formErrors: readonly string[];
  hasGeneralError: boolean;
  onFieldInput$: QRL<(event: InputEvent) => void>;
};

const isActionFailureResult = <TFields>(
  value: unknown,
): value is ActionFailureResult<TFields> => {
  if (!isRecord(value) || value.failed !== true) {
    return false;
  }

  if (!isRecord(value.problem) || !isRecord(value.fieldErrors)) {
    return false;
  }

  return (
    Array.isArray(value.formErrors) &&
    value.formErrors.every((message) => typeof message === 'string')
  );
};

const getVisibleFieldErrors = <TFields>(
  failure: ActionFailureResult<TFields> | undefined,
  editedFields: readonly string[],
): FieldErrors<TFields> => {
  if (!failure) {
    return {};
  }

  const entries = Object.entries(failure.fieldErrors).filter(
    ([field, message]) =>
      field !== 'api' &&
      typeof message === 'string' &&
      !editedFields.includes(field),
  );

  /*
   * The assertion is confined to the dynamic Object.entries/
   * Object.fromEntries boundary.
   *
   * Runtime keys originate from the typed ActionFieldErrors<TFields>
   * object, with the special `api` key removed.
   */
  return Object.fromEntries(entries) as FieldErrors<TFields>;
};

export const useActionFormFeedback = <TFields>(
  state: ActionFormState,
): ActionFormFeedback<TFields> => {
  const editedFields = useSignal<FieldName<TFields>[]>([]);

  useTask$(({ track }) => {
    track(() => state.value);
    track(() => state.isRunning);

    editedFields.value = [];
  });

  const onFieldInput$ = $((event: InputEvent) => {
    const target = event.currentTarget;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const field = target.name as FieldName<TFields>;

    if (field.length === 0 || editedFields.value.includes(field)) {
      return;
    }

    editedFields.value = [...editedFields.value, field];
  });

  const failure =
    !state.isRunning && isActionFailureResult<TFields>(state.value)
      ? state.value
      : undefined;

  const hasEditedField = editedFields.value.length > 0;

  const fieldErrors = getVisibleFieldErrors<TFields>(
    failure,
    editedFields.value,
  );

  const apiError = hasEditedField ? undefined : failure?.fieldErrors.api;

  const formErrors = hasEditedField ? [] : (failure?.formErrors ?? []);

  return {
    problem: failure?.problem,
    fieldErrors,
    apiError,
    formErrors,
    hasGeneralError: apiError !== undefined || formErrors.length > 0,
    onFieldInput$,
  };
};
