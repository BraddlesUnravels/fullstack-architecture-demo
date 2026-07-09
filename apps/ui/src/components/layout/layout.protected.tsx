import { component$ } from '@builder.io/qwik';
import { Shell } from './shell';
import BackgroundGradient from './bg-gradient';
import SideBarMenu from './sidebar';

export default component$(() => (
  <Shell>
    <div id="protected-layout" class="flex-1 h-full justify-items-center">
      <BackgroundGradient>
        <SideBarMenu />
      </BackgroundGradient>
    </div>
  </Shell>
));
