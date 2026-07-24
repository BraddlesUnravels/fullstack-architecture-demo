import { component$, Slot } from '@builder.io/qwik';
import { PublicGradient } from '../../../components/layout/public-assets';

export default component$(() => (
  <main
    id="confirm-registration-layout"
    class="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4 py-10"
  >
    <PublicGradient />
    <Slot />
  </main>
));
