import {
  $,
  Slot,
  component$,
  useErrorBoundary,
  useStore,
  // useTask$,
} from '@builder.io/qwik';
import { useErrorStore, /*pushUiError,*/ removeUiError } from './error-store';
// import { mapErrorToUi } from './map-api-error';
// import { normalizeError } from './errors';
// import { logError } from '../logger/error-logger';
import { BordedCard } from '../../components/ui';

type Props = {
  boundaryName?: string;
  retryCallback?: () => void;
};

export const TopLevelErrorBoundary = component$((props: Props) => {
  const errorBoundary = useErrorBoundary();
  const errorStore = useErrorStore();

  const local = useStore({
    lastErrorId: '',
    lastHandledMessage: '',
  });

  // const handleBoundaryError = $((err: unknown) => {
  //   const appErr = normalizeError(err);

  //   logError(appErr, {
  //     boundary: props.boundaryName ?? 'TopLevelErrorBoundary',
  //   });

  //   const ui = appErr;
  //   ui.transient = false;

  //   local.lastErrorId = ui.id;
  //   local.lastHandledMessage = appErr.message;

  //   pushUiError(errorStore, ui);
  // });

  // useTask$(({ track }) => {
  //   const err = track(() => errorBoundary.error as unknown);

  //   if (!err) return;

  //   const appErr = normalizeError(err);
  //   if (appErr.message === local.lastHandledMessage) return;

  //   handleBoundaryError(err);
  // });

  const onDismiss$ = $(() => {
    if (!local.lastErrorId) return;

    removeUiError(errorStore, local.lastErrorId);
    local.lastErrorId = '';
    local.lastHandledMessage = '';
  });

  const onRetry$ = $(() => {
    if (typeof props.retryCallback !== 'function') return;

    try {
      props.retryCallback();
    } catch {
      // If retry callback throws, boundary will catch on next render cycle
    }
  });

  const onCopyRef$ = $(() => {
    const entry = errorStore.errors.find((e) => e.id === local.lastErrorId);
    const ref = entry?.metadata?.reference ?? entry?.id;
    if (
      typeof ref !== 'string' &&
      typeof ref !== 'number' &&
      typeof ref !== 'bigint'
    )
      return;
    if (!ref) return;

    void navigator.clipboard?.writeText(String(ref));
  });

  if (errorBoundary?.error) {
    return (
      <BordedCard>
        <div role="alert">
          <h2>Something went wrong</h2>
          <p>Please try again.</p>
          <div>
            <button onClick$={onRetry$}>Retry</button>
            <button onClick$={onDismiss$}>Dismiss</button>
            <button onClick$={onCopyRef$}>Copy reference</button>
          </div>
        </div>
      </BordedCard>
    );
  }

  return <Slot />;
});
