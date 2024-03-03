export type providerType<DataType = undefined, MethodsObjType = undefined> = () => 
  (MethodsObjType extends object ? [DataType, MethodsObjType] : DataType);

export const SPECIAL_KEY = '__PROVIDER_ID__';
export const FIELDS_PREFIX = '__REPO__'

const get = (obj, prop) => {
  if (
    obj[`${FIELDS_PREFIX}muppet`][SPECIAL_KEY] 
    && prop !== obj[`${FIELDS_PREFIX}muppet`][SPECIAL_KEY]
    && !prop.startsWith(FIELDS_PREFIX) 
  ) {
    obj[`${FIELDS_PREFIX}muppet`][obj[`${FIELDS_PREFIX}muppet`][SPECIAL_KEY]] = false;
    obj[`${FIELDS_PREFIX}criticalFields`][obj[`${FIELDS_PREFIX}muppet`][SPECIAL_KEY]] = [...new Set([
      ...(obj[`${FIELDS_PREFIX}criticalFields`][obj[`${FIELDS_PREFIX}muppet`][SPECIAL_KEY]] || []),
      prop
    ])];
  }
  if (prop.startsWith(FIELDS_PREFIX) || prop === '__call') {
    return obj[prop]
  }

  return obj[`${FIELDS_PREFIX}data`][prop];
}

const set = (obj, prop, value): boolean => {
  if (prop.startsWith(FIELDS_PREFIX) || prop === '__call') return true;

  if (obj[`${FIELDS_PREFIX}listeners`][prop] && obj[`${FIELDS_PREFIX}listeners`][prop].size) {
    obj[`${FIELDS_PREFIX}listeners`][prop].forEach((notify, key) => {
      if (obj[`${FIELDS_PREFIX}muppet`][key] !== undefined 
        && obj[`${FIELDS_PREFIX}muppet`][key] === false) { 
        obj[`${FIELDS_PREFIX}muppet`][key] = true; 
      }

      notify();
    });
  }

  obj[`${FIELDS_PREFIX}data`] = {
    ...obj[`${FIELDS_PREFIX}data`],
    [prop]: value
  };

  return true;
}

class Callable extends Function {
  __call: Function
  constructor() {
    super();
    let closure = undefined;
    closure = (...args) => { 
      return closure.__call(...args); 
    };
    return Object.setPrototypeOf(closure, new.target.prototype);
  }
}

export const createSource = <
  DataType = unknown,
  MethodsObjType = undefined
>(
  data: DataType,
  provider?: providerType<DataType, MethodsObjType>,
  methods?: MethodsObjType,
): DataType => {
  try {
    function defaultProvider() {
      return methods ? [this, methods] : this;
    };
    const callableObj = new Callable();
    callableObj[`${FIELDS_PREFIX}onUpdate`] = [];
    callableObj[`${FIELDS_PREFIX}data`] = data;
    callableObj[`${FIELDS_PREFIX}criticalFields`] = {};
    callableObj[`${FIELDS_PREFIX}muppet`] = {};
    callableObj[`${FIELDS_PREFIX}listeners`] = Object.keys(data).reduce(
      (prev, key) => ({ ...prev, [key]: new Map() }), {}
    );
    if (methods) {
      callableObj[`${FIELDS_PREFIX}methods`] = methods;
    }
    const proxy = new Proxy(callableObj, { set, get });

    callableObj.__call = (provider || defaultProvider).bind(proxy);

    return proxy;
  } catch (error) {
    console.error('SOURCE OBJECT ERROR: ', error);
  }
};
