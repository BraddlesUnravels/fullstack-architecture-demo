import { component$, Slot } from '@builder.io/qwik';
import BrandLogo from './sidebar-logo';

const asideClasses = [
  'relative flex h-[calc(100dvh-1rem)] w-80 flex-col overflow-hidden',
  'rounded-[1rem] border border-white/15 bg-white/3',
  'backdrop-blur-2xl lg:m-3',
  'lg:h-[calc(100dvh-1.5rem)] lg:w-[7.5rem] lg:items-center',
  'p-[var(--side-pad)]',
  '[--side-pad:clamp(0.5rem,1.4dvh,1rem)]',
  '[--logo-size:clamp(2.25rem,6dvh,3rem)]',
  '[--nav-gap:clamp(0.25rem,1dvh,0.75rem)]',
  '[--nav-item:clamp(2.25rem,7dvh,4.25rem)]',
  '[--nav-icon:clamp(1.45rem,4dvh,2.25rem)]',
  '[--collapse-size:clamp(2rem,5dvh,2.5rem)]',
].join(' ');

export default component$(() => (
  <div id="aside-wrapper" class="drawer-side z-40 h-dvh overflow-hidden">
    <aside class={asideClasses}>
      {/* Gradient borders right/left */}
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-3 right-0 w-px bg-linear-to-b from-transparent via-green-300/60 to-transparent"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-3 left-0 w-px bg-linear-to-b from-transparent via-green-300/60 to-transparent"
      />

      <BrandLogo />
      <div class="flex min-h-0 flex-1 w-full flex-col justify-between pt-[clamp(0.75rem,3dvh,2.5rem)]">
        <Slot />
      </div>
    </aside>
  </div>
));
