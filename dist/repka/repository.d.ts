import { IWatcher } from 'watcher';
export interface IRepositoryService {
    <RepositoryPort extends {
        [key: string]: unknown;
    }, Controller = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }): (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;
    keys: string[];
    actions: IWatcher<any, any>;
    initializeState<T, M>(data?: T, options?: {
        methods?: M;
        prevActions?: any;
        provider?: any;
    }): void;
    initRepository?<T, M>(repo?: T, options?: {
        methods?: M;
        provider?: any;
        prevActions?: any;
    }): IWatcher<T, M>;
    __call: <RepositoryPort extends {
        [key: string]: unknown;
    }, Controller = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }) => (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;
}
export declare class RepositoryService extends Function {
    keys: string[];
    actions: IWatcher<any, any>;
    initializeState<T, M>(data?: T, options?: {
        methods?: M;
        prevActions?: any;
        provider?: any;
    }): void;
    initRepository?<T, M>(repo?: T, options?: {
        methods?: M;
        provider?: any;
        prevActions?: any;
    }): IWatcher<T, M>;
    __call: <RepositoryPort extends {
        [key: string]: unknown;
    }, Controller = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }) => (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;
    constructor();
}
interface initRepoBoundFunction {
    <T, M>(rp?: T, options?: {
        methods?: M;
        provider?: any;
        prevActions?: any;
    }): IWatcher<T, M>;
    call<T, M>(this: Function, ...argArray: any[]): IWatcher<T, M>;
}
export declare const initRepository: initRepoBoundFunction;
export declare const initializeState: <T, M>(data?: T, options?: {
    methods?: M;
    prevActions?: any;
    provider?: any;
}) => void;
export declare function repositoryCreator<RepositoryPort extends {
    [key: string]: unknown;
}, Controller = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
    repo?: IRepositoryService;
}, { provider }?: {
    provider?: any;
    broadcastName?: string;
}): (() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;
export {};
