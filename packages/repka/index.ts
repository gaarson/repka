import { createSource } from 'core';
import { simpleReactProvider } from 'react-provider';

export const repka = <T>(obj: T): ReturnType<typeof createSource> => createSource<
  T, 
  {main: typeof simpleReactProvider, getter: typeof simpleReactProvider}
>(
  obj,
  {main: simpleReactProvider, getter: simpleReactProvider}
);

export { watch } from 'watcher';
