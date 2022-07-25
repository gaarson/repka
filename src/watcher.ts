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
  broadcast: BroadcastChannel;

  init(
    initObj: watcherObjType<T>,
    options: {
      provider?: providerType,
      methods?: M,
      broadcastName?: string
    }
  ): void;

  get(propertyName?: string): unknown;
  set(
    propertyName: keyof (ICallable<T>), 
    value: (ICallable<T>)[keyof (ICallable<T>)],
    ignoreBroadcast: boolean
  ): void;

  createBroadcast(broadcastName: string): void;
  watch(fieldName: string): Promise<T>;
  watchFor(fieldName: string, neededValue: unknown): Promise<T>;
}

export type watcherCreatorType = <T, M>(
  obj: watcherObjType<T>,
  provider?: providerType,
  methods?: M,
  broadcastName?: string
) => Watcher<T, M>;

export class Watcher<T = { [key: string]: unknown }, M = undefined> implements IWatcher<T, M> {
  private keys: string[] = [];

  sourceObj: ICallable<T>;
  SPECIAL_KEY: specialKeyLiteralType = SPECIAL_KEY;
  broadcast: BroadcastChannel;

  init(
    initObj: watcherObjType<T>,
    options: {
      provider?: providerType,
      methods?: M,
      broadcastName?: string
    } = {}
  ): void {
    if (typeof initObj === 'object' && !Array.isArray(initObj)) {
      this.keys = Object.keys(initObj || {});
      this.sourceObj = createSource<T, M>(initObj, options.provider, options.methods);
    }
    if (options.broadcastName) this.createBroadcast(options.broadcastName);
  }

  createBroadcast(broadcastName: string = 'broadcastWatcher'): void {
    this.broadcast = new BroadcastChannel(broadcastName);

    this.broadcast.onmessage = (
      { data }: { 
        data: { 
          type?: keyof (ICallable<T>), 
          data: ICallable<T> | (ICallable<T>)[keyof (ICallable<T>)] 
        } | 'needSome' 
      }
    ) => {
      if (data === 'needSome') {
        this.broadcast.postMessage({ data: this.get() });
      } else if (data.type === undefined) {
        for (const key in data.data) this.sourceObj[key] = data.data[key];
      } else {
        this.set(data.type, data.data, true);
      }
    };

    this.broadcast.postMessage('needSome');
  }

  public set(
    propertyName: keyof (ICallable<T>), 
    value: (ICallable<T>)[keyof (ICallable<T>)],
    ignoreBroadcast = false
  ): void {
    if (this.sourceObj && propertyName !== 'name' && propertyName !== 'length') {
      this.sourceObj[propertyName] = value;
    }
    if (this.broadcast && !ignoreBroadcast) {
      this.broadcast.postMessage({ type: propertyName, data: value });
    }
  }
  public get(propertyName?: string): T {
    if (this.sourceObj && propertyName) {
      return this.sourceObj[propertyName];
    } else if (!propertyName) {
      return this.keys.reduce((prev, curr) => {
        return {
          ...prev,
          [curr]: this.sourceObj[curr]
        };
      }, {} as T);
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

export const watcherCreator = <T, M>(
  obj: watcherObjType<T>,
  provider?: providerType,
  methods?: M,
  broadcastName?: string
): Watcher<T, M> => {
  const watcher = new Watcher<T, M>();
  watcher.init(obj, { provider, methods, broadcastName });
  return watcher;
};

