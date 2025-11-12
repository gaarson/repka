import { ICallable } from './domain';
export interface ISource<T, P> {
    <DataType = T, Provider = P>(data: DataType, provider?: Provider): DataType;
}
export declare const createSource: <T extends {}, O extends {
    main?: (...args: any[]) => any;
    getter?: (...args: any[]) => any;
} = {}>(data: T, { main, getter }: O) => T & ICallable<ReturnType<O["main"]>, Parameters<O["main"]>>;
