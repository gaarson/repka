import { FIELDS_PREFIX } from "core/domain";

export const watch = <T = any>(sourceObj: T, propertyName: string): Promise<T> => {
  const index = sourceObj[`${FIELDS_PREFIX}onUpdate`].length;

  return new Promise((resolve) => {
    sourceObj[`${FIELDS_PREFIX}onUpdate`] = [
      ...sourceObj[`${FIELDS_PREFIX}onUpdate`], 
      (updatedProperty: string) => {
        if (propertyName === updatedProperty) {
          resolve(sourceObj[propertyName]);
          sourceObj[`${FIELDS_PREFIX}onUpdate`][index] = null;

          if (sourceObj[`${FIELDS_PREFIX}onUpdate`].every((i) => i ===  null))
            sourceObj[`${FIELDS_PREFIX}onUpdate`] = [];
        }
      }
    ];
  });
}
