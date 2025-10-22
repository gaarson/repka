import React from 'react';
import { FIELDS_PREFIX } from 'core/domain';
import { REACTION_STACK } from 'reaction';

let hasWarned = false;

export const simpleHook = <T extends object>(context: any, prop: keyof T): T[keyof T] => {
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
        return {};
      }
    },
    () => {
      try {
        return context[`${FIELDS_PREFIX}data`];
      } catch (error) {
        return {};
      }
    }
  );

  return state ? state[prop] : context[`${FIELDS_PREFIX}data`][prop];
}

export function simpleReactProvider<T extends object>(prop: keyof T): T[keyof T] {
  let isInReactRender = false;

  if (!hasWarned) {
    console.warn(`[Repka] ВНИМАНИЕ: Обнаружен прямой доступ к 'state.${String(prop)}' в рендере...`);

    hasWarned = true;
  }

  if (React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE) {
    if (React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?.H !== null) {
      isInReactRender = true;
    }
  } else if (React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current) {
      isInReactRender = true;
  }

  if (!isInReactRender) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  const currentReaction = REACTION_STACK[REACTION_STACK.length - 1];
  if (currentReaction) {
    currentReaction.reportDependency(this, prop as string);
    return this[`${FIELDS_PREFIX}data`][prop];
  }
  
  try {
    React.useId();
  } catch (error) {
    return this[`${FIELDS_PREFIX}data`][prop];
  }

  return simpleHook<T>(this, prop)
}
