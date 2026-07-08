import { component$ } from '@builder.io/qwik';

export default component$(() => (
  <div id="project-scope" class="rounded-2xl border border-white/10 bg-white/4 p-4 mt-5">
    <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Demo scope</p>
    <p class="mt-2 text-sm leading-6 text-slate-400">
      Built to demonstrate production-style auth, API structure, database modelling, seed workflows,
      and testing.
    </p>
  </div>
));
