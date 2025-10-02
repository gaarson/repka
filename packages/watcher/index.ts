import { providerType, SPECIAL_KEY, FIELDS_PREFIX, createSource } from 'core/legacy';

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
  M = undefined,
  P = unknown
> {
  sourceObj: T & (P | providerType<T, M>);
  savedProvider?: P;
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

export class Watcher<T = {[key: string]: unknown}, M = undefined, P = unknown> implements IWatcher<T, M, P> {
  savedProvider: P;
  sourceObj: T & (P | providerType<T, M>);
  SPECIAL_KEY: specialKeyLiteralType = SPECIAL_KEY;
  broadcast: any;

  init(
    initObj: T,
    options: {
      provider?: any,
      methods?: M,
      broadcastName?: string
    } = {}
  ): void {
    if (typeof initObj === 'object' && !Array.isArray(initObj)) {
      if (options.provider) this.savedProvider = options.provider;
      this.sourceObj = createSource<T, M>(
        initObj, 
        options.methods, 
        options.provider || this.savedProvider
      ) as T & (P | providerType<T, M>);
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

export const watcherCreator = <T, M, P>(
  obj: T,
  provider?: P,
  methods?: M,
  broadcastName?: string
): Watcher<T, M, P> => {
  const watcher = new Watcher<T, M, P>();
  watcher.init(obj, { provider, methods, broadcastName });
  return watcher;
};

