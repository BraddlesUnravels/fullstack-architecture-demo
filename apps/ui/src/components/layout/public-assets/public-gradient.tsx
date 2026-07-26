import { component$ } from '@builder.io/qwik';

export default component$(() => (
  <div class="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_32rem),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.25),transparent_28rem),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.18),transparent_30rem)]"
    />

    {/* Grid overlay */}
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-size[48px_48px] [mask-radial-gradient(ellipse_at_center,black,transparent_75%)]"
    />

    {/* Blurred glow */}
    <div
      aria-hidden="true"
      class="absolute -left-32 top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
    />
    <div
      aria-hidden="true"
      class="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"
    />
  </div>
));
