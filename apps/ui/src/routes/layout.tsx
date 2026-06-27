import { component$, Slot } from '@builder.io/qwik';
import PublicLayout from '../components/layout/public-layout';

export default component$(() => {
  return (
    <PublicLayout>
      <Slot />
    </PublicLayout>
  );
});
