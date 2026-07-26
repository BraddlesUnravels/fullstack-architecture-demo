import { component$ } from '@builder.io/qwik';
import { PublicLayout } from '../components/layout/public-assets';

export default component$(() => (
  <PublicLayout gradient>
    <section class="flex flex-col items-center justify-center">
      <h1 class="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
      <p class="mt-4 text-lg text-gray-300">
        The page you are looking for does not exist.
      </p>
    </section>
  </PublicLayout>
));
