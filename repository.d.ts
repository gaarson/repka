import { ICallable, Callable, providerType } from './callable';
import { IWatcher, watcherCreatorType } from './watcher';
export type callAble<T, M = undefined, A = undefined> = T & ICallable<T, M, A>;
export declare type callType = <RepositoryPort extends {
    [key: string]: unknown;
}, Controller extends {
    repo?: IRepositoryService;
}, AddTypes = undefined>(defaultObject?: RepositoryPort, controller?: Controller, broadcastName?: string) => callAble<RepositoryPort, Controller, AddTypes>;
export interface RepositoryService extends IRepositoryService {
    <RepositoryPort extends {
        [key: string]: unknown;
    } = undefined, Controller = undefined, AddTypes = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }, broadcastName?: string): callAble<RepositoryPort, Controller, AddTypes>;
}
interface IRepositoryService extends Callable {
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
    }, AddTypes = undefined>(defaultObject?: RepositoryPort, controller?: Controller, broadcastName?: string): callAble<RepositoryPort, Controller, AddTypes>;
    initializeState<T, M>(data?: T, methods?: M, broadcastName?: string): void;
    initRepository<T, M>(repo?: T, methods?: M, broadcastName?: string): IWatcher<T, M>;
}
export declare const repositoryCreator: (provider?: providerType) => IRepositoryService;
export {};
