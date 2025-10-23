import { FIELDS_PREFIX } from "core/domain";
import { REACTION_STACK } from "reaction";

type Store = {
  [`__REPO__onUpdate`]: ((prop: string, value: unknown) => void)[];
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

    for (const props of this.dependencies.values()) {
      props.clear();
    }

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

      store[`${FIELDS_PREFIX}onUpdate`].push(this.onUpdate); 
    }
    deps.add(prop);
  }

  private onUpdate = (updatedProp: string, value: unknown) => {
    for (const [,props] of this.dependencies.entries()) {
      if (props.has(updatedProp)) {
        this.scheduler();
        return; 
      }
    }
  }

  updateScheduler(scheduler: () => void) {
    this.scheduler = scheduler;
  }
  undispose() {
    this.isDisposed = false;
  }

  dispose() {
    if (this.isDisposed) return;

    for (const store of this.dependencies.keys()) {
      const index = store[`${FIELDS_PREFIX}onUpdate`].indexOf(this.onUpdate);
      if (index > -1) {
        store[`${FIELDS_PREFIX}onUpdate`].splice(index, 1);
      }
    }
    this.dependencies.clear();
    this.isDisposed = true;
  }
}
