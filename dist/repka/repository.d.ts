import { IWatcher } from 'watcher/legacy';
export interface IRepositoryService {
    <RepositoryPort extends {
        [key: string]: unknown;
    }, Controller = undefined, Provider = ((() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort)>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }): Provider;
    keys: string[];
    actions: IWatcher<any, any>;
    initializeState<T, M>(data?: T, options?: {
        methods?: M;
        prevActions?: any;
        provider?: any;
    }): void;
    initRepository?<T, M, P>(repo?: T, options?: {
        methods?: M;
        provider?: P;
        prevActions?: any;
    }): IWatcher<T, M, P>;
    __call: <RepositoryPort extends {
        [key: string]: unknown;
    }, Controller = undefined, Provider = ((() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort)>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }) => Provider;
}
export declare class RepositoryService extends Function {
    keys: string[];
    actions: IWatcher<any, any>;
    initializeState<T, M, P>(data?: T, options?: {
        methods?: M;
        prevActions?: any;
        provider?: P;
    }): void;
    initRepository?<T, M, P>(repo?: T, options?: {
        methods?: M;
        provider?: P;
        prevActions?: any;
    }): IWatcher<T, M>;
    __call: <RepositoryPort extends {
        [key: string]: unknown;
    }, Controller = undefined>(defaultObject?: RepositoryPort, controller?: Controller & {
        repo?: IRepositoryService;
    }) => ((a: any) => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort;
    constructor();
}
interface initRepoBoundFunction {
    <T, M, P = undefined>(rp?: T, options?: {
        methods?: M;
        provider?: P;
        prevActions?: any;
    }): IWatcher<T, M, P>;
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
}, Controller = undefined, Provider = ((() => [RepositoryPort, Omit<Controller, 'repo'>]) & RepositoryPort)>(defaultObject?: RepositoryPort, controller?: Controller & {
    repo?: IRepositoryService;
}, { provider }?: {
    provider?: Provider;
    broadcastName?: string;
}): Provider;
export {};
