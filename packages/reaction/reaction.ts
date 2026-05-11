import { SYMBOLS } from "core/domain";
import { REACTION_STACK } from "reaction";

type Store = {
  [SYMBOLS.onUpdate]: Set<(prop: string, value: unknown, obj: any) => void>;
};

export class Reaction {
  private name: string;
  private scheduler: () => void;
  private dependencies = new Map<Store, Set<string>>();
  private isDisposed = false;

  constructor(name: string, scheduler: () => void) {
    this.name = name;
    this.scheduler = scheduler;
  }

  track<T>(fn: () => T): T {
    if (this.isDisposed) return fn();

    for (const store of this.dependencies.keys()) {
       this.unsubscribeFromStore(store);
    }
    this.dependencies.clear();

    REACTION_STACK.push(this);
    try {
      return fn();
    } finally {
      REACTION_STACK.pop();
    }
  }

  reportDependency(store: Store, prop: string) {
    if (this.isDisposed) return;

    let deps = this.dependencies.get(store);
    if (!deps) {
      deps = new Set();
      this.dependencies.set(store, deps);
      this.subscribeToStore(store);
    }
    deps.add(prop);
  }

  private subscribeToStore(store: Store) {
    const onUpdateSet = store[SYMBOLS.onUpdate];
    if (onUpdateSet) {
      onUpdateSet.add(this.onUpdate);
    }
  }

  private unsubscribeFromStore(store: Store) {
    const onUpdateSet = store[SYMBOLS.onUpdate];
    if (onUpdateSet) {
      onUpdateSet.delete(this.onUpdate);
    }
  }

  private onUpdate = (updatedProp: string, value: unknown, store: Store) => {
    const props = this.dependencies.get(store);
    if (props && props.has(updatedProp)) {
      this.scheduler();
    }
  }

  updateScheduler(scheduler: () => void) {
    this.scheduler = scheduler;
  }

  undispose() {
    if (!this.isDisposed) return;
    this.isDisposed = false;
    
    for (const store of this.dependencies.keys()) {
      this.subscribeToStore(store);
    }
  }

  dispose() {
    if (this.isDisposed) return;

    for (const store of this.dependencies.keys()) {
      this.unsubscribeFromStore(store);
    }
    
    this.isDisposed = true;
  }
}
