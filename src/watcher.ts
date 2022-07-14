import { 
  providerType, 
  watcherObjType, 
  SPECIAL_KEY, 
  ICallable, 
  createSource
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
      this.sourceObj = createSource<T, M>(initObj, provider, methods);
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
      this.sourceObj.__onUpdate = [...this.sourceObj.__onUpdate, () => {
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
      this.sourceObj.__onUpdate = [...this.sourceObj.__onUpdate, () => {
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

