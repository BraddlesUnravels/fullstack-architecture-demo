import { component$ } from '@builder.io/qwik';
import type { UiProblem } from '../../lib/types';

type FormErrorSummaryProps = {
  name: string;
  problem?: UiProblem;
  apiError?: string;
  formErrors?: readonly string[];
};

export const FormErrorSummary = component$<FormErrorSummaryProps>(
  ({ name, problem, apiError, formErrors = [] }) => {
    const hasErrors = apiError !== undefined || formErrors.length > 0;

    if (!problem || !hasErrors) {
      return null;
    }

    const titleId = `${name}-title`;

    return (
      <div
        id={name}
        role="alert"
        aria-atomic="true"
        aria-labelledby={titleId}
        class="rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
      >
        <h3 id={titleId} class="font-semibold">
          {problem.title}
        </h3>

        {apiError && <p class="mt-1">{apiError}</p>}

        {formErrors.length > 0 && (
          <ul class="mt-1 list-disc space-y-1 pl-5">
            {formErrors.map((message, index) => (
              <li key={`${index}-${message}`}>{message}</li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
