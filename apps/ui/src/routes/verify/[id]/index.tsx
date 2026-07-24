import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { verifyRegistrationToken } from '../../../lib/loaders';

export const useVerificationLoader = routeLoader$(verifyRegistrationToken);

export default component$(() => {
  useVerificationLoader();

  return (
    <main class="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4 py-10">
      <section class="w-full rounded-2xl border border-white/10 bg-[#16232d] p-6 text-slate-100 shadow-2xl shadow-black/30 md:p-8">
        <h1 class="text-2xl font-semibold text-white">Verifying your email…</h1>
      </section>
    </main>
  );
});
