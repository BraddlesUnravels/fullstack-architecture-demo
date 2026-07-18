import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import AppLayout from '../../components/layout/layout.protected';
import WorkspaceHeader from '../../components/layout/workspace-header';

export const onRequest: RequestHandler = (event) => {
  const sid = event.cookie.get('sid')?.value;

  // TODO: uncomment bottom line when no longer building the protected layouts
  // if (!sid) throw new Error(`/?redirectTo=${encodeURIComponent(event.url.pathname)}`);

  event.sharedMap.set('sid', sid);
};

export default component$(() => {
  return (
    <AppLayout>
      <section
        id="inner-content-wrapper"
        class="relative flex h-full min-h-0 w-full flex-col overflow-hidden"
      >
        <WorkspaceHeader
          name="Placeholder"
          onAddApplication$={() => console.log('Add Application')}
          onSearchApplication$={(v) => console.log('searching', v)}
        />

        <div class="mt-4 min-h-0 min-w-0 flex-1 overflow-y-auto">
          <Slot />
        </div>
      </section>
    </AppLayout>
  );
});
