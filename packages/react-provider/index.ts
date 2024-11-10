import React from 'react';
import { FIELDS_PREFIX } from 'core';

export type reactProviderType<T, M> = (parameter?: keyof T) => [T, M] | T[keyof T];

export function reactProvider<T, M>(parameter?: keyof T): [T, M] {
  let useSync;
  let key = React.useId 
    ? React.useId()
    : React.useRef(parseInt(String((Math.random() * 10000000)), 10).toString()).current

  if (React.useId) {
    useSync = React.useSyncExternalStore;
  }

  const state = useSync(notify => {
    if (this[`${FIELDS_PREFIX}criticalFields`][key]) {
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
    this[`${FIELDS_PREFIX}muppet`]['__PROVIDER_ID__'] = key;

    if (this[`${FIELDS_PREFIX}muppet`][key] === true) {
      this[`${FIELDS_PREFIX}muppet`]['__PROVIDER_ID__'] = undefined;
      return this[`${FIELDS_PREFIX}data`];
    }

    return this;
  });

  React.useEffect(() => {
    return () => {
      if (this[`${FIELDS_PREFIX}muppet`][key] && this[`${FIELDS_PREFIX}criticalFields`][key]) {
        delete this[`${FIELDS_PREFIX}criticalFields`][key];
        delete this[`${FIELDS_PREFIX}muppet`][key];
      }
    };
  }, []);

  if (parameter !== undefined) {
    return state[parameter];
  }

  return [state, this[`${FIELDS_PREFIX}methods`]];
}
