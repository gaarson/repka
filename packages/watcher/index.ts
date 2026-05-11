import { SYMBOLS } from "core/domain";

export const watch = <T = any>(sourceObj: T, propertyName: string): Promise<T> => {
  return new Promise((resolve) => {
    const listenersSet = sourceObj[SYMBOLS.onUpdate] as Set<Function>;
    
    if (!listenersSet) {
      return;
    }

    const handler = (updatedProperty: string, value: unknown) => {
      if (propertyName === updatedProperty) {
        resolve(value as T);
        listenersSet.delete(handler);
      }
    };

    listenersSet.add(handler);
  });
}
