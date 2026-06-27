import { component$, Slot } from '@builder.io/qwik';

// TODO - Set light and dark backgrounds
export const Shell = component$(() => (
  <main class="h-dvh w-full overflow-hidden bg-base-100 text-base-content">
    <div class="h-full w-full overflow-y-auto overflow-x-hidden px-4 py-4 sm:0.5rem md:1-rem lg:1.5rem">
      <Slot />
    </div>
  </main>
));
