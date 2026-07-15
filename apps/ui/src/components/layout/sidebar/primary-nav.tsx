import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import type { NavItem } from '../../../lib';
import {
  InJournalPage,
  In3DBridge,
  InActivity,
  InMultiplePages,
  InCalendar,
} from '@qwikest/icons/iconoir';

const primaryNav: NavItem[] = [
  { label: 'Applications', href: '/app/applications', icon: InMultiplePages },
  { label: 'Pipeline', href: '/app/pipeline', icon: In3DBridge },
  { label: 'Calendar', href: '/app/calendar', icon: InCalendar },
  { label: 'Notes', href: '/app/notes', icon: InJournalPage },
  { label: 'Analytics', href: '/app/analytics', icon: InActivity },
];

export default component$(() => {
  const location = useLocation();

  const isActive = (href: string) =>
    location.url.pathname === href || location.url.pathname.startsWith(`${href}/`);

  return (
    <nav class="w-full shrink-0 items-start">
      <ul class="flex flex-col gap-[var(--nav-gap)]">
        {primaryNav.map((item) => {
          const active = isActive(item.href);

          return (
            <li key={item.href}>
              <a
                href={item.href}
                class={[
                  'group relative flex h-[var(--nav-item)] items-center gap-3 px-4 text-sm transition',
                  'lg:flex-col lg:justify-center lg:gap-1.5 lg:px-2',
                  '[@media(max-height:680px)]:rounded-xl',
                  active
                    ? 'bg-cyan-400/10 text-cyan-300'
                    : 'text-slate-300 hover:bg-white/[0.06] hover:text-cyan-200',
                ]}
              >
                {active && (
                  <span
                    id="active-overlay"
                    class="absolute -left-[var(--side-pad)] top-1/2 h-[calc(var(--nav-item)*0.85)] w-1 -translate-y-1/2 rounded-r-full bg-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.85)]"
                  />
                )}

                <span
                  class={[
                    'grid py-0 h-[var(--nav-icon)] w-[var(--nav-icon)] shrink-0 place-items-center text-lg transition',
                    active ? 'text-cyan-300' : 'text-slate-300 group-hover:text-cyan-200',
                  ]}
                >
                  <item.icon class="h-[var(--nav-icon)] w-[var(--nav-icon)]" />
                </span>

                <span class="nav-label font-medium leading-none lg:text-xs [@media(max-height:720px)]:lg:hidden">
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});
