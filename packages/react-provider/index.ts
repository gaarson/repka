import React from 'react';
import { FIELDS_PREFIX } from 'core/domain';

export function simpleReactProvider<T extends object>(prop: keyof T): T[keyof T] {
  if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  const useSync = React.useSyncExternalStore;
  if (!useSync) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  try { // very dirty trick
    React.useId()
  } catch (error) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  const state = useSync(
    (notify) => {
      const currentProp = prop;

      if (
        this[`${FIELDS_PREFIX}listeners`][currentProp] &&
        typeof this[`${FIELDS_PREFIX}listeners`][currentProp] !== 'function'
      ) {
        this[`${FIELDS_PREFIX}listeners`][currentProp].set(notify, notify);
      }

      this[`${FIELDS_PREFIX}criticalFields`].set(notify, [currentProp]);

      this[`${FIELDS_PREFIX}muppet`].set(notify, true);

      return () => {
        this[`${FIELDS_PREFIX}muppet`].set(notify, false);

        const fields = this[`${FIELDS_PREFIX}criticalFields`].get(notify);
        if (fields) {
          fields.forEach(p => {
            if (
              this[`${FIELDS_PREFIX}listeners`][p] &&
              typeof this[`${FIELDS_PREFIX}listeners`][p] !== 'function'
            ) {
              this[`${FIELDS_PREFIX}listeners`][p].delete(notify);
            }
          });
        }

        this[`${FIELDS_PREFIX}criticalFields`].delete(notify);
        this[`${FIELDS_PREFIX}muppet`].delete(notify);
      };
    },
    () => {
      return this[`${FIELDS_PREFIX}data`];
    }
  );

  return state[prop];
}
