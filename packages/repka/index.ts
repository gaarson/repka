import { createSource } from 'core';
import { simpleReactProvider } from 'react-provider';
import { repkaHookAndHoc } from 'react-provider/hookAndHok';
import React from 'react';

interface IRepkaCallable<T> {
  <P extends {}>(Component: React.ComponentType<P>): React.FC<P>;
  <K extends keyof T>(prop: K): T[K];
}

export type RepkaStore<T> = T & IRepkaCallable<T>;

export const repka = <T extends object>(obj: T): RepkaStore<T> => {
  const store = createSource<
    T,
    { main: typeof repkaHookAndHoc; getter: typeof simpleReactProvider }
  >(obj, { main: repkaHookAndHoc, getter: simpleReactProvider });

  return store as unknown as RepkaStore<T>;
};

export { watch } from 'watcher';
