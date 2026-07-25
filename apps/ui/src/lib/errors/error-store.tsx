import {
  component$,
  useStore,
  createContextId,
  useContextProvider,
  useContext,
  Slot,
} from '@builder.io/qwik';
import type { UiError } from '../types';

type StoreShape = {
  errors: UiError[];
};

export const ErrorContext = createContextId<StoreShape>('error-store');

export const ErrorProvider = component$(() => {
  const store = useStore<StoreShape>({
    errors: [],
  });

  useContextProvider(ErrorContext, store);

  return <Slot />;
});

export const useErrorStore = () => useContext(ErrorContext);

export const pushUiError = (store: StoreShape, error: UiError) =>
  store.errors.push(error);

export const removeUiError = (store: StoreShape, id: string) => {
  const idx = store.errors.findIndex((e) => e.id === id);
  if (idx > 0) store.errors.splice(idx, 1);
};
