import { providerType } from 'core';
import { IWatcher } from 'watcher';
export type callAble<T, M = undefined, A = undefined> = providerType<T, M>;
export interface IRepositoryService {
    keys: string[];
    actions: IWatcher<any, any>;
    initializeState<T, M>(data?: T, methods?: M, broadcastName?: string): void;
    initRepository<T, M>(repo?: T, controller?: M, broadcastName?: string): IWatcher<T, M>;
}
export declare function repositoryCreator<RepositoryPort extends {
    [key: string]: unknown;
}, Controller = undefined, AddTypes = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
    repo?: IRepositoryService;
}, broadcastName?: string): callAble<RepositoryPort, Controller, AddTypes>;
