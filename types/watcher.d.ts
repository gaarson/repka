import { providerType, watcherObjType, ICallable, ISource } from './callable';
export declare type baseSourceObjType<T> = {
    [key: string]: T;
};
export declare type specialKeyLiteralType = "__PROVIDER_ID__";
export declare type proxyHandlerType<T> = {
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
    sourceObj: T & ISource<T>;
    SPECIAL_KEY: specialKeyLiteralType;
    init(initObj: watcherObjType<T>, provider?: providerType, methods?: M): void;
    get(propertyName: keyof T): T[keyof T];
    set(propertyName: keyof T, value: T[keyof T]): void;
    watch(fieldName: string): Promise<T>;
    watchFor(fieldName: string, neededValue: unknown): Promise<T>;
}
export declare class Watcher<T = {
    [key: string]: unknown;
}, M = undefined> implements IWatcher<T, M> {
    sourceObj: T & ISource<T>;
    SPECIAL_KEY: specialKeyLiteralType;
    init(initObj: watcherObjType<T>, provider?: providerType, methods?: M): void;
    set(propertyName: keyof T, value: T[keyof T]): void;
    get(propertyName: keyof T): T[keyof T];
    watch(propertyName: string): Promise<T>;
    watchFor(propertyName: string, neededValue: T): Promise<T>;
}
export declare type watcherCreatorType = <T, M>(obj: watcherObjType<T>, provider?: providerType, methods?: M) => Watcher<T, M>;
export declare const watcherCreator: <T, M>(obj: watcherObjType<T>, provider?: providerType, methods?: M) => Watcher<T, M>;
