export type providerType<DataType = undefined, MethodsObjType = undefined> = () => (MethodsObjType extends object ? [DataType, MethodsObjType] : DataType);
export declare const SPECIAL_KEY = "__PROVIDER_ID__";
export declare const FIELDS_PREFIX = "__REPO__";
export declare const createSource: <DataType = unknown, MethodsObjType = undefined>(data: DataType, provider?: providerType<DataType, MethodsObjType>, methods?: MethodsObjType) => DataType;
