import { Callable, ICallable, providerType } from './callable';
import { IWatcher, watcherCreatorType } from './watcher';
export declare type callType = <RepositoryPort extends {
    [key: string]: unknown;
}, Controller extends {
    repo?: IRepositoryService;
}, AddTypes = undefined>(defaultObject?: RepositoryPort, controller?: Controller, broadcastName?: string) => RepositoryPort;
export interface RepositoryService<O = { [key: string]: any }, C = undefined> extends Callable {
    <
        RepositoryPort extends { [key: string]: unknown; } = undefined, 
        Controller = undefined, 
        AddTypes = undefined
    >(
        defaultObject?: RepositoryPort, 
        controller?: Controller & { repo?: RepositoryService; }, 
        broadcastName?: string
    ):  RepositoryPort & ICallable<RepositoryPort, Controller>;
    new (_watcherFactory?: watcherCreatorType, _provider?: providerType);
    actions: IWatcher<O, C>;
    _call: callType;
    initializeState<T = {
        [key: string]: unknown;
    }, M = undefined>(data?: T, methods?: M): void;
    initRepository<T = {
        [key: string]: unknown;
    }, M = undefined>(repo?: T, controller?: M): IWatcher<T, M>;
    convertToObject<RepositoryPort>(): RepositoryPort;
}

interface IRepositoryService {
    actions: IWatcher<unknown, unknown>;
    _call: callType;
    initializeState<T = {
        [key: string]: unknown;
    }, M = undefined>(data?: T, methods?: M): void;
    initRepository<T = {
        [key: string]: unknown;
    }, M = undefined>(repo?: T, controller?: M): IWatcher<T, M>;
    convertToObject<RepositoryPort>(): RepositoryPort;
}

export declare class RepositoryClass extends Callable implements IRepositoryService {
    private readonly _watcherFactory?;
    private readonly _provider?;
    constructor(_watcherFactory?: watcherCreatorType, _provider?: providerType);
    private keys;
    private provider;
    actions: IWatcher<unknown, unknown>;
    _call<RepositoryPort extends {
        [key: string]: unknown;
    }, Controller extends {
        repo?: IRepositoryService;
    }, AddTypes = undefined>(defaultObject?: RepositoryPort, controller?: Controller, broadcastName?: string): RepositoryPort;
    initializeState<T = {
        [key: string]: unknown;
    }, M = undefined>(data?: T, methods?: M): void;
    initRepository<T = {
        [key: string]: unknown;
    }, M = undefined>(repo?: T, methods?: M): IWatcher<T, M>;
    convertToObject<RepositoryPort>(): RepositoryPort;
}

export {};
