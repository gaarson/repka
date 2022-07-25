export const SPECIAL_KEY = '__PROVIDER_ID__';

export type providerType = (...args: any[]) => any;
export type closureType = ((...args: string[]) => typeof Function) & { __call?: <T>(...args: any) => T };

export type watcherObjType<
  T = { 
    [key: string]: unknown 
  }
> = T & { 
  init?: watcherObjType<T> | undefined,  
  __onUpdate?: ((...args: unknown[]) => void)[]
} | ICallable<T>;
export type muppetSelectObj<T> = T | { [key: string]: unknown };
export type muppetType<T = { [key: string]: unknown }> = Record<
  'get' | 'init' |  '__PROVIDER_ID__' | string,
  muppetSelectObj<T> | 
  string | 
  watcherObjType<T> | 
  ((obj: muppetType<T>, prop: string) => muppetType<T>[keyof muppetType<T>]) | 
  { [key: string]: unknown } 
>;
interface Muppet<T> extends muppetType<T> {
  ['__PROVIDER_ID__']?: string;
  init?: watcherObjType<T> | null;
  get?(obj: muppetType<T>, prop: string): muppetType<T>[keyof muppetType<T>];
};
export interface ICallable<T> extends Function {
  muppet: Muppet<T>;
  __onUpdate: ((...args: unknown[]) => void)[];
  __listeners: { [key: string]: Map<string, (key?: string, value?: unknown) => void | BroadcastChannel> };
  __call(...args: unknown[]): providerType;
}

export class Callable extends Function {
  constructor() {
    super();
    let closure: closureType = undefined;
    closure = (...args) => { return closure.__call(...args); };
    return Object.setPrototypeOf(closure, new.target.prototype);
  }
}
export class Source<
  T = { [key: string]: unknown }, 
  M = undefined
> extends Callable implements ICallable<T> { 
  __onUpdate: [] = [];
  __listeners: {} = {};
  muppet: Muppet<T>;

  constructor(
    readonly __call: providerType,
    initObject: watcherObjType<T>,
    private readonly __methods: M,
    getter: (obj: Muppet<T>, prop: string) => ICallable<T>[keyof ICallable<T>]
  ) {
    super();
    this.call = undefined;
    for (const key in initObject) {
      this[key] = initObject[key];
    }

    this.muppet = new Proxy<Muppet<T>>(
      {}, 
      { get: getter.bind(this) }
    ); 
  }
}

export const createSource = <
  T = { [key: string]: unknown }, 
  M = undefined
>(
  initObj: watcherObjType<T>,
  provider?: providerType,
  methods?: M,
): ICallable<T> => {
   function getter(obj: Muppet<T>, prop: string) {
    if (obj[SPECIAL_KEY] && typeof obj[SPECIAL_KEY] === 'string' && prop !== obj[SPECIAL_KEY]) {
      if (obj[obj[SPECIAL_KEY]]) {
        obj[obj[SPECIAL_KEY]] = {
          ...obj[obj[SPECIAL_KEY]] as muppetSelectObj<T>,
          [prop]: this[prop] !== undefined ? this[prop] : undefined
        };
      } else {
        obj[obj[SPECIAL_KEY]] = {
          [prop]: this[prop] !== undefined ? this[prop] : undefined
        };
      }
    }

    if (!obj[prop]) {
      return this[prop];
    }
    
    return obj[prop];
  }

  return new Proxy<ICallable<T>>(
    new Source<T, M>(provider, initObj, methods, getter),
    {
      set(obj, prop: string, value) {
        obj[prop] = value;

        if (obj.__listeners[prop] && obj.__listeners[prop].size) {
          for (const [key, notify] of obj.__listeners[prop]) {
            if (obj.muppet[key]) {
              obj.muppet[key] = {
                ...obj.muppet[key] as Muppet<T>,
                [prop]: value
              };
            }
            
            notify();
          }
        }

        if (Array.isArray(obj.__onUpdate) && prop !== 'onUpdate') {
          obj.__onUpdate.forEach((fn: () => void) => fn());
          obj.__onUpdate = [];
        }

        return true;
      },
    }
  );
}
