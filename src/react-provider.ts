import { useRef } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

export function reactProvider() { 
  const key = useRef(parseInt(String((Math.random() * 10000000)), 10).toString());

  const state = useSyncExternalStore((notify) => {
    if (this.muppet[key.current]) {
      this.muppet[key.current] = {
        ...this.muppet[key.current],
        __notify__: notify
      };
    }

    return () => {
      if (this.muppet[key.current] && this.muppet[key.current]['__notify__']) {
        delete this.muppet[key.current]['__notify__'];
      }
    };
  }, () => {
    this.muppet['__PROVIDER_ID__'] = key.current;
    
    if (this.muppet[key.current]) {
      delete this.muppet['__PROVIDER_ID__'];
      return this.muppet[key.current].select;
    }

    return this.muppet;
  });

  return [state, this.methods];
};
