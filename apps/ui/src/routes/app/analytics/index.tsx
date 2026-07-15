import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <section class="grid h-full min-h-0 min-w-0 gap-6 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <main class="min-w-0 lg:min-h-0 lg:overflow-hidden">
        <div class="flex min-w-0 flex-col gap-6 lg:h-full lg:min-h-0">
          {/* Stats grid placeholder */}
          <section class="grid shrink-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div class="h-36 rounded-[1rem] border border-white/10 bg-white/[0.04]" />
            <div class="h-36 rounded-[1rem] border border-white/10 bg-white/[0.04]" />
            <div class="h-36 rounded-[1rem] border border-white/10 bg-white/[0.04]" />
            <div class="h-36 rounded-[1rem] border border-white/10 bg-white/[0.04]" />
          </section>

          {/* Table/card placeholder */}
          <section class="h-80 rounded-[1rem] border border-white/10 bg-white/[0.04] lg:min-h-0 lg:flex-1" />
        </div>
      </main>

      {/* Right hand rail */}
      <aside class="min-w-0 lg:min-h-0 lg:overflow-hidden">
        {/* placholders */}
        <div class="flex min-w-0 flex-col gap-5 lg:h-full lg:min-h-0">
          <section class="h-60 shrink-0 rounded-[1rem] border border-white/10 bg-white/[0.04]" />
          <section class="h-52 shrink-0 rounded-[1rem] border border-white/10 bg-white/[0.04]" />
          <section class="min-h-40 flex-1 rounded-[1rem] border border-white/10 bg-white/[0.04]" />
        </div>
      </aside>
    </section>
  );
});
