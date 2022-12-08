import { watcherObjType, ICallable, Callable, providerType } from './callable';
import { IWatcher, watcherCreatorType } from './watcher';

export type callAble<T, M = undefined> = T & ICallable<T, M>;

export declare type callType = <RepositoryPort extends {
    [key: string]: unknown;
}, Controller extends {
    repo?: IRepositoryService;
}, AddTypes = undefined>(
  defaultObject?: RepositoryPort, 
  controller?: Controller, 
  broadcastName?: string
) => callAble<RepositoryPort, Controller>;

export interface RepositoryService extends IRepositoryService {
  <
  RepositoryPort extends { [key: string]: unknown; } = undefined,
    Controller = undefined,
    AddTypes = undefined
  >(
      defaultObject?: RepositoryPort,
      controller?: Controller & { repo?: IRepositoryService; },
      broadcastName?: string
  ): callAble<RepositoryPort, Controller>;
}

interface IRepositoryService extends Callable {
  actions: IWatcher<any, any>;
  __call: callType;
  initializeState<T, M>
    (data?: T, methods?: M, broadcastName?: string): void;
  initRepository<T, M>
    (repo?: T, controller?: M, broadcastName?: string): IWatcher<T, M>;
}

export class RepositoryClass extends Callable implements IRepositoryService {
  constructor(
    private readonly _watcherFactory?: watcherCreatorType, 
    private readonly _provider?: providerType
  ) {
    super();
    this.provider = _provider;
    this.actions = this.initRepository();
  }

  private keys: string[] = [];
  private provider: providerType; 

  actions: IWatcher<any, any>;

  __call<
    RepositoryPort extends { [key: string]: unknown },
    Controller extends { repo?: IRepositoryService },
    AddTypes = undefined
  >(
    defaultObject?: RepositoryPort,
    controller?: Controller,
    broadcastName?: string
  ): callAble<RepositoryPort, Controller> {
    let methods = undefined;
    let repo = null;

    if (controller) {
      const constructorKeys = controller.constructor.name === 'Object' 
        ? Object.keys(controller) 
        : Object.getOwnPropertyNames(Object.getPrototypeOf(controller));

      methods = constructorKeys.reduce(
        (prev, curr) => (curr !== 'constructor' && typeof controller[curr] === 'function') 
          ? { ...prev, [curr]: controller[curr].bind(controller) }
          : prev,
        {} as Controller
      );

      if (controller.repo) {
        controller.repo.initializeState<RepositoryPort, Controller>(
          defaultObject, 
          methods,
          broadcastName
        );
      } else {
        controller.repo = this;
        controller.repo.initializeState<RepositoryPort, Controller>(
          defaultObject, 
          methods,
          broadcastName
        );
      }
    } else {
      repo = this.initRepository<RepositoryPort, Controller>(
        defaultObject, 
        methods, 
        broadcastName
      );
    }

    return (repo || controller.repo.actions).sourceObj;
  }

  initializeState<T, M>(
    data?: T, 
    methods?: M,
    broadcastName?: string
  ): void {
    this.actions = this.initRepository<T, M>(data, methods, broadcastName);
  }

  initRepository<T, M>(
    repo?: T,
    methods?: M,
    broadcastName?: string
  ): IWatcher<T, M> {
    this.keys = Object.keys(repo || {});

    const withOnUpdate: watcherObjType<T> = this.keys.reduce((prev, curr) => {
      let value: unknown;

      if (this.actions !== undefined && this.actions.get(curr) !== undefined) {
        value = this.actions.get(curr);
      } else {
        value = repo[curr];
      }

      return {
        ...prev,
        [curr]: value,
      };
    }, repo || {} as watcherObjType<T>);

    return this._watcherFactory<T, M>(
      withOnUpdate, 
      this.provider,
      methods, 
      broadcastName
    );
  }
}

export function repositoryCreator(
  _watcherFactory?: watcherCreatorType, 
  _provider?: providerType
): IRepositoryService {
  return new RepositoryClass(_watcherFactory, _provider);
}
