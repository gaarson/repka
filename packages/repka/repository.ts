import { FIELDS_PREFIX } from 'core';
import { IWatcher, watcherCreator } from 'watcher';
import { reactProvider } from 'react-provider';

export interface IRepositoryService {
  <
    RepositoryPort extends { [key: string]: unknown },
    Controller = undefined,
  >(
    defaultObject?: RepositoryPort,
    controller?: Controller & { repo?: IRepositoryService },
  ): (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;

  keys: string[];
  actions: IWatcher<any, any>;
  initializeState<T, M> (data?: T, methods?: M, prevActions?: any): void;
  initRepository<T, M> (repo?: T, controller?: M, prevActions?: any): IWatcher<T, M>;
  __call: <
    RepositoryPort extends { [key: string]: unknown },
    Controller = undefined,
  >(
    defaultObject?: RepositoryPort,
    controller?: Controller & { repo?: IRepositoryService },
  ) => (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;
}

export class RepositoryService extends Function {
  keys: string[];
  actions: IWatcher<any, any>;
  initializeState?<T, M> (data?: T, methods?: M, broadcastName?: string): void;
  initRepository?<T, M> (repo?: T, controller?: M, broadcastName?: string): IWatcher<T, M>;
  __call: <
    RepositoryPort extends { [key: string]: unknown },
    Controller = undefined,
  >(
    defaultObject?: RepositoryPort,
    controller?: Controller & { repo?: IRepositoryService },
  ) => (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;

  constructor() {
    super();
    let closure = undefined;
    closure = (...args: any) => { 
      return closure.__call(...args); 
    };
    return Object.setPrototypeOf(closure, new.target.prototype);
  }
}

interface initRepoBoundFunction {
    <T, M>(rp?: T, m?: M, prevActions?: any): IWatcher<T, M>;
    call<T, M>(this: Function, ...argArray: any[]): IWatcher<T, M>;
}
const initRepository: initRepoBoundFunction = function <T, M>(rp?: T, m?: M, prevActions?: any): IWatcher<T, M> {
  const keys = Object.keys(rp || {});

  const withOnUpdate: T = keys.reduce((
    prev: T, 
    curr: string
  ) => {
    let value: unknown;
    if (prevActions !== undefined && prevActions.get(curr) !== undefined) {
      value = prevActions.get(curr);
    } else if (rp) {
      value = rp[curr];
    }

    return { ...prev, [curr]: value };
  }, rp || {} as T);

  return watcherCreator<T, M>(withOnUpdate, reactProvider, m);
}

const initializeState = function<T, M>(data?: T, methods?: M, prevActions?: any): void {
  const newActions = initRepository.call<T, M>(this, data, methods, prevActions);
  this.actions = newActions;
}

export function repositoryCreator<
  RepositoryPort extends { [key: string]: unknown },
  Controller = undefined,
>(
  defaultObject?: RepositoryPort,
  controller?: Controller & { repo?: IRepositoryService },
  broadcastName?: string
): (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort {
  let methods: Controller;
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

    const prevActions = controller.repo?.actions;
    controller.repo = new RepositoryService() as IRepositoryService;
    controller.repo.initRepository = initRepository;
    controller.repo.initializeState = initializeState;
    controller.repo.initializeState<RepositoryPort, Controller>(
      prevActions ? { ...prevActions.get(), ...defaultObject } : defaultObject,
      methods,
      prevActions
    );
  } else {
    repo = initRepository<RepositoryPort, Controller>(defaultObject);
  }

  return (repo || controller?.repo?.actions || {}).sourceObj;
}

const RepkaService: IRepositoryService = new RepositoryService() as IRepositoryService;

RepkaService.initRepository = initRepository;
RepkaService.initializeState = initializeState;
RepkaService.actions = initRepository({});
RepkaService.__call = repositoryCreator;

export { RepkaService };

