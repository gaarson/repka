import { IWatcher } from 'watcher';
export interface IRepositoryService {
    <RepositoryPort extends {
        [key: string]: unknown;
    }, Controller = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }): (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;
    keys: string[];
    actions: IWatcher<any, any>;
    initializeState<T, M>(data?: T, methods?: M, prevActions?: any): void;
    initRepository<T, M>(repo?: T, controller?: M, prevActions?: any): IWatcher<T, M>;
    __call: <RepositoryPort extends {
        [key: string]: unknown;
    }, Controller = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }) => (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;
}
export declare class RepositoryService extends Function {
    keys: string[];
    actions: IWatcher<any, any>;
    initializeState?<T, M>(data?: T, methods?: M, broadcastName?: string): void;
    initRepository?<T, M>(repo?: T, controller?: M, broadcastName?: string): IWatcher<T, M>;
    __call: <RepositoryPort extends {
        [key: string]: unknown;
    }, Controller = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }) => (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;
    constructor();
}
export declare function repositoryCreator<RepositoryPort extends {
    [key: string]: unknown;
}, Controller = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
    repo?: IRepositoryService;
}, broadcastName?: string): (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;
declare const RepkaService: IRepositoryService;
export { RepkaService };
