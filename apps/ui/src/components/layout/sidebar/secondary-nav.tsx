import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import type { NavItem } from 'src/lib';
import { InSettings, InProfileCircle } from '@qwikest/icons/iconoir';

const secondaryNav: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: InSettings },
  { label: 'Profile', href: '/profile', icon: InProfileCircle },
];

export default component$(() => {
  const location = useLocation();

  const isActive = (href: string) =>
    location.url.pathname === href ||
    location.url.pathname.startsWith(`${href}/`);

  return (
    <div class="w-full shrink-0 mb-2">
      <div class="mx-auto mb-[var(--nav-gap)] h-px w-16 bg-white/10 lg:w-14" />

      <ul class="flex flex-col gap-[var(--nav-gap)]">
        {secondaryNav.map((item) => {
          const active = isActive(item.href);

          return (
            <li key={item.href}>
              <a
                href={item.href}
                class={[
                  'group relative flex h-[var(--nav-item)] items-center gap-3 rounded-2xl px-4 text-sm transition',
                  'lg:flex-col lg:justify-center lg:gap-1.5 lg:px-2',
                  '[@media(max-height:680px)]:rounded-xl',
                  active
                    ? 'bg-cyan-400/10 text-cyan-300'
                    : 'text-slate-300 hover:bg-white/[0.06] hover:text-cyan-200',
                ]}
              >
                {active && (
                  <span class="absolute -left-[var(--side-pad)] top-1/2 h-[calc(var(--nav-item)*0.85)] w-1 -translate-y-1/2 rounded-r-full bg-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.85)]" />
                )}

                <span
                  class={[
                    'grid py-0 h-[var(--nav-icon)] w-[var(--nav-icon)] shrink-0 place-items-center text-lg transition',
                    active
                      ? 'text-cyan-300'
                      : 'text-slate-300 group-hover:text-cyan-200',
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
    </div>
  );
});
