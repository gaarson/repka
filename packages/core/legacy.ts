export type providerType<DataType = undefined, MethodsObjType = undefined> = () => 
  (MethodsObjType extends object ? [DataType, MethodsObjType] : DataType);

export class Callable<T extends []> extends Function {
  __call: Function
  constructor() {
    super();
    let closure = undefined;
    closure = (...args: T) => { 
      return closure.__call(...args); 
    };
    return Object.setPrototypeOf(closure, new.target.prototype);
  }
}

export const SPECIAL_KEY = '__PROVIDER_ID__';
export const FIELDS_PREFIX = '__REPO__'

const get = (obj, prop) => {
  if (
    obj[`${FIELDS_PREFIX}muppet`][SPECIAL_KEY] 
    && prop !== obj[`${FIELDS_PREFIX}muppet`][SPECIAL_KEY]
    && (typeof prop === 'string' && !prop.startsWith(FIELDS_PREFIX)) 
  ) {
    obj[`${FIELDS_PREFIX}muppet`][obj[`${FIELDS_PREFIX}muppet`][SPECIAL_KEY]] = false;
    obj[`${FIELDS_PREFIX}criticalFields`][obj[`${FIELDS_PREFIX}muppet`][SPECIAL_KEY]] = [...new Set([
      ...(obj[`${FIELDS_PREFIX}criticalFields`][obj[`${FIELDS_PREFIX}muppet`][SPECIAL_KEY]] || []),
      prop
    ])];
  }
  if ((typeof prop === 'string' && prop.startsWith(FIELDS_PREFIX)) || prop === '__call') {
    return obj[prop]
  }

  return obj[`${FIELDS_PREFIX}data`][prop];
}

const set = (obj, prop, value): boolean => {
  if ((typeof prop === 'string' && prop.startsWith(FIELDS_PREFIX)) || prop === '__call') {
    obj[prop] = value;
    return true;
  } 

  obj[`${FIELDS_PREFIX}data`] = {
    ...obj[`${FIELDS_PREFIX}data`],
    [prop]: value
  };

  if (obj[`${FIELDS_PREFIX}listeners`][prop] && obj[`${FIELDS_PREFIX}listeners`][prop].size) {
    obj[`${FIELDS_PREFIX}listeners`][prop].forEach((notify, key) => {
      if (obj[`${FIELDS_PREFIX}muppet`][key] !== undefined 
        && obj[`${FIELDS_PREFIX}muppet`][key] === false) { 
        obj[`${FIELDS_PREFIX}muppet`][key] = true; 
      }

      notify();
    });
  }
  if (obj[`${FIELDS_PREFIX}onUpdate`].length) {
    obj[`${FIELDS_PREFIX}onUpdate`].forEach((fn: (...args: unknown[]) => void) => fn && fn(prop));
  }

  return true;
}

export interface ISource<T> {
  <
    DataType = T,
    MethodsObjType = undefined
  >(
    data: DataType,
    methods?: MethodsObjType,
    provider?: providerType<DataType, MethodsObjType>,
  ): (() => [DataType, Omit<MethodsObjType, 'repo'>]) & DataType;
}

export const createSource = <
  DataType = unknown,
  MethodsObjType = undefined
>(
  data: DataType,
  methods?: MethodsObjType,
  provider?: providerType<DataType, MethodsObjType>,
): ISource<DataType> => {
  try {
    function defaultProvider() {
      return methods ? [this, methods] : this;
    };
    const callableObj = new Callable();

    if (methods) callableObj[`${FIELDS_PREFIX}methods`] = methods;

    callableObj[`${FIELDS_PREFIX}onUpdate`] = [];
    callableObj[`${FIELDS_PREFIX}data`] = data;
    callableObj[`${FIELDS_PREFIX}criticalFields`] = {};
    callableObj[`${FIELDS_PREFIX}muppet`] = {};
    callableObj[`${FIELDS_PREFIX}listeners`] = Object.keys(data).reduce(
      (prev, key) => ({ ...prev, [key]: new Map() }), {}
    );

    const proxy = new Proxy(callableObj, { set, get });
    callableObj.__call = (provider || defaultProvider).bind(proxy);

    return proxy;
  } catch (error) {
    console.error('SOURCE OBJECT ERROR: ', error);
  }
};
