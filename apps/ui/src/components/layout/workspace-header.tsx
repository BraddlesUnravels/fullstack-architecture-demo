import { component$, type QRL } from '@builder.io/qwik';
import { InSearch } from '@qwikest/icons/iconoir';
import { TextInput } from '../ui';

type HeaderProps = {
  name: string;
  onAddApplication$: QRL<() => void>;
  onSearchApplication$: QRL<(v: InputEvent) => void>;
};

export default component$<HeaderProps>(({ name, onAddApplication$, onSearchApplication$ }) => (
  <header
    id="workspace-header"
    class="flex flex-col gap-3 min-w-full h-auto lg:flex-row lg:items-start lg:justify-between"
  >
    <div class="min-w-0">
      <p class="text-sm text-slate-300/80">Welcome back{name ? `, ${name} 👋` : ' 👋'}</p>

      <h1 class="mt-8 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
        Application Workspace
      </h1>

      <p class="mt-3 max-w-2xl text-base text-slate-300">
        Track, organize, and manage your job search in one place.
      </p>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row lg:pt-2">
      <label class="input input-bordered flex h-11 min-w-0 items-center gap-3 border-white/10 bg-white/[0.03] text-slate-200 sm:w-72">
        <span class="text-slate-400">
          <InSearch />
        </span>
        <TextInput
          type="text"
          placeholder="Search applications..."
          returnInput$={onSearchApplication$}
        />
      </label>

      <button
        class="btn h-11 border-0 bg-cyan-400 text-slate-950 hover:bg-cyan-300"
        onClick$={onAddApplication$}
      >
        + Add Application
      </button>
    </div>
  </header>
));
