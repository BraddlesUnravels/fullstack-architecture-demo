import { component$, Slot } from '@builder.io/qwik';
import { Shell } from './shell';

export default component$(() => (
  <Shell>
    <Slot />
  </Shell>
));
