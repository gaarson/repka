export const SPECIAL_KEY = '__PROVIDER_ID__';

export type providerType<T = undefined, M = undefined> = (...args: any[]) => [T, M];
export type closureType = ((...args: string[]) => typeof Function) & { __call?: <T>(...args: any) => T };

export type watcherObjType<T> = (T & {
    init?: watcherObjType<T> | undefined;
    __onUpdate?: (((...args: unknown[]) => void) | null)[];
});

export type muppetSelectObj<T> = T | { [key: string]: unknown };

export type muppetType<T> = Record<'get' | 
  '__init__' | 
  '__PROVIDER_ID__' | 
  string, 
  muppetSelectObj<T> 
  | boolean 
  | string 
  | watcherObjType<T> 
  | ((obj: muppetType<T>, prop: string) => muppetType<T>[keyof muppetType<T>]) 
  | { [key: string]: unknown }
>;

export interface Muppet<T> extends muppetType<T> {
  ['__PROVIDER_ID__']?: string;
  __init__: watcherObjType<T> | null;
  get?(obj: muppetType<T>, prop: string): muppetType<T>[keyof muppetType<T>];
};

export interface ICallable<T, M = undefined, A = undefined> extends Function {
  (): [T, M];
  (param: string): A;
  muppet: Muppet<T>;
  __onUpdate: (((...args: unknown[]) => void) | null)[];
  __listeners: { [key: string]: Map<string, (key?: string, value?: unknown) => void | BroadcastChannel> };
  __call: providerType<T, M>;
}

export class Callable extends Function {
  constructor() {
    super();
    let closure: closureType = undefined;
    closure = (...args) => { return closure.__call(...args); };
    return Object.setPrototypeOf(closure, new.target.prototype);
  }
}

export interface ISource<T, M = undefined> {
  muppet: Muppet<T>;
  __onUpdate: (((...args: unknown[]) => void) | null)[];
  __listeners: { [key: string]: Map<string, (key?: string, value?: unknown) => void | BroadcastChannel> };
  __call: providerType<T, M>;
}

export class Source<
  T = { [key: string]: unknown }, 
  M = undefined
> extends Callable implements ISource<T, M> { 
  __onUpdate: [] = [];
  __listeners: {} = {};
  __criticalFields: {} = {};
  muppet: Muppet<T>;

  constructor(
    readonly __call: providerType,
    initObject: watcherObjType<T>,
    private readonly __methods: M,
    getter: (obj: Muppet<T>, prop: string) => ICallable<T>[keyof ICallable<T>]
  ) {
    super();
    this.call = undefined;

    this.muppet = new Proxy<Muppet<T>>({ __init__: initObject }, { get: getter.bind(this) }); 

    for (const key in initObject) { 
      this.__listeners[key] = new Map(); 
      this[key] = initObject[key];
    }
  }
}

export const createSource = <
  T = { [key: string]: unknown }, 
  M = undefined
>(
  initObj: watcherObjType<T>,
  provider?: providerType,
  methods?: M,
): ISource<T, M> => {
  function getter(obj: Muppet<T>, prop: string) {
    if (
      obj[SPECIAL_KEY] 
      && typeof obj[SPECIAL_KEY] === 'string' 
      && prop !== obj[SPECIAL_KEY]
      && prop !== '__init__'
    ) {
      obj[obj[SPECIAL_KEY]] = false;
      this.__criticalFields[obj[SPECIAL_KEY]] = [
        ...(this.__criticalFields[obj[SPECIAL_KEY]] || []),
        prop
      ];
    }

    if (prop === '__init__') { return obj.__init__; }
    if (obj[prop] === undefined) { return obj.__init__[prop]; } 

    return obj[prop];
  }

  function setter(obj, prop: string, value) {
    obj[prop] = value;
    if (prop !== '__onUpdate') {
      obj.muppet.__init__ = { 
        ...obj.muppet.__init__,
        [prop]: value
      };
    }

    if (obj.__listeners[prop] && obj.__listeners[prop].size) {
      obj.__listeners[prop].forEach((notify, key) => {
        if (obj.muppet[key] !== undefined && obj.muppet[key] === false) { 
          obj.muppet[key] = true; 
        }

        notify();
      });
    }

    if (Array.isArray(obj.__onUpdate) && prop !== '__onUpdate') {
      obj.__onUpdate.forEach((fn: (...args: unknown[]) => void) => fn && fn(prop));
    }

    return true;
  }

  return new Proxy<ISource<T, M>>(
    new Source<T, M>(provider, initObj, methods, getter), 
    { set: setter }
  );
}
