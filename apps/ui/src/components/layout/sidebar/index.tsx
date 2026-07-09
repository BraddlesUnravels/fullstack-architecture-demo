import { component$, Slot } from '@builder.io/qwik';
import Aside from './draw-aside';
import PrimaryNav from './primary-nav';
import SecondaryNav from './secondary-nav';

export default component$(() => {
  return (
    <div id="protected-layout" class="drawer h-dvh w-full overflow-hidden lg:drawer-open">
      <input id="protected-sidebar" type="checkbox" class="drawer-toggle hidden" />

      <div class="drawer-content h-dvh min-w-0 overflow-hidden">
        <main class="h-dvh min-w-0 overflow-hidden">
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
