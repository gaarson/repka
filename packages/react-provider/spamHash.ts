import { createSource } from 'core';
import { watch } from 'watcher'

import React from 'react';
import { hashUtils } from './stringHash';
import { createRepkaError } from './domain';

export let KNOWN_SPAM_HASH: string | null = null;
let isHashReady = false;
export const PENDING_ERRORS: Array<{ error: Error, hash: string, component: string }> = [];

export const getIsHashReady = () => isHashReady;
export const getKnownSpamHash = () => KNOWN_SPAM_HASH;
export const __SET_SPAM_HASH_FOR_TESTS__ = (hash: string | null) => {
  KNOWN_SPAM_HASH = hash;
  if (hash) {
    isHashReady = true;
    processPendingErrors();
  } else {
    isHashReady = false; 
  }
}
export function getSpamHash() {
  return KNOWN_SPAM_HASH;
}
export const store = createSource({ err: null }, {});
const BrokenComponent = () => {
  const func = async () => {
    const ref = await import('react')
    ref?.useSyncExternalStore()
  }
  func().catch((err) => {
    store.err = err
  }).catch(() => {});

  return null;
};

function processPendingErrors() {
    if (!KNOWN_SPAM_HASH) return; 

    isHashReady = true; 

    while (PENDING_ERRORS.length > 0) {
        const { error, hash, component } = PENDING_ERRORS.shift()!;

        if (hash !== KNOWN_SPAM_HASH) {
            const repkaError = createRepkaError(error, component, KNOWN_SPAM_HASH, hash);
            console.error(repkaError);
        }
    }
}

const cleanErrorMessage = (message: string | Event): string => {
  let str = message.toString();
  str = str.replace(/^(Uncaught )?Error: /, '');
  return str;
};

export function runServerCheck(): Promise<string | false> {
  return new Promise(async (resolve, reject) => {
    const { renderToString } = await import('react-dom/server');

    try {
      watch(store, 'err').then((message) => {
        const errorString = String(message);
        const isTargetError = errorString.includes('Invalid hook call') ||
                            errorString.includes('Minified React error');

        if (isTargetError && !KNOWN_SPAM_HASH) {
          const cleanMessage = cleanErrorMessage(errorString);
          KNOWN_SPAM_HASH = hashUtils.simpleHash(cleanMessage.substring(0, 200));
          processPendingErrors();
          resolve(KNOWN_SPAM_HASH);
          return;
        }
        resolve(false);
      }).catch(reject);

      renderToString(React.createElement(BrokenComponent));

    } catch (error) {
      reject(error);
    }
  });
}
export async function runClientCheck() {
  try {
    const { createRoot } = await import('react-dom/client');

    const tempDiv = document.createElement('div');
    tempDiv.id = 'react-error-test-rig';
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);
    const root = createRoot(tempDiv);

    const originalConsoleError = console.error;
    console.error = () => {};

    const cleanup = () => {
      console.error = originalConsoleError;

      setTimeout(() => {
        try {
          root.unmount();
          tempDiv.remove();
        } catch (e) {
        }
      }, 0);
    };

    await new Promise<void>((resolve) => {
      const handleHashCaught = (hash: string) => {
        cleanup();
        resolve();
      };

      const testApp = React.createElement(BrokenComponent);

      root.render(testApp);

      watch(store, 'err').then((message) => {
        const errorString = typeof message === 'string' ? message : String(message);
        const isTargetError = errorString.includes('Invalid hook call') ||
                              errorString.includes('Minified React error');

        if (isTargetError && !KNOWN_SPAM_HASH) {
          const cleanMessage = cleanErrorMessage(errorString);
          KNOWN_SPAM_HASH = hashUtils.simpleHash(cleanMessage.substring(0, 200)); 
          processPendingErrors();

          console.error = originalConsoleError;
          resolve();
          return;
        }
      })
    });

  } catch (e: any) {
    if ((window as any).originalConsoleError) {
      console.error = (window as any).originalConsoleError;
    }
    console.error(
      `[SPAM HASH SCRIPT] Критическая ошибка (внутри runClientCheck):`,
      e
    );
  }
}

(async () => {
  const isServer = typeof window === 'undefined';
  try {
    if (isServer) {
      await runServerCheck();
    } else {
      setTimeout(runClientCheck, 0);
    }
  } catch (e: any) {
    console.error(`[SPAM HASH SCRIPT] Критическая ошибка (внешний IIFE):`, e);
  }
})();
