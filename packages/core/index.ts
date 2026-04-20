import { SYMBOLS, SPECIAL_KEY, createCallable, ICallable } from './domain';

function get(target: any, prop: string | symbol) {
  if (typeof prop === 'symbol') return target[prop];
  if (prop === '__call') return target[SYMBOLS.call];

  const muppet = target[SYMBOLS.muppet];
  const currentKey = muppet.get(SPECIAL_KEY);
  const methods = target[SYMBOLS.methods];

  if (currentKey !== undefined && prop !== currentKey) {
    if (!methods[prop]) {
      muppet.set(currentKey, false);

      const criticalFields = target[SYMBOLS.criticalFields];
      let fields = criticalFields.get(currentKey);
      if (!fields) {
        fields = new Set();
        criticalFields.set(currentKey, fields);
      }
      fields.add(prop);
    }
  }

  if (methods[prop]) return methods[prop];

  const getter = target[SYMBOLS.getter];
  if (getter) return getter(prop);

  return target[SYMBOLS.data][prop];
}

const set = (target: any, prop: string | symbol, value: any, receiver: any): boolean => {
  if (typeof prop === 'symbol' || prop === '__call') {
    target[prop === '__call' ? SYMBOLS.call : prop] = value;
    return true;
  }

  if (!target[SYMBOLS.methods][prop]) {
    target[SYMBOLS.data][prop] = value;

    const listeners = target[SYMBOLS.listeners];
    const propListeners = listeners[prop];
    
    if (propListeners && propListeners.size > 0) {
      const muppet = target[SYMBOLS.muppet];
      propListeners.forEach((notify: any, key: any) => {
        if (muppet.has(key) && muppet.get(key) === false) {
          muppet.set(key, true);
        }
        notify();
      });
    }

    const onUpdate = target[SYMBOLS.onUpdate];
    if (onUpdate.length > 0) {
      const listeners = [...onUpdate]; 
      
      for (let i = 0; i < listeners.length; i++) {
        const fn = listeners[i];
        if (fn) fn(prop, value, receiver);
      }
    }
  }

  return true;
}

function getAllMethodNames(toCheck: {[key: string]: unknown}) {
  const props: string[] = [];
  let obj = toCheck;
  do {
    props.push(...Object.getOwnPropertyNames(obj));
  } while (obj = Object.getPrototypeOf(obj));

  const uniqueProps = Array.from(new Set(props)).sort();
  return uniqueProps.filter(e => typeof toCheck[e] === 'function');
}

export const createSource = <
  T extends {},
  O extends {main?: (...args: any[]) => any, getter?: (...args: any[]) => any} = {}
>(
  data: T,
  {main, getter}: O
): T & ICallable<ReturnType<NonNullable<O['main']>>, Parameters<NonNullable<O['main']>>> => {
  try {
    let proxy: any;
    const callableObj = createCallable(function(this: any, ...args: any[]) {
      if (proxy && proxy[SYMBOLS.call]) {
        return proxy[SYMBOLS.call](...args);
      }
    }) as any;

    const allMethods = getAllMethodNames(data);
    const methodsKeys = new Set<string>();
    
    for (let i = 0; i < allMethods.length; i++) {
        const key = allMethods[i];
        if (key !== 'constructor' && !(data as any)[key]?.[SYMBOLS.muppet]) {
            methodsKeys.add(key);
        }
    }

    const dataKeys = Object.keys(data);
    for (let i = 0; i < dataKeys.length; i++) {
      const key = dataKeys[i];
      if (methodsKeys.has(key)) continue;

      if (key === 'name') {
        Object.defineProperty(callableObj, key, {
          value: (data as any)[key], writable: true, enumerable: true, configurable: true,
        });
      } else {
        callableObj[key] = (data as any)[key];
      }
    }

    proxy = new Proxy(callableObj, {set, get: get.bind(this)});

    const methods: Record<string, Function> = {};
    methodsKeys.forEach(curr => {
         methods[curr] = (data as any)[curr].bind(proxy);
    });

    proxy[SYMBOLS.methods] = methods;
    proxy[SYMBOLS.onUpdate] = [];
    proxy[SYMBOLS.data] = data;
    proxy[SYMBOLS.criticalFields] = new Map();
    proxy[SYMBOLS.muppet] = new Map();

    const listeners: Record<string, Map<any, any>> = {};
    const objKeys = Object.keys(callableObj);
    for(let i = 0; i < objKeys.length; i++) {
        const key = objKeys[i];
        if (typeof key === 'string' && key !== '__call') {
            listeners[key] = new Map();
        }
    }
    proxy[SYMBOLS.listeners] = listeners;

    if (getter) proxy[SYMBOLS.getter] = getter.bind(proxy);
    if (main) proxy[SYMBOLS.call] = main.bind(proxy);

    return proxy as any;
  } catch (error) {
    console.error('SOURCE OBJECT ERROR: ', error);
    throw error;
  }
};
