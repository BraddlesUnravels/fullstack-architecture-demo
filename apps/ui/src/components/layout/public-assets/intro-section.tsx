import { component$ } from '@builder.io/qwik';
import { ProjectScope } from '../public-assets';

export default component$(() => (
  <section
    id="intro-section"
    class="display flex-row w-full justify-items-center"
  >
    <div id="inner-wrap">
      <h1 class="text-4xl font-bold tracking-tight text-white">
        Full-Stack Architecture Demo
      </h1>

      <p class="mt-5 text-lg leading-8 text-slate-300">
        A focused demo showing auth flows, API boundaries, relational modelling,
        seeded data, shared contracts, and testable full-stack structure.
      </p>

      <div id="cards" class="mt-8 grid grid-cols-4 gap-3">
        <div class="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
          <p class="text-sm text-slate-400">Auth</p>
          <p class="mt-1 font-semibold text-white">Protected routes</p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
          <p class="text-sm text-slate-400">Redis</p>
          <p class="mt-1 font-semibold text-white">Session Management</p>
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

      <ProjectScope />
    </div>
  </section>
));
