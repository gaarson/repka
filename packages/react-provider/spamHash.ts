'use client'

import React from 'react';
import { simpleHash } from './stringHash';

export let KNOWN_SPAM_HASH: string | null = null;
export const __SET_SPAM_HASH_FOR_TESTS__ = (hash: string | null) => {
  KNOWN_SPAM_HASH = hash;
}
export function getSpamHash() {
  return KNOWN_SPAM_HASH;
}

const BrokenComponent = () => {
  React.useEffect(() => {
    React.useState();
  }, []);
  return null;
};

const cleanErrorMessage = (message: string | Event): string => {
  let str = message.toString();
  str = str.replace(/^(Uncaught )?Error: /, '');
  return str;
};

class SpamTestBoundary extends React.Component<
  { children: React.ReactNode; onHashCaught: (hash: string) => void },
  { hasError: boolean }
> {
  state: any;
  props: any;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    const cleanMessage = cleanErrorMessage(error.message);
    const isTheSpamError =
      cleanMessage.includes('Invalid hook call') ||
      cleanMessage.includes('Minified React error');

    if (isTheSpamError) {
      const hash = simpleHash(cleanMessage.substring(0, 200));
      KNOWN_SPAM_HASH = hash; 
      this.props.onHashCaught(hash);
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export async function runServerCheck() {
  const { renderToString } = await import('react-dom/server');

  const ServerBrokenComponent = () => {
    import('react')?.then((def) => {
      def?.useSyncExternalStore()
    }).catch(() => {});

    return
  };

  return new Promise(resolve => {
    const originalConsoleError = console.error;

    const TIMEOUT = 100;

    console.error = (message: any, ...optionalParams: any[]) => {
      const errorString = typeof message === 'string' ? message : String(message);
      const isTargetError = errorString.includes('Invalid hook call') ||
                            errorString.includes('Minified React error');

      if (isTargetError && !KNOWN_SPAM_HASH) {
        const cleanMessage = cleanErrorMessage(errorString);
        KNOWN_SPAM_HASH = simpleHash(cleanMessage.substring(0, 200));

        console.error = originalConsoleError;
        resolve(KNOWN_SPAM_HASH);
        return;
      }

      originalConsoleError(message, ...optionalParams);
    };

    try {
      renderToString(React.createElement(ServerBrokenComponent));

      setTimeout(() => {
        if (!KNOWN_SPAM_HASH) {
          console.error = originalConsoleError;
          resolve(false);
        }
      }, TIMEOUT);

    } catch (error) {
      console.error = originalConsoleError;
      resolve(true);
    }
  });
}

export async function runClientCheck() {
  let root: any = null; // Выносим, чтобы cleanup имел доступ
  let tempDiv: HTMLDivElement | null = null; // Выносим
  let originalConsoleError: typeof console.error | null = null;
  let originalWindowOnError: OnErrorEventHandler | null = null;

  const cleanup = () => {
    if (originalConsoleError) {
      console.error = originalConsoleError;
    }
    if (originalWindowOnError) {
      window.onerror = originalWindowOnError;
    }

    setTimeout(() => {
      try {
        if (root) {
          root.unmount();
        }
        if (tempDiv) {
          tempDiv.remove();
        }
      } catch (e) {
      }
    }, 0);
  };

  try {
    const { createRoot } = await import('react-dom/client');

    tempDiv = document.createElement('div');
    tempDiv.id = 'react-error-test-rig';
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);
    root = createRoot(tempDiv);

    originalConsoleError = console.error;
    console.error = () => {};

    originalWindowOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      const msg = message.toString();
      if (
        msg.includes('Invalid hook call') ||
        msg.includes('Minified React error')
      ) {
        return true;
      }

      if (originalWindowOnError) {
        return originalWindowOnError.call(
          window,
          message,
          source,
          lineno,
          colno,
          error
        );
      }
      return false;
    };

    await new Promise<void>((resolve) => {
      const handleHashCaught = (hash: string) => {
        console.log(`[SPAM HASH SCRIPT] Client hash caught: ${hash}`);
        cleanup();
        resolve();
      };

      const testApp = React.createElement(
        SpamTestBoundary,
        { onHashCaught: handleHashCaught },
        React.createElement(BrokenComponent)
      );

      root.render(testApp);

      setTimeout(() => {
        if (!KNOWN_SPAM_HASH) {
          console.error = originalConsoleError!;
          console.error(
            '[SPAM HASH SCRIPT] Client check timed out. No hash caught.'
          );
          cleanup();
          resolve();
        }
      }, 200);
    });
  } catch (e: any) {
    if (originalConsoleError) {
      console.error = originalConsoleError;
    }
    if (originalWindowOnError) {
      window.onerror = originalWindowOnError;
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
