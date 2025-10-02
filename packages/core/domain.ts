export type providerType<DataType = undefined, MethodsObjType = undefined> = () => 
  (MethodsObjType extends object ? [DataType, MethodsObjType] : DataType);

export const SPECIAL_KEY = '__PROVIDER_ID__';
export const FIELDS_PREFIX = '__REPO__'

export interface ICallable<T, P extends unknown[]> {
  (...args: P): T;
  __call(...args: P): T;
}

export interface ICallableConstructor {
  new <T, P extends unknown[]>(implementation: (...args: P) => T): ICallable<T, P>;
  prototype: any;
}

function CallableImplementation(this: any, implementation: (...args: any[]) => any) {
  const callable = (...args: any[]) => {
    return callable.__call(...args);
  };
  callable.__call = implementation;
  Object.setPrototypeOf(callable, new.target.prototype);
  return callable;
}

export const Callable = CallableImplementation as unknown as ICallableConstructor;

