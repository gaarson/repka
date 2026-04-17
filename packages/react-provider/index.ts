import React from 'react';
import { SYMBOLS } from 'core/domain';
import { REACTION_STACK } from 'reaction';

import { hashUtils } from './stringHash';
import { getRenderingComponentName } from './getComponentName';
import { createRepkaError } from './domain';
import { getIsHashReady, getKnownSpamHash, PENDING_ERRORS } from './spamHash';

export const simpleHook = <T extends object>(context: T, prop: keyof T): T[keyof T] => {
  const useSync = React.useSyncExternalStore;
  if (!useSync) {
    return context[SYMBOLS.data][prop];
  }

  const subscribe = React.useCallback((notify: () => void) => {
    try {
      const currentProp = prop;

      if (
        context[SYMBOLS.listeners][currentProp] &&
        typeof context[SYMBOLS.listeners][currentProp].set === 'function'
      ) {
        context[SYMBOLS.listeners][currentProp].set(notify, notify);
      }

      if (
        context[SYMBOLS.criticalFields] &&
        typeof context[SYMBOLS.criticalFields].set === 'function'
      ) {
        context[SYMBOLS.criticalFields].set(notify, [currentProp]);
      }

      if (
        context[SYMBOLS.muppet] &&
        typeof context[SYMBOLS.muppet].set === 'function'
      ) {
        context[SYMBOLS.muppet].set(notify, true);
      }
    } catch (err) {
      console.error("Error during subscribe:", err, prop);
    }

    return () => {
      try {
        context[SYMBOLS.muppet]?.set(notify, false);

        const fields = context[SYMBOLS.criticalFields]?.get(notify);
        if (fields) {
          fields.forEach((p: keyof T) => {
            context[SYMBOLS.listeners][p as string]?.delete(notify);
          });
        }

        context[SYMBOLS.criticalFields]?.delete(notify);
        context[SYMBOLS.muppet]?.delete(notify);
      } catch (err) {
        console.error("Error during unsubscribe:", err);
      }
    };
  }, [context, prop]);

  const getSnapshot = React.useCallback(() => {
    try {
      return context[SYMBOLS.data][prop];
    } catch(error) {
      return undefined;
    }
  }, [context, prop]);

  const state = useSync(subscribe, getSnapshot, getSnapshot);

  return state as T[keyof T];
}

export function simpleReactProvider<T extends object>(this: T, prop: keyof T): T[keyof T] {
  const currentReaction = REACTION_STACK[REACTION_STACK.length - 1];
  if (currentReaction) {
    currentReaction.reportDependency(this as any, prop as string);
    return this[SYMBOLS.data][prop];
  }

  let isInReactRender = false;
  if ((React as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE) {
    if ((React as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?.H !== null) {
      isInReactRender = true;
    }
  } else if ((React as any)?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current) {
    isInReactRender = true;
  }

  if (!isInReactRender) {
    return this[SYMBOLS.data][prop];
  }

  try {
    return simpleHook<T>(this, prop);
  } catch (e: any) {
    const messageToHash = e.message.substring(0, 200);
    const messageHash = hashUtils.simpleHash(messageToHash);

    const isHashReady = getIsHashReady();
    const knownHash = getKnownSpamHash();

    if (isHashReady) {
        if (knownHash && messageHash === knownHash) {
          return this[SYMBOLS.data][prop];
        }

        const componentName = getRenderingComponentName();
        throw createRepkaError(e, componentName, knownHash, messageHash);

    } else {
        const componentName = getRenderingComponentName();
        PENDING_ERRORS.push({ error: e, hash: messageHash, component: componentName });

        return this[SYMBOLS.data][prop];
    }
  }
}
