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

export const BordedCard = component$(() => (
  <div
    id="card-wrap"
    class="flex min-w-full justify-center"
    aria-label="Please enter your login details in the form below"
  >
    <div
      id="card-background"
      class={[
        'w-full max-w-md rounded-2xl bg-linear-to-b from-transparent',
        'via-green-300/60 to-transparent p-px shadow-2xl shadow-black/30',
      ].join(' ')}
    >
      <div
        id="card-body"
        class="rounded-[calc(1rem-1px)] bg-[#16232d] p-4 backdrop-blur-xl"
      >
        <Slot />
      </div>
    </div>
  </div>
));
