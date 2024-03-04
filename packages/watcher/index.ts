import { providerType, SPECIAL_KEY, FIELDS_PREFIX, createSource } from 'core';

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

export interface IWatcher<
  T = { [key: string]: unknown },
  M = undefined
> {
  sourceObj: T & providerType<T, M>;
  SPECIAL_KEY: specialKeyLiteralType;
  broadcast: any;

  init(
    initObj: T,
    options: {
      provider?: providerType,
      methods?: M,
      broadcastName?: string
    }
  ): void;

  set(
    propertyName: keyof (T), 
    value: (T & providerType<T, M>)[keyof (T)],
    ignoreBroadcast?: boolean
  ): void;
  get(
    propertyName?: keyof (T)
  ): (T)[keyof T] | T;

  createBroadcast(broadcastName: string): void;
  watch(fieldName: string): Promise<T>;
  watchFor(fieldName: string, neededValue: unknown): Promise<T>;
}

export type watcherCreatorType = <T, M>(
  obj: T,
  provider?: providerType,
  methods?: M,
  broadcastName?: string
) => Watcher<T, M>;

export class Watcher<T = {[key: string]: unknown}, M = undefined> implements IWatcher<T, M> {
  private keys: string[] = [];

  sourceObj: T & providerType<T, M>;
  SPECIAL_KEY: specialKeyLiteralType = SPECIAL_KEY;
  broadcast: any;

  init(
    initObj: T,
    options: {
      provider?: providerType,
      methods?: M,
      broadcastName?: string
    } = {}
  ): void {
    if (typeof initObj === 'object' && !Array.isArray(initObj)) {
      this.keys = Object.keys(initObj || {});
      this.sourceObj = createSource<T, M>(initObj, options.provider, options.methods) as T & providerType<T, M>;
    }
    if (options.broadcastName) this.createBroadcast(options.broadcastName);
  }

  createBroadcast(broadcastName: string = 'broadcastWatcher'): void {
    this.broadcast = new BroadcastChannel(broadcastName);

    this.broadcast.onmessage = (
      { data }: { 
        data: { 
          type?: keyof (T), 
          data: providerType<T> | (providerType<T>)[keyof (providerType<T>)] 
        } | 'needSome' 
      }
    ) => {
      if (data === 'needSome') {
        this.broadcast.postMessage({ data: this.get() });
      } else if (data.type === undefined) {
        for (const key in data.data) this.sourceObj[key] = data.data[key];
      } else {
        // this.set(data.type, data.data, true);
      }
    };

    this.broadcast.postMessage('needSome');
  }

  public set(
    propertyName: keyof (T), 
    value: (T & providerType<T, M>)[keyof (T)],
    ignoreBroadcast = false
  ): void {
    if (this.sourceObj) {
      this.sourceObj[propertyName] = value;
    }
    if (this.broadcast && !ignoreBroadcast) {
      this.broadcast.postMessage({ type: propertyName, data: value });
    }
  }
  public get(
    propertyName?: keyof (T)
  ): (T)[keyof T] | T {
    if (this.sourceObj && propertyName) {
      return this.sourceObj[propertyName];
    } else if (!propertyName) {
      return this.sourceObj[`${FIELDS_PREFIX}data`];
    }
  }

  public watch(
    propertyName: string,
  ): Promise<T> {
    const index = this.sourceObj[`${FIELDS_PREFIX}onUpdate`].length;

    return new Promise((resolve) => {
      this.sourceObj[`${FIELDS_PREFIX}onUpdate`] = [
        ...this.sourceObj[`${FIELDS_PREFIX}onUpdate`], 
        (updatedProperty) => {
          if (propertyName === updatedProperty) {
            resolve(this.sourceObj[propertyName]);
            this.sourceObj[`${FIELDS_PREFIX}onUpdate`][index] = null;

            if (this.sourceObj[`${FIELDS_PREFIX}onUpdate`].every((i) => i ===  null))
              this.sourceObj[`${FIELDS_PREFIX}onUpdate`] = [];
          }
        }
      ];
    });
  }
  public watchFor(
    propertyName: string,
    neededValue: T
  ): Promise<T> {
    const index = this.sourceObj[`${FIELDS_PREFIX}onUpdate`].length;
    return new Promise((resolve) => {
      this.sourceObj[`${FIELDS_PREFIX}onUpdate`] = [
        ...this.sourceObj[`${FIELDS_PREFIX}onUpdate`], 
        (updatedProperty) => {
          if (propertyName === updatedProperty 
            && this.sourceObj[propertyName] === neededValue) {
            resolve(this.sourceObj[propertyName]);
            this.sourceObj[`${FIELDS_PREFIX}onUpdate`][index] = null;

            if (this.sourceObj[`${FIELDS_PREFIX}onUpdate`].every((i) => i ===  null)) 
              this.sourceObj[`${FIELDS_PREFIX}onUpdate`] = [];
          }
        }
      ];
    });
  }
}

export const watcherCreator = <T, M>(
  obj: T,
  provider?: providerType,
  methods?: M,
  broadcastName?: string
): Watcher<T, M> => {
  const watcher = new Watcher<T, M>();
  watcher.init(obj, { provider, methods, broadcastName });
  return watcher;
};


