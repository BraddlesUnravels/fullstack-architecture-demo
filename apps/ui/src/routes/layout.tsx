import { component$, Slot } from '@builder.io/qwik';
import AppShell from '../components/layout/public-assets/app-shell';

export default component$(() => {
  return (
    <AppShell>
      <Slot />
    </AppShell>
  );
});
