export declare const SPECIAL_KEY = "__PROVIDER_ID__";
export type providerType<T = undefined, M = undefined> = (...args: any[]) => [T, M];
export type closureType = ((...args: string[]) => typeof Function) & {
    __call?: <T>(...args: any) => T;
};
export type watcherObjType<T> = (T & {
    init?: watcherObjType<T> | undefined;
    __onUpdate?: ((...args: unknown[]) => void)[];
});
export type muppetSelectObj<T> = T | {
    [key: string]: unknown;
};
export type muppetType<T> = Record<'get' | '__init__' | '__PROVIDER_ID__' | string, muppetSelectObj<T> | boolean | string | watcherObjType<T> | ((obj: muppetType<T>, prop: string) => muppetType<T>[keyof muppetType<T>]) | {
    [key: string]: unknown;
}>;
export interface Muppet<T> extends muppetType<T> {
    ['__PROVIDER_ID__']?: string;
    __init__: watcherObjType<T> | null;
    get?(obj: muppetType<T>, prop: string): muppetType<T>[keyof muppetType<T>];
}
export interface ICallable<T, M = undefined> extends Function {
    (...args: unknown[]): [T, M];
    muppet: Muppet<T>;
    __onUpdate: ((...args: unknown[]) => void)[];
    __listeners: {
        [key: string]: Map<string, (key?: string, value?: unknown) => void | BroadcastChannel>;
    };
    __call: providerType<T, M>;
}
export declare class Callable extends Function {
    constructor();
}
export interface ISource<T, M = undefined> {
    muppet: Muppet<T>;
    __onUpdate: ((...args: unknown[]) => void)[];
    __listeners: {
        [key: string]: Map<string, (key?: string, value?: unknown) => void | BroadcastChannel>;
    };
    __call: providerType<T, M>;
}
export declare class Source<T = {
    [key: string]: unknown;
}, M = undefined> extends Callable implements ISource<T, M> {
    readonly __call: providerType;
    private readonly __methods;
    __onUpdate: [];
    __listeners: {};
    __criticalFields: {};
    muppet: Muppet<T>;
    constructor(__call: providerType, initObject: watcherObjType<T>, __methods: M, getter: (obj: Muppet<T>, prop: string) => ICallable<T>[keyof ICallable<T>]);
}
export declare const createSource: <T = {
    [key: string]: unknown;
}, M = undefined>(initObj: watcherObjType<T>, provider?: providerType, methods?: M) => ISource<T, M>;
