import { component$, useOnDocument, $ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city';
import { RouterHead } from './routes/router-head';
import { ErrorProvider } from './lib/errors/error-store';
import { TopLevelErrorBoundary } from './lib/errors/top-level-error-boundary';
import './theme/global.css';

export default component$(() => {
  // Capture unhandled Javascript execution runtime errors
  useOnDocument(
    'error',
    $((event: ErrorEvent) => {
      console.error('Uncaught error event:', event.error);
      // TODO: Send telemetry or log the error to a logging service
    }),
  );

  // Capture unhandled promise rejections
  useOnDocument(
    'unhandledrejection',
    $((event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // TODO: Send telemetry or log the error to a logging service
    }),
  );

  return (
    <ErrorProvider>
      <TopLevelErrorBoundary>
        <QwikCityProvider>
          <head>
            <meta charset="utf-8" />
            <RouterHead />
          </head>
          <body lang="en">
            <RouterOutlet />
          </body>
        </QwikCityProvider>
      </TopLevelErrorBoundary>
    </ErrorProvider>
  );
});
