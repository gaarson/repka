import React from 'react';
import { FIELDS_PREFIX } from 'core/domain';

export function simpleReactProvider<T>(prop: keyof T): T  {
  if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  let useSync;
  let key;

  try {
    key = React.useId 
      ? React.useId()
      : React.useRef(parseInt(String((Math.random() * 10000000)), 10).toString()).current

    if (React.useId) {
      useSync = React.useSyncExternalStore;
    }
  } catch (error) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  const state = useSync(notify => {
    if (this[`${FIELDS_PREFIX}criticalFields`][key]) {
      this[`${FIELDS_PREFIX}criticalFields`][key].forEach(prop => {
        if (
          this[`${FIELDS_PREFIX}listeners`][prop] &&
          typeof this[`${FIELDS_PREFIX}listeners`][prop] !== 'function'
        ) this[`${FIELDS_PREFIX}listeners`][prop].set(key, notify);
      });
    } else {
      this[`${FIELDS_PREFIX}criticalFields`][key] = [prop]

      this[`${FIELDS_PREFIX}criticalFields`][key].forEach(prop => {
        if (
          this[`${FIELDS_PREFIX}listeners`][prop] &&
          typeof this[`${FIELDS_PREFIX}listeners`][prop] !== 'function'
        ) this[`${FIELDS_PREFIX}listeners`][prop].set(key, notify);
      });
    }

    return () => {
      if (this[`${FIELDS_PREFIX}criticalFields`][key]) {
        this[`${FIELDS_PREFIX}muppet`][key] = false;
        this[`${FIELDS_PREFIX}criticalFields`][key].forEach(prop => {
          if (
            this[`${FIELDS_PREFIX}listeners`][prop] &&
            typeof this[`${FIELDS_PREFIX}listeners`][prop] !== 'function'
          ) {
            this[`${FIELDS_PREFIX}listeners`][prop].delete(key);
          }
        });
      }
    };
  }, () => {
    return this[`${FIELDS_PREFIX}data`];
  });

  React.useEffect(() => {
    return () => {
      if (this[`${FIELDS_PREFIX}muppet`][key] !== undefined 
          && this[`${FIELDS_PREFIX}criticalFields`][key] !== undefined) {
        this[`${FIELDS_PREFIX}criticalFields`][key].forEach(prop => {
          if (
            this[`${FIELDS_PREFIX}listeners`][prop] &&
            typeof this[`${FIELDS_PREFIX}listeners`][prop] !== 'function'
          ) this[`${FIELDS_PREFIX}listeners`][prop].delete(key);
        });

        delete this[`${FIELDS_PREFIX}criticalFields`][key];
        delete this[`${FIELDS_PREFIX}muppet`][key];
      }
    };
  }, [key]);

  return state[prop];
}
