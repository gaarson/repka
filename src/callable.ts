export const SPECIAL_KEY = '__PROVIDER_ID__';

export type providerType = (...args: any[]) => any;
export type closureType = ((...args: string[]) => typeof Function) & { _call?: <T>(...args: any) => T };

export type watcherObjType<
  T = { [key: string]: [unknown, ((prop: string, data: unknown) => void)?] }
> = T & { 
  init?: watcherObjType<T> | undefined,  
  onUpdate?: ((...args: unknown[]) => void)[]
} | ICallable<T>;


export type muppetSelectObj<T> = {
  select: T | { [key: string]: unknown }, __notify__: () => void,
};

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
  onUpdate: ((...args: unknown[]) => void)[];
  _call(...args: unknown[]): providerType;
}

export class Callable extends Function {
  constructor() {
    super();
    let closure: closureType = undefined;
    closure = (...args) => { return closure._call(...args); };
    return Object.setPrototypeOf(closure, new.target.prototype);
  }
}

export class Source<T = { [key: string]: unknown }, M = undefined> extends Callable implements ICallable<T> { 
  muppet: Muppet<T> = new Proxy<Muppet<T>>(
    {}, 
    {
      get(obj: muppetType<T>, prop: string) {
        if (obj[SPECIAL_KEY] && typeof obj[SPECIAL_KEY] === 'string' && prop !== obj[SPECIAL_KEY]) {
          if (obj[obj[SPECIAL_KEY]]) {
            obj[obj[SPECIAL_KEY]] = {
              ...obj[obj[SPECIAL_KEY]] as muppetSelectObj<T>,
              select: { 
                ...((obj[obj[SPECIAL_KEY]] as muppetSelectObj<T>).select || {}), 
                [prop]: obj.init[prop] || undefined
              }
            };
          } else {
            obj[obj[SPECIAL_KEY]] = {
              select: {
                [prop]: obj.init[prop] || undefined
              }
            };
          }
        }

        if (!obj[prop]) {
          return obj.init[prop];
        }
        
        return obj[prop];
      }
    }
  ); 

  constructor(
    readonly _call: providerType,
    private readonly initObject: watcherObjType<T>,
    private readonly methods: M,
  ) {
    super();

    this.muppet.init = initObject;

    for (const key in initObject) {
      this[key] = initObject[key];
    }
  }


  onUpdate: [];
}
