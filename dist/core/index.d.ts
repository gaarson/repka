import { ICallable } from './domain';
export declare const createSource: <T extends {}, O extends {
    main?: (...args: any[]) => any;
    getter?: (...args: any[]) => any;
} = {}>(data: T, { main, getter }: O) => T & ICallable<ReturnType<NonNullable<O["main"]>>, Parameters<NonNullable<O["main"]>>>;
