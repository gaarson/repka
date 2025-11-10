export declare function createRepkaError(originalError: unknown, componentName: string, spamHash: string | null, errorHash: string): Error;
export declare const simpleHook: <T extends object>(context: T, prop: keyof T) => T[keyof T];
export declare function simpleReactProvider<T extends object>(this: T, prop: keyof T): T[keyof T];
