export declare const simpleHook: <T extends object>(context: T, prop: keyof T) => T[keyof T];
export declare function simpleReactProvider<T extends object>(this: T, prop: keyof T): T[keyof T];
