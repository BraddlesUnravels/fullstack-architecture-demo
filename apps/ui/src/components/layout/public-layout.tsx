import { component$, Slot } from '@builder.io/qwik';
import { Shell } from './shell';

export default component$(() => (
  <Shell>
    <div id="public-container" class="flex-1 h-full justify-items-center">
      <div
        id="public-content"
        class="min-w-xs max-w-sm h-full sm:max-w-2/3 md:max-w-2/3 lg:max-w-1/2 xl:max-w-2/3"
      >
        <Slot />
      </div>
    </div>
  </Shell>
));
