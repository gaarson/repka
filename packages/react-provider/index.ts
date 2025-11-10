import React from 'react';
import { FIELDS_PREFIX } from 'core/domain';
import { REACTION_STACK } from 'reaction';

import { simpleHash } from './stringHash';
import { getRenderingComponentName } from './getComponentName';
import { KNOWN_SPAM_HASH } from './spamHash';

export function createRepkaError(
  originalError: unknown,
  componentName: string,
  spamHash: string | null,
  errorHash: string
): Error {
  const isError = originalError instanceof Error;
  const message = isError ? originalError.message : String(originalError);

  const repkaError = new Error(
    `[Repka CRITICAL ERROR in <${componentName}>] \n\n` +
    `Repka's magic getter (store.prop) caught an UNKNOWN React error. \n` +
    `This is NOT the expected 'Invalid hook call' spam. \n` +
    `(Known Spam Hash: ${spamHash}, This Error Hash: ${errorHash}) \n\n` +
    `This is likely a CRITICAL React error (e.g., 'Rendered more hooks...'). \n` +
    `Repka is crashing LOUDLY to prevent a "zombie component". \n\n` +
    `Original error: \n` +
    `> ${message}`
  );

  // @ts-ignore
  repkaError.cause = originalError;
  return repkaError;
}

export const simpleHook = <T extends object>(context: T, prop: keyof T): T[keyof T] => {
  const useSync = React.useSyncExternalStore;
  if (!useSync) {
    return context[`${FIELDS_PREFIX}data`][prop];
  }

  const state = useSync(
    (notify) => {
      try {
        const currentProp = prop;

        if (
          context[`${FIELDS_PREFIX}listeners`][currentProp] &&
          typeof context[`${FIELDS_PREFIX}listeners`][currentProp].set === 'function'
        ) {
          context[`${FIELDS_PREFIX}listeners`][currentProp].set(notify, notify);
        }

        if (
          context[`${FIELDS_PREFIX}criticalFields`] &&
          typeof context[`${FIELDS_PREFIX}criticalFields`].set === 'function'
        ) {
          context[`${FIELDS_PREFIX}criticalFields`].set(notify, [currentProp]);
        }
        
        if (
          context[`${FIELDS_PREFIX}muppet`] &&
          typeof context[`${FIELDS_PREFIX}muppet`].set === 'function'
        ) {
          context[`${FIELDS_PREFIX}muppet`].set(notify, true);
        }
      } catch (err) {
        console.error("Error during subscribe:", err, prop);
      }

      return () => {
        try {
          context[`${FIELDS_PREFIX}muppet`]?.set(notify, false);

          const fields = context[`${FIELDS_PREFIX}criticalFields`]?.get(notify);
          if (fields) {
            fields.forEach(p => {
              context[`${FIELDS_PREFIX}listeners`][p]?.delete(notify);
            });
          }

          context[`${FIELDS_PREFIX}criticalFields`]?.delete(notify);
          context[`${FIELDS_PREFIX}muppet`]?.delete(notify);
        } catch (err) {
          console.error("Error during unsubscribe:", err);
        }
      };
    },
    () => {
      try {
        return context[`${FIELDS_PREFIX}data`];
      } catch(error) {
        return {} as T;
      }
    },
    () => {
      try {
        return context[`${FIELDS_PREFIX}data`];
      } catch (error) {
        return {} as T;
      }
    }
  );

  // @ts-ignore
  return state ? state[prop] : context[`${FIELDS_PREFIX}data`][prop];
}

export function simpleReactProvider<T extends object>(this: T, prop: keyof T): T[keyof T] {
  const currentReaction = REACTION_STACK[REACTION_STACK.length - 1];
  if (currentReaction) {
    currentReaction.reportDependency(this, prop as string);
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  let isInReactRender = false;
  if (React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE) {
    if (React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?.H !== null) {
      isInReactRender = true;
    }
  } else if (React?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current) {
    isInReactRender = true;
  }

  if (!isInReactRender) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  try {
    return simpleHook<T>(this, prop);
  } catch (e) {
    if (!(e instanceof Error)) {
      throw e;
    }

    const messageToHash = e.message.substring(0, 200);
    const messageHash = simpleHash(messageToHash);

    if (KNOWN_SPAM_HASH && messageHash === KNOWN_SPAM_HASH) {
      return this[`${FIELDS_PREFIX}data`][prop];
    }
    
    const componentName = getRenderingComponentName();
    throw createRepkaError(e, componentName, KNOWN_SPAM_HASH, messageHash);
  }
}
