import { 
  providerType, 
  watcherObjType, 
  SPECIAL_KEY, 
  ICallable, 
  createSource,
  ISource,
  Muppet
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

export interface IWatcher<
  T = { [key: string]: unknown },
  M = undefined
> {
  sourceObj: T & ICallable<T, M>;
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

  set(
    propertyName: keyof (T), 
    value: (T & ICallable<T, M>)[keyof (T)],
    ignoreBroadcast?: boolean
  ): void;
  get(
    propertyName?: keyof (Muppet<T>)
  ): (Muppet<T>)[keyof Muppet<T>] | Muppet<T>;

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

export class Watcher<T = {[key: string]: unknown}, M = undefined> implements IWatcher<T, M> {
  private keys: string[] = [];

  sourceObj: T & ICallable<T, M>;
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
      this.sourceObj = createSource<T, M>(initObj, options.provider, options.methods) as T & ICallable<T, M>;
    }
    if (options.broadcastName) this.createBroadcast(options.broadcastName);
  }

  createBroadcast(broadcastName: string = 'broadcastWatcher'): void {
    this.broadcast = new BroadcastChannel(broadcastName);

    this.broadcast.onmessage = (
      { data }: { 
        data: { 
          type?: keyof (T), 
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
    propertyName: keyof (T), 
    value: (T & ICallable<T, M>)[keyof (T)],
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
    propertyName?: keyof (Muppet<T>)
  ): (Muppet<T>)[keyof Muppet<T>] | Muppet<T> {
    if (this.sourceObj && propertyName) {
      return this.sourceObj.muppet[propertyName];
    } else if (!propertyName) {
      return this.sourceObj.muppet.__init__;
    }
  }

  public watch(
    propertyName: string,
  ): Promise<T> {
    const index = this.sourceObj.__onUpdate.length;

    return new Promise((resolve) => {
      this.sourceObj.__onUpdate = [...this.sourceObj.__onUpdate, (updatedProperty) => {
        if (propertyName === updatedProperty) {
          resolve(this.sourceObj[propertyName]);
          this.sourceObj.__onUpdate[index] = null;

          if (this.sourceObj.__onUpdate.every((i) => i ===  null))
            this.sourceObj.__onUpdate = [];
        }
      }];
    });
  }
  public watchFor(
    propertyName: string,
    neededValue: T
  ): Promise<T> {
    const index = this.sourceObj.__onUpdate.length;
    return new Promise((resolve) => {
      this.sourceObj.__onUpdate = [...this.sourceObj.__onUpdate, (updatedProperty) => {
        if (propertyName === updatedProperty 
          && this.sourceObj[propertyName] === neededValue) {
          resolve(this.sourceObj[propertyName]);
          this.sourceObj.__onUpdate[index] = null;

          if (this.sourceObj.__onUpdate.every((i) => i ===  null)) 
            this.sourceObj.__onUpdate = [];
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


