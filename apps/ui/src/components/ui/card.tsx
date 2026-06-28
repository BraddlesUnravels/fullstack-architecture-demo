import { component$, Slot } from '@builder.io/qwik';

interface CardProps {
  title: string;
  classBg?: string;
  classBody?: string;
  classH1Wrap?: string;
  classH1Typography?: string;
}

export const CardBlur = component$<CardProps>(
  ({ title, classBg, classBody, classH1Wrap, classH1Typography }) => (
    <div class={classBg ?? 'card backdrop-blur-md items-center'}>
      <div class={classBody ?? 'card-body items-start'}>
        <div class={classH1Wrap ?? 'items-center'}>
          <h2 class={classH1Typography ?? 'card-title w-full'}>{title}</h2>
        </div>
        <Slot />
      </div>
    </div>
  ),
);
