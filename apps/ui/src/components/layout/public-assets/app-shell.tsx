import { component$, Slot } from '@builder.io/qwik';

export default component$(() => (
  <main id="app-shell" class="relative h-dvh w-full overflow-hidden">
    <Slot />
  </main>
));
