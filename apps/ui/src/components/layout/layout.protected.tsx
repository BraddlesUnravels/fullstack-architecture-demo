import { component$, Slot } from '@builder.io/qwik';
import { Shell } from './shell';
import BackgroundGradient from './bg-gradient';
import SideBarMenu from './sidebar';

const contentBaseClasses = [
  'relative isolate m-2 flex h-[calc(100dvh-1rem)] min-w-0 flex-1 z-10 overflow-hidden',
  'rounded-[1rem] backdrop-blur-md',
  'shadow-2xl shadow-black/30',
  'lg:my-3 lg:mr-3 lg:ml-0 lg:h-[calc(100dvh-1.5rem)]',

  /**
   * Page spacing
   */
  'p-[var(--page-pad)]',
  '[--page-pad:clamp(1rem,2.2vw,2rem)]',
  '[--page-gap:clamp(1rem,1.8vw,1.5rem)]',

  /**
   * Gradient border only, not background
   */
  "after:content-['']",
  'after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:p-px',
  'after:bg-linear-to-br after:from-cyan-300/8 after:via-white/3 after:to-green-300/8',
].join(' ');

export default component$(() => (
  <Shell>
    <div id="protected-layout" class="flex-1 h-full justify-items-center">
      <BackgroundGradient>
        <SideBarMenu>
          <section id="content-base" class={contentBaseClasses}>
            <Slot />
          </section>
        </SideBarMenu>
      </BackgroundGradient>
    </div>
  </Shell>
));
