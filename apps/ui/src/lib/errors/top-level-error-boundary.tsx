import {
  $,
  Slot,
  component$,
  useErrorBoundary,
  useStore,
  useTask$,
} from '@builder.io/qwik';
import { BordedCard } from '../../components/ui';
import { logError } from '../logger';
import type { RuntimeError } from '../types';
import { pushUiError, useErrorStore } from './error-store';
import { mapRuntimeErrorToUi } from './map-runtime-error';
import { normalizeError } from './normalize-error';

type TopLevelErrorBoundaryProps = {
  boundaryName?: string;
};

type LocalErrorState = {
  lastErrorId: string;
  lastHandledKey: string;
};

const createErrorKey = (error: RuntimeError): string =>
  [error.name, error.message, error.code ?? '', error.stack ?? ''].join(':');

const getReference = (value: unknown): string | undefined => {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }

  return undefined;
};

export const TopLevelErrorBoundary = component$<TopLevelErrorBoundaryProps>(
  ({ boundaryName }) => {
    const errorBoundary = useErrorBoundary();
    const errorStore = useErrorStore();

    const local = useStore<LocalErrorState>({
      lastErrorId: '',
      lastHandledKey: '',
    });

    useTask$(({ track }) => {
      const error = track((): unknown => errorBoundary.error as unknown);

      const runtimeError = normalizeError(error);
      const errorKey = createErrorKey(runtimeError);

      if (errorKey === local.lastHandledKey) return;

      const uiError = mapRuntimeErrorToUi(runtimeError);

      logError(runtimeError, {
        boundary: boundaryName ?? 'TopLevelErrorBoundary',
      });

      local.lastErrorId = uiError.id;
      local.lastHandledKey = errorKey;

      pushUiError(errorStore, uiError);
    });

    const activeError = errorStore.errors.find(
      (error) => error.id === local.lastErrorId,
    );

    const reference = getReference(activeError?.metadata?.reference);

    const onReload$ = $(() => {
      window.location.reload();
    });

    const onCopyReference$ = $(async () => {
      if (!reference || !navigator.clipboard) return;

      try {
        await navigator.clipboard.writeText(reference);
      } catch {
        // Clipboard access can be unavailable or denied.
      }
    });

    if (errorBoundary.error) {
      return (
        <BordedCard>
          <div role="alert">
            <h2>{activeError?.title ?? 'Something went wrong'}</h2>

            <p>
              {activeError?.message ??
                'An unexpected error occurred. Please reload the page and try again.'}
            </p>

            {reference && (
              <p>
                Reference: <code>{reference}</code>
              </p>
            )}

            <div>
              <button type="button" onClick$={onReload$}>
                Reload page
              </button>

              {reference && (
                <button type="button" onClick$={onCopyReference$}>
                  Copy reference
                </button>
              )}
            </div>
          </div>
        </BordedCard>
      );
    }

    return <Slot />;
  },
);
