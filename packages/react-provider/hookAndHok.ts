import React, { useReducer, useRef, useEffect } from 'react';

import { Reaction } from 'reaction/reaction';
import { simpleHook } from './index';

function createHOCWrapper<P extends {}>(
  store: any, 
  Component: React.ComponentType
): React.FC<P> {
  const HOCWrapper: React.FC<P> = (props: P) => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const reactionRef = useRef<Reaction | null>(null);

    if (reactionRef.current === null) {
      const componentName = Component.displayName || Component.name || 'Component';
      reactionRef.current = new Reaction(`${componentName}_Observer`, forceUpdate);
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

export function repkaHookAndHoc<T extends object>(
  this: T,
  arg: React.ComponentType<any> | keyof T
): React.FC<any> | T[keyof T] {
  try {
    if (typeof arg !== 'string') return createHOCWrapper<T>(this, arg as React.ComponentType<any>); 
    else if (arg) return simpleHook<T>(this, arg as keyof T);
    else console.error(
      '[Repka] Ошибка вызова хука. Нужно указать либо функциональный компонент либо имя поля за которым хотите следить'
    );
  } catch (e) {
    console.error('[Repka] Ошибка вызова хука. Убедитесь, что state() вызывается на верхнем уровне компонента.', e);
    return this;
  }
}
