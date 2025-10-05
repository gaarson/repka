export type providerType<DataType = undefined, MethodsObjType = undefined> = () => (MethodsObjType extends object ? [DataType, MethodsObjType] : DataType);
export declare class Callable<T extends []> extends Function {
    __call: Function;
    constructor();
}
export declare const SPECIAL_KEY = "__PROVIDER_ID__";
export declare const FIELDS_PREFIX = "__REPO__";
export interface ISource<T> {
    <DataType = T, MethodsObjType = undefined>(data: DataType, methods?: MethodsObjType, provider?: providerType<DataType, MethodsObjType>): (() => [DataType, Omit<MethodsObjType, 'repo'>]) & DataType;
}
export declare const createSource: <DataType = unknown, MethodsObjType = undefined>(data: DataType, methods?: MethodsObjType, provider?: providerType<DataType, MethodsObjType>) => ISource<DataType>;
