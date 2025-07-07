import { IWatcher, watcherCreator } from 'watcher';

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
  initializeState<T, M> (
    data?: T,  
    options?: { methods?: M, prevActions?: any, provider?: any }
  ): void;
  initRepository?<T, M> (repo?: T, options?: {
    methods?: M, provider?: any, prevActions?: any
  }): IWatcher<T, M>;

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
  initializeState<T, M>(
    data?: T,  
    options?: { methods?: M, prevActions?: any, provider?: any }
  ): void {};
  initRepository?<T, M> (repo?: T, options?: {
    methods?: M, provider?: any, prevActions?: any
  }): IWatcher<T, M>;

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
    <T, M>(rp?: T, options?: {
      methods?: M,
      provider?: any,
      prevActions?: any
    }): IWatcher<T, M>;
    call<T, M>(this: Function, ...argArray: any[]): IWatcher<T, M>;
}
export const initRepository: initRepoBoundFunction = function <T, M>(
  repo: T,
  options: {
    methods?: M,
    provider?: any,
    prevActions?: any
  } = {}
): IWatcher<T, M> {
  const keys = Object.keys(repo || {});

  const withOnUpdate: T = keys.reduce((
    prev: T, 
    curr: string
  ) => {
    let value: unknown;
    if (options.prevActions !== undefined && options.prevActions.get(curr) !== undefined) {
      value = options.prevActions.get(curr);
    } else if (repo) {
      value = repo[curr];
    }
    return { ...prev, [curr]: value };
  }, repo || {} as T);

  return watcherCreator<T, M>(
    withOnUpdate, 
    options.provider, 
    options.methods
  );
}

export const initializeState = function<T, M>(
  data?: T, 
  options: { methods?: M, prevActions?: any, provider?: any } = {}
): void {
  if (!options.prevActions) options.prevActions = this?.actions;
  if (!options.provider) options.provider = this?.actions?.savedProvider;

  const newActions = initRepository.call<T, M>(this, data, options);
  this.actions = newActions;
}

function getAllMethodNames(toCheck) {
    const props = [];
    let obj = toCheck;
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));
    
    return props.sort().filter((e, i, arr) => { 
       if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
    });
}

export function repositoryCreator<
  RepositoryPort extends { [key: string]: unknown },
  Controller = undefined,
>(
  defaultObject?: RepositoryPort,
  controller?: Controller & { repo?: IRepositoryService },
  { provider }: {
    provider?: any,
    broadcastName?: string
  } = {}
): (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort {
  let methods: Controller;
  let repo = null;

  if (controller) {
    const constructorKeys = getAllMethodNames(controller);

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
      { methods, prevActions, provider: provider || prevActions?.savedProvider || this?.actions?.savedProvider }
    );
  } else {
    repo = initRepository<RepositoryPort, Controller>(
      defaultObject, 
      { provider: provider || this?.actions?.savedProvider, methods }
    );
  }

  return (repo || controller?.repo?.actions || {}).sourceObj;
}

