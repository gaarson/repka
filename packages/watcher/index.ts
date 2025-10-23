import { FIELDS_PREFIX } from "core/domain";

export const watch = <T = any>(sourceObj: T, propertyName: string): Promise<T> => {
  const index = sourceObj[`${FIELDS_PREFIX}onUpdate`]?.length || 0;

  return new Promise((resolve) => {
    if (sourceObj[`${FIELDS_PREFIX}onUpdate`]) {
      sourceObj[`${FIELDS_PREFIX}onUpdate`] = [
        ...sourceObj[`${FIELDS_PREFIX}onUpdate`], 
        (updatedProperty: string, value: unknown) => {
          if (propertyName === updatedProperty) {
            resolve(value as T); 
            sourceObj[`${FIELDS_PREFIX}onUpdate`][index] = null;

            if (sourceObj[`${FIELDS_PREFIX}onUpdate`].every((i) => i ===  null))
              sourceObj[`${FIELDS_PREFIX}onUpdate`] = [];
          }
        }
      ];
    }
  });
}
