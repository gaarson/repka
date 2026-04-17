type Store = {};
export declare class Reaction {
    private name;
    private scheduler;
    private dependencies;
    private isDisposed;
    constructor(name: string, scheduler: () => void);
    track<T>(fn: () => T): T;
    reportDependency(store: Store, prop: string): void;
    private subscribeToStore;
    private unsubscribeFromStore;
    private onUpdate;
    updateScheduler(scheduler: () => void): void;
    undispose(): void;
    dispose(): void;
}
export {};
