import {ICallable, Callable, SPECIAL_KEY, FIELDS_PREFIX} from './domain';

function get(obj, prop) {
  if (
    obj[`${FIELDS_PREFIX}muppet`].get(SPECIAL_KEY)
    && prop !== obj[`${FIELDS_PREFIX}muppet`].get(SPECIAL_KEY)
    && (typeof prop === 'string' && !prop.startsWith(FIELDS_PREFIX))
    && !obj[`${FIELDS_PREFIX}methods`][prop]
  ) {
    const currentKey = obj[`${FIELDS_PREFIX}muppet`].get(SPECIAL_KEY);
    obj[`${FIELDS_PREFIX}muppet`].set(currentKey, false);
    
    const currentFields = obj[`${FIELDS_PREFIX}criticalFields`].get(currentKey) || [];
    obj[`${FIELDS_PREFIX}criticalFields`].set(currentKey, [...new Set([
      ...currentFields,
      prop
    ])]);
  }
  if ((typeof prop === 'string' && prop.startsWith(FIELDS_PREFIX)) || prop === '__call') {
    return obj[prop]
  }
  if (obj[`${FIELDS_PREFIX}methods`][prop]) return obj[`${FIELDS_PREFIX}methods`][prop];

  if (obj[`${FIELDS_PREFIX}getter`]) return obj[`${FIELDS_PREFIX}getter`](prop);

  return obj[`${FIELDS_PREFIX}data`][prop];
}

const set = (obj, prop, value, receiver): boolean => {
  if ((typeof prop === 'string' && prop.startsWith(FIELDS_PREFIX)) || prop === '__call') {
    obj[prop] = value;
    return true;
  }

  if (!obj[`${FIELDS_PREFIX}methods`][prop]) {
    obj[`${FIELDS_PREFIX}data`] = {
      ...obj[`${FIELDS_PREFIX}data`],
      [prop]: value
    };

    if (obj[`${FIELDS_PREFIX}listeners`][prop] && obj[`${FIELDS_PREFIX}listeners`][prop].size) {
      obj[`${FIELDS_PREFIX}listeners`][prop].forEach((notify, key) => {
        if (obj[`${FIELDS_PREFIX}muppet`].has(key)
            && obj[`${FIELDS_PREFIX}muppet`].get(key) === false) {
          obj[`${FIELDS_PREFIX}muppet`].set(key, true);
        }

        notify();
      });
    }
    if (obj[`${FIELDS_PREFIX}onUpdate`].length) {
      obj[`${FIELDS_PREFIX}onUpdate`].forEach(
        (fn: (...args: any[]) => void) => fn && fn(prop, value, receiver)
      );
    }
  }

  return true;
}

export interface ISource<T, P> {
  <DataType = T, Provider = P >( data: DataType, provider?: Provider): DataType;
}

function getAllMethodNames(toCheck: {[key: string]: unknown}) {
  const props = [];
  let obj = toCheck;
  do {
    props.push(...Object.getOwnPropertyNames(obj));
  } while (obj = Object.getPrototypeOf(obj));
  
  return props.sort().filter((e, i, arr) => {
    if (e != arr[i + 1] && typeof toCheck[e] == 'function') {
       
      if (`${FIELDS_PREFIX}data` in toCheck[e]) {
        return false;
      }
      return true;
    } 
  });
}

export const createSource = <
  T extends {},
  O extends {main?: (...args: any[]) => any, getter?: (...args: any[]) => any} = {}
>(
  data: T,
  {main, getter}: O
): T & ICallable<ReturnType<O['main']>, Parameters<O['main']>> => {
  try {
    const dummyImplementation = (() => {}) as O['main'];
    const callableObj = new Callable(dummyImplementation);
    const methodsKeys = new Set(
      getAllMethodNames(data).filter(
        key => key !== 'constructor' && typeof data[key] === 'function' ? true : false
      )
    );

    const obj = Object.keys(data).reduce((acc, key) => {
      if (methodsKeys.has(key)) return acc;

      if (key === 'name') {
        Object.defineProperty(acc, key, {
          value: data[key],
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } else {
        acc[key] = data[key];
      }
      
      return acc;
    }, callableObj);

    const proxy: T & ICallable<ReturnType<O['main']>, Parameters<O['main']>> = new Proxy(obj, {set, get: get.bind(this)});

    const methods = [...methodsKeys].reduce(
      (prev, curr) => (curr !== 'constructor' && typeof data[curr] === 'function')
        ? { ...prev, [curr]: data[curr].bind(proxy) }
        : prev,
      {} as T
    );
    proxy[`${FIELDS_PREFIX}methods`] = methods;
    proxy[`${FIELDS_PREFIX}onUpdate`] = [];
    proxy[`${FIELDS_PREFIX}data`] = data;
    
    proxy[`${FIELDS_PREFIX}criticalFields`] = new Map();
    proxy[`${FIELDS_PREFIX}muppet`] = new Map();

    proxy[`${FIELDS_PREFIX}listeners`] = Object.keys(obj).reduce(
      (prev, key) => !key.startsWith(FIELDS_PREFIX) && key !== '__call'
        ? ({ ...prev, [key]: new Map() })
        : prev,
        {}
    );

    if (getter) {
      proxy[`${FIELDS_PREFIX}getter`] = getter.bind(proxy);
    }

    if (main) {
      proxy.__call = main.bind(proxy);
    }

    return proxy;
  } catch (error) {
    console.error('SOURCE OBJECT ERROR: ', error);
  }
};
