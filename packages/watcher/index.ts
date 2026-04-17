import { FIELDS_PREFIX, SYMBOLS } from "core/domain";

export const watch = <T = any>(sourceObj: T, propertyName: string): Promise<T> => {
  const index = sourceObj[SYMBOLS.onUpdate]?.length || 0;

  return new Promise((resolve) => {
    if (sourceObj[SYMBOLS.onUpdate]) {
      sourceObj[SYMBOLS.onUpdate] = [
        ...sourceObj[SYMBOLS.onUpdate], 
        (updatedProperty: string, value: unknown) => {
          if (propertyName === updatedProperty) {
            resolve(value as T); 
            sourceObj[SYMBOLS.onUpdate][index] = null;

            if (sourceObj[SYMBOLS.onUpdate].every((i) => i ===  null))
              sourceObj[SYMBOLS.onUpdate] = [];
          }
        }
      ];
    }
  });
}

