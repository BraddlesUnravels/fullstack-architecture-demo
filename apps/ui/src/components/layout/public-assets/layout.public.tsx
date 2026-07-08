import { component$, Slot } from '@builder.io/qwik';
import { Shell } from '../shell';

export default component$(() => (
  <Shell>
    <div id="public-container" class="flex-1 h-full justify-items-center">
      <Slot />
    </div>
  </Shell>
));
