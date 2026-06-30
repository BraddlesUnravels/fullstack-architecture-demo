import { component$ } from '@builder.io/qwik';

export const ProjectIntro = component$(() => (
  <section id="into-section" class="display flex-row z-10 w-full max-h-1/2 justify-items-center">
    <div id="inner-wrap">
      <h1 class="text-4xl font-bold tracking-tight text-white">
        Track applications with a production-style architecture.
      </h1>

      <p class="mt-5 max-w-lg text-lg leading-8 text-slate-300">
        A focused demo showing auth flows, API boundaries, relational modelling, seeded data, shared
        contracts, and testable full-stack structure.
      </p>

      <div id="cards" class="mt-8 grid max-w-xl grid-cols-3 gap-3">
        <div class="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
          <p class="text-sm text-slate-400">Auth</p>
          <p class="mt-1 font-semibold text-white">Protected routes</p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
          <p class="text-sm text-slate-400">API</p>
          <p class="mt-1 font-semibold text-white">Clean boundaries</p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
          <p class="text-sm text-slate-400">Data</p>
          <p class="mt-1 font-semibold text-white">Seeded DB</p>
        </div>
      </div>
    </div>
  </section>
));
