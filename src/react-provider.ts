import { useRef, useEffect } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

export function reactProvider() { 
  const key = useRef(parseInt(String((Math.random() * 10000000)), 10).toString());

  const state = useSyncExternalStore((notify: () => void) => {
    if (this.muppet[key.current]) {
      Object.keys(this.muppet[key.current]).forEach(prop => {
        if (this.__listeners[prop]) {
          this.__listeners[prop].set(key.current, notify);
        } else {
          this.__listeners[prop] = new Map([[key.current, notify]]);
        }
      });
    }
  }, () => {
    this.muppet['__PROVIDER_ID__'] = key.current;
    
    if (this.muppet[key.current]) {
      delete this.muppet['__PROVIDER_ID__'];
      return this.muppet[key.current];
    }

    return this.muppet;
  });

  useEffect(() => {
    return () => {
      if (this.muppet[key.current]) {
        Object.keys(this.muppet[key.current]).forEach(prop => {
          if (this.__listeners[prop]) {
            this.__listeners[prop].delete(key.current);
          }
        });
        delete this.muppet[key.current];
      }
    };
  }, []);

  return [state, this.__methods];
};
