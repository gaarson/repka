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

export function repkaHookAndHoc(arg: Function | string) {
  try {
    if (typeof arg !== 'string')  return createHOCWrapper(this, arg as React.ComponentType); 
    else if (typeof arg === 'string') return simpleHook(this, arg);
    else console.error(
      '[Repka] Ошибка вызова хука. Нужно указать либо функциональный компонент либо имя поля за которым хотите следить'
    );
  } catch (e) {
    console.error('[Repka] Ошибка вызова хука. Убедитесь, что state() вызывается на верхнем уровне компонента.', e);
    return this;
  }
}
