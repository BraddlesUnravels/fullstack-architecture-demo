import { component$, Slot } from '@builder.io/qwik';
import PublicGradient from './public-gradient';

interface PublicLayoutProps {
  gradient?: boolean;
  colClasses?: string;
}

export default component$<PublicLayoutProps>(({ gradient, colClasses }) => (
  <div
    id="public-layout"
    class={[
      'grid min-h-full min-w-full overflow-hidden bg-[#101923] text-slate-100',
      colClasses,
    ].join(' ')}
  >
    <Slot />

    {/* 
      Gradient background needs to be hinded on the 
      login/registration pages to allow for the side draw look 
    */}
    {gradient && <PublicGradient />}
  </div>
));
