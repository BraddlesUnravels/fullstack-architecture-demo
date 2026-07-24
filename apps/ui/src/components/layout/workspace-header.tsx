import { component$, type QRL } from '@builder.io/qwik';
import { InSearch } from '@qwikest/icons/iconoir';
import { FormField, TextInput, Button } from '../ui';

type HeaderProps = {
  name: string;
  onAddApplication$: QRL<() => void>;
  onSearchApplication$: QRL<(v: InputEvent) => void>;
};

export default component$<HeaderProps>(
  ({ name, onAddApplication$, onSearchApplication$ }) => (
    <header
      id="workspace-header"
      class="flex flex-col gap-3 min-w-full h-auto lg:flex-row lg:items-start lg:justify-between"
    >
      <div class="min-w-0">
        <p class="text-sm text-slate-300/80">
          Welcome back{name ? `, ${name} 👋` : ' 👋'}
        </p>

        <h1 class="mt-8 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
          Application Workspace
        </h1>

        <p class="mt-3 max-w-2xl text-base text-slate-300">
          Track, organize, and manage your job search in one place.
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <FormField class="w-full sm:w-72">
          <TextInput
            id="header-search"
            name="header-search"
            type="search"
            placeholder="Search applications..."
            icon={<InSearch font-size="1.5rem" />}
            iconPosition="start"
            iconClass="pt-2.3 pb-1.7 px-2 py-2 text-slate-400"
            returnInput$={onSearchApplication$}
          />
        </FormField>
        <div class="w-full sm:w-48">
          <Button onClick$={onAddApplication$}>+ Add Application</Button>
        </div>
      </div>
    </header>
  ),
);
