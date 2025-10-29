import React from 'react';
interface IRepkaCallable<T> {
    <P extends {}>(Component: React.ComponentType<P>): React.FC<P>;
    <K extends keyof T>(prop: K): T[K];
}
export type RepkaStore<T> = T & IRepkaCallable<T>;
export declare const repka: <T extends object>(obj: T) => RepkaStore<T>;
export { watch } from 'watcher';
