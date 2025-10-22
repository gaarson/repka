import React, { useReducer, useRef, useEffect } from 'react';

import { Reaction } from 'reaction/reaction';
import { simpleHook } from './index';

function createHOCWrapper(store: any, Component: React.ComponentType) {
const HOCWrapper: React.FC<any> = (props) => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const reactionRef = useRef<Reaction | null>(null);

    if (reactionRef.current === null) {
      reactionRef.current = new Reaction(`${Component.name}_Observer`, forceUpdate);
    }

    reactionRef.current.updateScheduler(forceUpdate);

    useEffect(() => {
      reactionRef.current.undispose();
      return () => reactionRef.current.dispose();
    }, [reactionRef.current]);

    return reactionRef.current.track(() => {
      return Component(props);
    });
  };

  HOCWrapper.displayName = `RepkaObserver(${Component.displayName || Component.name})`;
  return HOCWrapper;
}

function isReactComponent(arg: Function): boolean {
  return typeof arg === 'function' && /^[A-Z]/.test(arg.name);
}

export function repkaHookAndHoc(arg?: Function | string) {
  if (arg && typeof arg !== 'string') {
    return createHOCWrapper(this, arg as React.ComponentType);
  }

  try {
    return simpleHook(this, typeof arg);
  } catch (e) {
    console.error('[Repka] Ошибка вызова хука. Убедитесь, что state() вызывается на верхнем уровне компонента.', e);
    return this;
  }
}
