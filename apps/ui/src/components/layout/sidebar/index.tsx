import { component$, Slot } from '@builder.io/qwik';
import Aside from './draw-aside';
import PrimaryNav from './primary-nav';
import SecondaryNav from './secondary-nav';

export default component$(() => {
  return (
    <div id="side-bar-menu" class="drawer h-dvh overflow-hidden lg:drawer-open">
      <input type="checkbox" class="drawer-toggle hidden" />

      <div class="drawer-content h-dvh min-w-0 overflow-hidden">
        <main class="relative z-10 h-full min-h-0 w-full gap-[var(--page-gap)] overflow-hidden">
          <Slot />
        </main>
      </div>

      <Aside>
        <PrimaryNav />
        <SecondaryNav />
      </Aside>
    </div>
  );
});
