import { providerType, FIELDS_PREFIX } from 'core';
import { IWatcher, watcherCreator } from 'watcher';
import { reactProvider } from 'react-provider';

export type callAble<T, M = undefined, A = undefined> = providerType<T, M>;

export interface IRepositoryService {
  keys: string[];
  actions: IWatcher<any, any>;
  initializeState<T, M> (data?: T, methods?: M, broadcastName?: string): void;
  initRepository<T, M> (repo?: T, controller?: M, broadcastName?: string): IWatcher<T, M>;
}
export function repositoryCreator<
  RepositoryPort extends { [key: string]: unknown },
  Controller = undefined,
  AddTypes = undefined
>(
  defaultObject?: RepositoryPort,
  controller?: Controller & { repo?: IRepositoryService },
  broadcastName?: string
): callAble<RepositoryPort, Controller, AddTypes> {
  let methods: Controller;
  let repo = null;
  let keys: string[] = [];

  const initRepository = <T, M>(rp?: T, m?: M): IWatcher<T, M> => {
    keys = Object.keys(repo || {});

    const withOnUpdate: T = keys.reduce((
      prev: T, 
      curr: string
    ) => {
      let value: unknown;

      if (actions !== undefined && actions.get(curr) !== undefined) {
        value = actions.get(curr);
      } else if (rp) {
        value = rp[curr];
      }

      return {
        ...prev,
        [curr]: value,
      };
    }, rp || {} as T);

    return watcherCreator<T, M>(withOnUpdate, reactProvider, m, broadcastName);
  }

  let actions: IWatcher<any, any> = initRepository({});

  const initializeState = <T, M>(data?: T, m?: M): void => {
    const newActions = initRepository<T, M>(data, m);
    newActions.sourceObj[`${FIELDS_PREFIX}onUpdate`] = [...actions.sourceObj[`${FIELDS_PREFIX}onUpdate`]];
    
    actions = newActions;
  }

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
      initializeState, initRepository, keys, actions,
      ...(controller.repo ? controller.repo : {})
    };
    controller.repo.initializeState<RepositoryPort, Controller>(
      controller.repo ? { ...controller.repo.actions.get(), ...defaultObject } : defaultObject,
      methods,
      broadcastName
    );
  } else {
    repo = initRepository<RepositoryPort, Controller>(defaultObject);
  }

  return (repo || controller?.repo?.actions || {}).sourceObj;
}
