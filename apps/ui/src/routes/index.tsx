import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { loadHomeData } from '../lib/home-loader';

export const useHomeData = routeLoader$(async () => loadHomeData());

export default component$(() => {
  const { value } = useHomeData();

  return (
    <main>
      <h1>Job application tracker</h1>
      <p>Users first name: {value.firstName}</p>
      <p>Users last name: {value.lastName}</p>

      {JSON.stringify(value, null, 2)}
    </main>
  );
});
