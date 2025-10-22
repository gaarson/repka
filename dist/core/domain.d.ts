export type providerType<DataType = undefined, MethodsObjType = undefined> = () => (MethodsObjType extends object ? [DataType, MethodsObjType] : DataType);
export declare const SPECIAL_KEY: "__PROVIDER_ID__";
export declare const FIELDS_PREFIX: "__REPO__";
export interface ICallable<T, P extends unknown[]> {
    (...args: P): T;
    __call(...args: P): T;
}
export interface ICallableConstructor {
    new <T, P extends unknown[]>(implementation: (...args: P) => T): ICallable<T, P>;
    prototype: any;
}
export declare const Callable: ICallableConstructor;
