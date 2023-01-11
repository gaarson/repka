import { ICallable, Callable, providerType } from './callable';
import { IWatcher, watcherCreatorType } from './watcher';
export type callAble<T, M = undefined> = T & ICallable<T, M>;
export declare type callType = <RepositoryPort extends {
    [key: string]: unknown;
}, Controller extends {
    repo?: IRepositoryService;
}, AddTypes = undefined>(defaultObject?: RepositoryPort, controller?: Controller, broadcastName?: string) => callAble<RepositoryPort, Controller>;
export interface RepositoryService extends IRepositoryService {
    <RepositoryPort extends {
        [key: string]: unknown;
    } = undefined, Controller = undefined, AddTypes = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }, broadcastName?: string): callAble<RepositoryPort, Controller>;
}
export interface IRepositoryService extends Callable {
    actions: IWatcher<any, any>;
    __call: callType;
    initializeState<T, M>(data?: T, methods?: M, broadcastName?: string): void;
    initRepository<T, M>(repo?: T, controller?: M, broadcastName?: string): IWatcher<T, M>;
}
export declare class RepositoryClass extends Callable implements IRepositoryService {
    private readonly _watcherFactory?;
    private readonly _provider?;
    actions: IWatcher<any, any>;
    constructor(_watcherFactory?: watcherCreatorType, _provider?: providerType);
    private keys;
    __call<RepositoryPort extends {
        [key: string]: unknown;
    }, Controller extends {
        repo?: IRepositoryService;
    }, AddTypes = undefined>(defaultObject?: RepositoryPort, controller?: Controller, broadcastName?: string): callAble<RepositoryPort, Controller>;
    initializeState<T, M>(data?: T, methods?: M, broadcastName?: string): void;
    initRepository<T, M>(repo?: T, methods?: M, broadcastName?: string): IWatcher<T, M>;
}
export declare function repositoryCreator(_watcherFactory?: watcherCreatorType, _provider?: providerType): IRepositoryService;
