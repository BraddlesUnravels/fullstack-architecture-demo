import { component$ } from '@builder.io/qwik';
import Logo from '../../../../assets/StackChatr-Logo.png?jsx';

export default component$(() => (
  <div
    id="logo-container"
    class="flex shrink-0 w-full mt-2 items-center pt-[clamp(0.25rem,1dvh,0.75rem)] lg:justify-center lg:px-0"
  >
    <div class="grid h-[var(--logo-size)] w-[var(--logo-size)] overflow-hidden place-items-center rounded-2xl border border-cyan-300/30 shadow-lg shadow-cyan-400/15 [@media(max-height:680px)]:rounded-xl [@media(max-height:680px)]:text-lg">
      <Logo id="logo-image" alt="Logo" />
    </div>
  </div>
));
