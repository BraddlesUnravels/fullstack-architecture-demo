import { component$, Slot } from '@builder.io/qwik';

// TODO - Set light and dark backgrounds
export const Shell = component$(() => (
  <main id="app-shell" class="relative h-dvh w-full overflow-hidden text-base-content">
    <div class="h-full w-full overflow-y-auto overflow-x-hidden sm:0.5rem md:1-rem lg:1.5rem">
      <Slot />
    </div>
  </main>
));
