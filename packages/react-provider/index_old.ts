import React from 'react';
// import { useSyncExternalStore } from 'use-sync-external-store/shim';

export function reactProvider<T, M>(parameter?: keyof T): [T, M] | React.ReactNode {
  let useSync;
  let isNewReact = false;
  let key = React.useId 
    ? React.useId()
    : React.useRef(parseInt(String((Math.random() * 10000000)), 10).toString()).current

  if (React.useId) {
    useSync = React.useSyncExternalStore;
    isNewReact = true;
  }

  const state = useSync(notify => {
    if (this.__criticalFields[key]) {
      this.__criticalFields[key].forEach(prop => {
        if (
          this.__listeners[prop] &&
          typeof this.__listeners[prop] !== 'function'
        ) this.__listeners[prop].set(key, notify);
      });
    }

    return isNewReact ? () => {
      if (this.__criticalFields[key]) {
        this.muppet[key] = false;
        this.__criticalFields[key].forEach(prop => {
          if (
            this.__listeners[prop] &&
            typeof this.__listeners[prop] !== 'function'
          ) {
            this.__listeners[prop].delete(key);
          }
        });
      }
    } : () => undefined;
  }, () => {
    this.muppet['__PROVIDER_ID__'] = key;
    
    if (this.muppet[key] === true) {
      delete this.muppet['__PROVIDER_ID__'];
      if (!isNewReact) this.muppet[key] = false;
      return isNewReact ? this.muppet.__init__ : { ...this.muppet };
    }

    return this.muppet;
  });

  React.useEffect(() => {
    return () => {
      if (this.muppet[key] && this.__criticalFields[key]) {
        if (!isNewReact) {
          this.__criticalFields[key.current].forEach(prop => {
            if (
              this.__listeners[prop] &&
              typeof this.__listeners[prop] !== 'function'
            ) {
              this.__listeners[prop].delete(key.current);
            }
          });
        }

        delete this.__criticalFields[key];
        delete this.muppet[key];
      }
    };
  }, []);

  if (parameter !== undefined) {
    return state[parameter];
  }

  return [state, this.__methods];
}
