import { component$, Slot } from '@builder.io/qwik';
import BackgroundGradient from './bg-gradient';
import SideBarMenu from './sidebar';

const contentBaseClasses = [
  'relative isolate z-10 m-2 flex h-[calc(100dvh-1rem)] min-w-0 flex-1 overflow-hidden',
  'rounded-[1rem] border border-white/15 bg-white/3 backdrop-blur-2xl',
  /**
   * Desktop outer spacing
   */
  'lg:my-3 lg:mr-3 lg:ml-0 lg:h-[calc(100dvh-1.5rem)]',
  /**
   * Inner page spacing
   */
  'p-[var(--page-pad)]',
  '[--page-pad:clamp(0.75rem,1.4vw,1.25rem)]',
].join(' ');

export default component$(() => (
  <div id="protected-layout" class="h-full w-full">
    <BackgroundGradient>
      <SideBarMenu>
        <section id="content-base" class={contentBaseClasses}>
          {/* Gradient borders right/left */}

          <div
            id="border-highlight-right"
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-3 right-0 w-px bg-linear-to-b from-transparent via-green-300/60 to-transparent"
          />
          <div
            id="border-highlight-left"
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-3 left-0 w-px bg-linear-to-b from-transparent via-green-300/60 to-transparent"
          />

          <div id="base-gradients" class="pointer-events-none absolute inset-0">
            <div class="absolute left-0 top-0 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" />
            <div class="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/15 blur-3xl" />
            <div class="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-cyan-400/[0.04]" />
          </div>

          <div id="inner-content" class="relative z-10 min-h-0 min-w-0 flex-1">
            <Slot />
          </div>
        </section>
      </SideBarMenu>
    </BackgroundGradient>
  </div>
));
