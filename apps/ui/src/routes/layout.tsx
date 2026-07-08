import { component$, Slot } from '@builder.io/qwik';
import PublicLayout from '../components/layout/public-assets/layout.public';

export default component$(() => {
  return (
    <PublicLayout>
      <Slot />
    </PublicLayout>
  );
});
