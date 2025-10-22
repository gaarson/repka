import { createSource } from 'core';
import { simpleReactProvider } from 'react-provider';
import { repkaHookAndHoc } from 'react-provider/hookAndHok';

export const repka = <T>(obj: T) => createSource<
  T, 
  {main: typeof repkaHookAndHoc, getter: typeof simpleReactProvider}
>(
  obj,
  {main: repkaHookAndHoc, getter: simpleReactProvider}
);

export { watch } from 'watcher';
