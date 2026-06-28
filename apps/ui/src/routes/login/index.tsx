import { component$ } from '@builder.io/qwik';
import { BgGradient } from './bg-gradient';
import { ProjectIntro } from './intro-section';
import { LoginCard } from './login-card';

export default component$(() => {
  return (
    <div class="flex-1">
      <BgGradient />

      <ProjectIntro />

      <LoginCard />
    </div>
  );
});
