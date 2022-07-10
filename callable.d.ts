export declare const SPECIAL_KEY = "__PROVIDER_ID__";
export declare type providerType<T = undefined> = (...args: unknown[]) => [T];
export declare type closureType = ((...args: string[]) => typeof Function) & {
    _call?: <T>(...args: any) => T;
};
export declare type watcherObjType<T = {
    [key: string]: [unknown, ((prop: string, data: unknown) => void)?];
}> = (T & {
    init?: watcherObjType<T> | undefined;
    onUpdate?: ((...args: unknown[]) => void)[];
}) | ICallable<T>;
export declare type muppetSelectObj<T> = {
    select: T | {
        [key: string]: unknown;
    };
    __notify__: () => void;
};
export declare type muppetType<T = {
    [key: string]: unknown;
}> = Record<'get' | 'init' | '__PROVIDER_ID__' | string, muppetSelectObj<T> | string | watcherObjType<T> | ((obj: muppetType<T>, prop: string) => muppetType<T>[keyof muppetType<T>]) | {
    [key: string]: unknown;
}>;

interface Func<T = { [key: string]: unknown }> extends Function {
    (...args: unknown[]): [T];
}

interface Muppet<T> extends muppetType<T> {
    ['__PROVIDER_ID__']?: string;
    init?: watcherObjType<T> | null;
    get?(obj: muppetType<T>, prop: string): muppetType<T>[keyof muppetType<T>];
}
export interface ICallable<T, M = undefined> extends Function {
    (...args: unknown[]): [T, M];
}

export declare class Callable extends Function {
    constructor();
}

export interface ICallable<T, M = undefined> extends Function {
    (...args: unknown[]): [T, M];
    _call(...args: unknown[]): providerType<T>;
    muppet: Muppet<T>;
    onUpdate: ((...args: unknown[]) => void)[];
}

export interface ISource<T> {
    _call(...args: unknown[]): providerType<T>;
    muppet: Muppet<T>;
    onUpdate: ((...args: unknown[]) => void)[];
}

export declare class Source<
    T = { [key: string]: unknown; }, 
    M = undefined
> extends Callable implements ISource<T> {
    private readonly initObject;
    private readonly methods;
    muppet: Muppet<T>;
    constructor(_call: (...args: unknown[]) => providerType<T>, initObject: watcherObjType<T>, methods: M);
    _call(...args: unknown[]): providerType<T>;
    onUpdate: [];
}
export {};
