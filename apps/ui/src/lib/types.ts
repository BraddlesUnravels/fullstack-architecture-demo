import type { JSXOutput } from '@builder.io/qwik';
import type { IconProps } from '@qwikest/icons';

export type NavItem = {
  label: string;
  href: string;
  icon: (props: IconProps) => JSXOutput;
};
