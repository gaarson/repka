export type reactProviderType<T, M> = (parameter?: keyof T) => [T, M] | T[keyof T];
export declare function reactProvider<T, M>(parameter?: keyof T): [T, M];
