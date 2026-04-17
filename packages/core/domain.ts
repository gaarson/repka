export const SYMBOLS = {
  muppet: Symbol('muppet'),
  criticalFields: Symbol('criticalFields'),
  methods: Symbol('methods'),
  data: Symbol('data'),
  getter: Symbol('getter'),
  listeners: Symbol('listeners'),
  onUpdate: Symbol('onUpdate'),
  call: Symbol('__call'),
} as const;

export type providerType<DataType = undefined, MethodsObjType = undefined> = () =>
  (MethodsObjType extends object ? [DataType, MethodsObjType] : DataType);

export const SPECIAL_KEY = '__PROVIDER_ID__' as const;
export const FIELDS_PREFIX = '__REPO__' as const;

export interface ICallable<T, P extends unknown[]> {
  (...args: P): T;
}

export function createCallable<T, P extends unknown[]>(implementation: (...args: P) => T): ICallable<T, P> {
  const callable = function (this: any, ...args: P): T {
    return implementation.apply(this, args);
  };
  return callable as ICallable<T, P>;
}
