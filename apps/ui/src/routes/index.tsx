import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { PublicLayout, IntroSection } from '../components/layout/public-assets';
import { buttonDefaultStyles } from '../components/ui/button';

export default component$(() => {
  return (
    <PublicLayout gradient colClasses="grid-row-2">
      <header
        id="public-header"
        class="col-span-1 flex flex-row justify-end gap-3 p-3 max-h-[7svh] md:flex-row md:items-start md:justify-between"
      >
        <div class="hidden flex-col items-center justify-center min-w-0 md:flex">
          Welcome to the Full-Stack Demo
        </div>
        <div>
          <Link
            href="/login"
            class={[
              buttonDefaultStyles,
              'text-sm font-semibold px-4 py-2 rounded-lg max-w-[10rem]',
            ]}
          >
            Register or Login
          </Link>
        </div>
      </header>
      <div
        id="public-content"
        class="col-span-1 grid min-h-[calc(100svh-7svh)] items-center"
      >
        <IntroSection />
      </div>
    </PublicLayout>
  );
});
