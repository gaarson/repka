export declare const simpleHook: <T extends object>(context: any, prop: keyof T) => T[keyof T];
export declare function simpleReactProvider<T extends object>(prop: keyof T): T[keyof T];
