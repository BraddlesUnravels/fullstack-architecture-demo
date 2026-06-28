import { component$ } from '@builder.io/qwik';

interface ChipProps {
  title: string;
}

export const ChipDotPoint = component$<ChipProps>(({ title }) => (
  <div
    id="demo-card"
    class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 backdrop-blur"
  >
    <span class="h-2 w-2 rounded-full bg-emerald-400" />
    {title}
  </div>
));
