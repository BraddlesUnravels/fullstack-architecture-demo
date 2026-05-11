import { render, type RenderOptions } from '@builder.io/qwik';
import Root from './root';

export default (opts: RenderOptions) => {
  return render(document, <Root />, opts);
};
