import { watcherObjType, ICallable, Callable, providerType } from './callable';
import { IWatcher, watcherCreatorType, watcherCreator } from './watcher';
import { reactProvider } from './react-provider';

export type callAble<T, M = undefined, A = undefined> = T & ICallable<T, M, A>;

export declare type callType = <RepositoryPort extends {
    [key: string]: unknown;
}, Controller extends {
    repo?: IRepositoryService;
}, AddTypes = undefined>(
  defaultObject?: RepositoryPort, 
  controller?: Controller, 
  broadcastName?: string
) => callAble<RepositoryPort, Controller, AddTypes>;

export interface RepositoryService extends IRepositoryService {
  <
  RepositoryPort extends { [key: string]: unknown; } = undefined,
    Controller = undefined,
    AddTypes = undefined
  >(
    defaultObject?: RepositoryPort,
    controller?: Controller & { repo?: IRepositoryService; },
    broadcastName?: string
  ): callAble<RepositoryPort, Controller, AddTypes>;
}

export interface IRepositoryService extends Callable {
  actions: IWatcher<any, any>;
  __call: callType;
  initializeState<T, M>
    (data?: T, methods?: M, broadcastName?: string): void;
  initRepository<T, M>
    (repo?: T, controller?: M, broadcastName?: string): IWatcher<T, M>;
}

export class RepositoryClass extends Callable implements IRepositoryService {
  actions: IWatcher<any, any>;

  constructor(
    private readonly _watcherFactory?: watcherCreatorType, 
    private readonly _provider?: providerType
  ) {
    super();
    this.actions = this.initRepository();
  }

  private keys: string[] = [];

  __call<
    RepositoryPort extends { [key: string]: unknown },
    Controller extends { repo?: IRepositoryService },
    AddTypes = undefined
  >(
    defaultObject?: RepositoryPort,
    controller?: Controller,
    broadcastName?: string
  ): callAble<RepositoryPort, Controller, AddTypes> {
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

      controller.repo = {
        initializeState: this.initializeState,
        initRepository: this.initRepository,
        ...this,
        ...(controller.repo ? controller.repo : {})
      };
      controller.repo.initializeState<RepositoryPort, Controller>(
        controller.repo ? { ...controller.repo.actions.get(), ...defaultObject } : defaultObject,
        methods,
        broadcastName
      );
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
    const newActions = this.initRepository<T, M>(data, methods, broadcastName);
    newActions.sourceObj.__onUpdate = [...this.actions.sourceObj.__onUpdate];
    
    this.actions = newActions;
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
      this._provider,
      methods, 
      broadcastName
    );
  }
}

export const repositoryCreator = (provider?: providerType): IRepositoryService => {
  return new RepositoryClass(watcherCreator, provider || reactProvider);
}
