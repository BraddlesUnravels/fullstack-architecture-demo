import { api } from './api';

const SAMPLE_USER_EMAIL = 'carol@example.com';

export const loadHomeData = async () => {
  const { data, error, response } = await api
    .users({ id: '2ce7a38e-e947-482a-baa6-31b214f7834a' })
    .get();

  console.log('API response:', JSON.stringify({ data, error, response }, null, 2));

  return {
    ...data,
  };
};
