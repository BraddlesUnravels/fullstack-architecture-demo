import { component$, Slot } from '@builder.io/qwik';
import PublicLayout from '../components/layout/layout.public';

export default component$(() => {
  return (
    <PublicLayout>
      <Slot />
    </PublicLayout>
  );
});
