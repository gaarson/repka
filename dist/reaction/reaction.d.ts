type Store = {
    [`__REPO__onUpdate`]?: ((prop: string, value: unknown, obj: any) => void)[];
};
export declare class Reaction {
    private name;
    private scheduler;
    private dependencies;
    private isDisposed;
    constructor(name: string, scheduler: () => void);
    track<T>(fn: () => T): T;
    reportDependency(store: Store, prop: string): void;
    private onUpdate;
    updateScheduler(scheduler: () => void): void;
    undispose(): void;
    dispose(): void;
}
export {};
