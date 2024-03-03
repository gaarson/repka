import { providerType } from 'core';
export type baseSourceObjType<T> = {
    [key: string]: T;
};
export type specialKeyLiteralType = "__PROVIDER_ID__";
export type proxyHandlerType<T> = {
    set: (obj: T & {
        onUpdate: ((...args: any) => void)[];
    }, prop: string, value: T) => boolean;
    get?: (obj: T & {
        onUpdate: ((...args: any) => void)[];
    }, prop: string) => unknown;
};
export interface IWatcher<T = {
    [key: string]: unknown;
}, M = undefined> {
    sourceObj: T & providerType<T, M>;
    SPECIAL_KEY: specialKeyLiteralType;
    broadcast: any;
    init(initObj: T, options: {
        provider?: providerType;
        methods?: M;
        broadcastName?: string;
    }): void;
    set(propertyName: keyof (T), value: (T & providerType<T, M>)[keyof (T)], ignoreBroadcast?: boolean): void;
    get(propertyName?: keyof (T)): (T)[keyof T] | T;
    createBroadcast(broadcastName: string): void;
    watch(fieldName: string): Promise<T>;
    watchFor(fieldName: string, neededValue: unknown): Promise<T>;
}
export type watcherCreatorType = <T, M>(obj: T, provider?: providerType, methods?: M, broadcastName?: string) => Watcher<T, M>;
export declare class Watcher<T = {
    [key: string]: unknown;
}, M = undefined> implements IWatcher<T, M> {
    private keys;
    sourceObj: T & providerType<T, M>;
    SPECIAL_KEY: specialKeyLiteralType;
    broadcast: any;
    init(initObj: T, options?: {
        provider?: providerType;
        methods?: M;
        broadcastName?: string;
    }): void;
    createBroadcast(broadcastName?: string): void;
    set(propertyName: keyof (T), value: (T & providerType<T, M>)[keyof (T)], ignoreBroadcast?: boolean): void;
    get(propertyName?: keyof (T)): (T)[keyof T] | T;
    watch(propertyName: string): Promise<T>;
    watchFor(propertyName: string, neededValue: T): Promise<T>;
}
export declare const watcherCreator: <T, M>(obj: T, provider?: providerType, methods?: M, broadcastName?: string) => Watcher<T, M>;
