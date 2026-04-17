export declare const SYMBOLS: {
    readonly muppet: symbol;
    readonly criticalFields: symbol;
    readonly methods: symbol;
    readonly data: symbol;
    readonly getter: symbol;
    readonly listeners: symbol;
    readonly onUpdate: symbol;
    readonly call: symbol;
};
export type providerType<DataType = undefined, MethodsObjType = undefined> = () => (MethodsObjType extends object ? [DataType, MethodsObjType] : DataType);
export declare const SPECIAL_KEY: "__PROVIDER_ID__";
export declare const FIELDS_PREFIX: "__REPO__";
export interface ICallable<T, P extends unknown[]> {
    (...args: P): T;
}
export declare function createCallable<T, P extends unknown[]>(implementation: (...args: P) => T): ICallable<T, P>;
