import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { loadName } from '../../lib/loaders/header-name-loader';
import AppLayout from '../../components/layout/layout.protected';
import WorkspaceHeader from '../../components/layout/workspace-header';

const useNameLoader = routeLoader$(async (event) => {
  const sid = event.cookie.get('sid')?.value;
  return await loadName(sid);
});

export default component$(() => {
  const loaded = useNameLoader();
  return (
    <AppLayout>
      <section
        id="inner-content-wrapper"
        class="relative flex h-full min-h-0 w-full flex-col overflow-hidden"
      >
        <WorkspaceHeader
          name={loaded.value?.name ?? ''}
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
