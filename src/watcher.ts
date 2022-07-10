import { 
  providerType, 
  watcherObjType, 
  Source, 
  SPECIAL_KEY, 
  ICallable, 
  muppetSelectObj 
} from './callable';

export type baseSourceObjType<T> = {
  [key: string]: T,
};

export type specialKeyLiteralType = "__PROVIDER_ID__";

export type proxyHandlerType<T> = {
  set: (
    obj: T & { onUpdate: ((...args: any) => void)[] },
    prop: string,
    value: T
  ) => boolean
  get?: (
    obj: T & { onUpdate: ((...args: any) => void)[] },
    prop: string,
  ) => unknown
};

export interface IWatcher<T = { [key: string]: unknown }, M = undefined> {
  sourceObj: ICallable<T>;
  SPECIAL_KEY: specialKeyLiteralType;

  init(
    initObj: watcherObjType<T>,
    provider?: providerType,
    methods?: M,
  ): void;
  get(propertyName?: string): unknown;
  watch(fieldName: string): Promise<T>;
  watchFor(fieldName: string, neededValue: unknown): Promise<T>;
  set(propertyName: keyof watcherObjType<T>, value: unknown): void;
}

export class Watcher<T = { [key: string]: unknown }, M = undefined> implements IWatcher<T, M> {
  sourceObj: ICallable<T>;

  SPECIAL_KEY: specialKeyLiteralType = SPECIAL_KEY;

  init(
    initObj: watcherObjType<T>,
    provider?: providerType,
    methods?: M,
  ): void {
    if (typeof initObj === 'object') {
      this.sourceObj = new Proxy<ICallable<T>>(
        new Source<T, M>(
          provider, 
          Object.keys(initObj).reduce((acc, key) => ({ ...acc, [key]: initObj[key][0] }), {} as T), 
          methods
        ),
        {
          set(obj, prop, value) {
            obj[prop] = value;
            obj.muppet.init[prop] = value;

            for (const key in obj.muppet) {
              if (
                (obj.muppet[key] as muppetSelectObj<T>).__notify__ && 
                (obj.muppet[key] as muppetSelectObj<T>).select.hasOwnProperty(prop)
              ) {
                (obj.muppet[key] as muppetSelectObj<T>).select = {
                  ...(obj.muppet[key] as muppetSelectObj<T>).select,
                  [prop]: value
                };

                (obj.muppet[key] as muppetSelectObj<T>).__notify__();
              }
            }
            if (Array.isArray(obj.onUpdate) && prop !== 'onUpdate') {
              obj.onUpdate.forEach((fn: () => void) => fn());
              obj.onUpdate = [];
            }
            return true;
          },
        }
      );
    }
  }

  public set(
    propertyName: keyof (ICallable<T>), 
    value: (ICallable<T>)[keyof (ICallable<T>)]
  ): void {
    if (this.sourceObj && propertyName !== 'name' && propertyName !== 'length') {
      this.sourceObj[propertyName] = value;
    }
  }
  public get(propertyName: string): T {
    if (this.sourceObj && propertyName) {
      return this.sourceObj[propertyName];
    }
  }

  public watch(
    propertyName: string,
  ): Promise<T> {
    return new Promise((resolve) => {
      this.sourceObj.onUpdate = [...this.sourceObj.onUpdate, () => {
        if (this.sourceObj[propertyName]) {
          resolve(this.sourceObj[propertyName]);
        }
      }];
    });
  }
  public watchFor(
    propertyName: string,
    neededValue: T
  ): Promise<T> {
    return new Promise((resolve) => {
      if (this.sourceObj[propertyName] === neededValue) resolve(this.sourceObj[propertyName]);
      this.sourceObj.onUpdate = [...this.sourceObj.onUpdate, () => {
        if (this.sourceObj[propertyName] === neededValue) {
          resolve(this.sourceObj[propertyName]);
        }
      }];
    });
  }
}

export type watcherCreatorType = <T, M>(
  obj: watcherObjType<T>,
  provider?: providerType,
  methods?: M,
) => Watcher<T, M>;

export const watcherCreator = <T, M>(
  obj: watcherObjType<T>,
  provider?: providerType,
  methods?: M,
): Watcher<T, M> => {
  const watcher = new Watcher<T, M>();

  watcher.init(obj, provider, methods);
  return watcher;
};

