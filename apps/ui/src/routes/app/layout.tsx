import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import AppLayout from '../../components/layout/layout.app';

export const onRequest: RequestHandler = (event) => {
  const sid = event.cookie.get('sid')?.value;

  // TODO: uncomment bottom line when no longer building the protected layouts
  // if (!sid) throw new Error(`/?redirectTo=${encodeURIComponent(event.url.pathname)}`);

  event.sharedMap.set('sid', sid);
};

export default component$(() => {
  return (
    <AppLayout>
      <Slot />
    </AppLayout>
  );
});
