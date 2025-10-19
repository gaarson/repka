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

  try {
    React.useId();
  } catch (error) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  const state = useSync(
    (notify) => {
      try {
        const currentProp = prop;

        if (
          this[`${FIELDS_PREFIX}listeners`][currentProp] &&
          typeof this[`${FIELDS_PREFIX}listeners`][currentProp].set === 'function'
        ) {
          this[`${FIELDS_PREFIX}listeners`][currentProp].set(notify, notify);
        }

        if (
          this[`${FIELDS_PREFIX}criticalFields`] &&
          typeof this[`${FIELDS_PREFIX}criticalFields`].set === 'function'
        ) {
          this[`${FIELDS_PREFIX}criticalFields`].set(notify, [currentProp]);
        }
        
        if (
          this[`${FIELDS_PREFIX}muppet`] &&
          typeof this[`${FIELDS_PREFIX}muppet`].set === 'function'
        ) {
          this[`${FIELDS_PREFIX}muppet`].set(notify, true);
        }
      } catch (err) {
        console.error("Error during subscribe:", err, prop);
      }

      return () => {
        try {
          this[`${FIELDS_PREFIX}muppet`]?.set(notify, false);

          const fields = this[`${FIELDS_PREFIX}criticalFields`]?.get(notify);
          if (fields) {
            fields.forEach(p => {
              this[`${FIELDS_PREFIX}listeners`][p]?.delete(notify);
            });
          }

          this[`${FIELDS_PREFIX}criticalFields`]?.delete(notify);
          this[`${FIELDS_PREFIX}muppet`]?.delete(notify);
        } catch (err) {
          console.error("Error during unsubscribe:", err);
        }
      };
    },

    () => {
      try {
        return this[`${FIELDS_PREFIX}data`];
      } catch {
        return undefined;
      }
    }
  );

  return state ? state[prop] : this[`${FIELDS_PREFIX}data`][prop];
}
