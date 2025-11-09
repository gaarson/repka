import React from 'react';
import { simpleHash } from './stringHash';

export let KNOWN_SPAM_HASH: string | null = null;

export function __SET_SPAM_HASH_FOR_TESTS__(hash: string | null) {
  KNOWN_SPAM_HASH = hash;
}

const BrokenComponent = () => {
  React.useEffect(() => {
    React.useState();
  }, []);
  return null;
};

const SsrBrokenComponent = () => {
  if (true) {
    React.useState(0);
  }
  return null;
};

const cleanErrorMessage = (message: string | Event): string => {
  let str = message.toString();
  str = str.replace(/^(Uncaught )?Error: /, '');
  return str;
};

export async function runServerCheck() {
  const { renderToString } = await import('react-dom/server');

  const originalConsoleError = console.error;
  let errorMessage: string | null = null; 

  console.error = (...args: any[]) => {
    if (!errorMessage) {
      errorMessage = args[0] as string;
    }
  };

  try {
    renderToString(React.createElement(SsrBrokenComponent));
  } catch (e) {
    if (!errorMessage) {
      errorMessage = (e as Error).message;
    }
  } finally {
    console.error = originalConsoleError;
  }
  
  if (errorMessage) {
    const cleanMessage = cleanErrorMessage(errorMessage);
    KNOWN_SPAM_HASH = simpleHash(cleanMessage.substring(0, 200));
  }
}

// export async function runServerCheck() {
//   const { renderToString } = await import('react-dom/server');

//   const originalConsoleError = console.error;
//   console.error = () => {}; 

//   try {
//     renderToString(React.createElement(BrokenComponent));
//   } catch (error: any) {
//     const cleanMessage = cleanErrorMessage(error.message);
//     KNOWN_SPAM_HASH = simpleHash(cleanMessage.substring(0, 200));
//   } finally {
//     console.error = originalConsoleError;
//   }
// }

export async function runClientCheck() {
  try {
    const { createRoot } = await import('react-dom/client');

    const tempDiv = document.createElement('div');
    tempDiv.id = 'react-error-test-rig';
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);
    const root = createRoot(tempDiv);

    const originalConsoleError = console.error;
    const originalOnError = window.onerror;
    const originalOnUnhandledRejection = window.onunhandledrejection;

    (window as any).__IS_REACT_SPAM_TEST__ = false;

    const cleanup = () => {
      setTimeout(() => {
        (window as any).__IS_REACT_SPAM_TEST__ = false;

        window.removeEventListener('error', errorListener, { capture: true });
        window.removeEventListener('unhandledrejection', rejectionListener, {
          capture: true,
        });

        console.error = originalConsoleError;
        window.onerror = originalOnError;
        window.onunhandledrejection = originalOnUnhandledRejection;

        try {
          root.unmount();
          tempDiv.remove();
        } catch (e) {}
      }, 0);
    };

    const errorListener = (event: ErrorEvent) => {
      if (!(window as any).__IS_REACT_SPAM_TEST__) {
        return;
      }

      const cleanMessage = cleanErrorMessage(event.message);
      const isTheSpamError =
        cleanMessage.includes('Invalid hook call') ||
        cleanMessage.includes('Minified React error');

      if (isTheSpamError) {
        const hash = simpleHash(cleanMessage.substring(0, 200));
        KNOWN_SPAM_HASH = hash;

        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();

        cleanup();
        return false;
      }
    };

    const rejectionListener = (event: PromiseRejectionEvent) => {
      if (!(window as any).__IS_REACT_SPAM_TEST__) {
        return;
      }

      const reason = event.reason?.message || event.reason?.toString() || '';
      const cleanMessage = cleanErrorMessage(reason);

      const isTheSpamError =
        cleanMessage.includes('Invalid hook call') ||
        cleanMessage.includes('Minified React error #321');

      if (isTheSpamError) {
        const hash = simpleHash(cleanMessage.substring(0, 200));
        KNOWN_SPAM_HASH = hash;

        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();

        cleanup();
      }
    };

    window.addEventListener('error', errorListener, { capture: true });
    window.addEventListener('unhandledrejection', rejectionListener, {
      capture: true,
    });

    console.error = () => {};

    window.onerror = function () {
      if ((window as any).__IS_REACT_SPAM_TEST__) {
        return true;
      }
      return originalOnError
        ? originalOnError.apply(window, arguments as any)
        : false;
    };

    window.onunhandledrejection = (event) => {
      if ((window as any).__IS_REACT_SPAM_TEST__) {
        return true;
      }
      return originalOnUnhandledRejection
        ? originalOnUnhandledRejection.apply(window, [event])
        : false;
    };
    (window as any).__IS_REACT_SPAM_TEST__ = true;

    root.render(React.createElement(BrokenComponent));
  } catch (e: any) {
    if ((window as any).originalConsoleError) {
      console.error = (window as any).originalConsoleError;
    }
    if ((window as any).originalOnError) {
      window.onerror = (window as any).originalOnError;
    }
    if ((window as any).originalOnUnhandledRejection) {
      window.onunhandledrejection = (window as any).originalOnUnhandledRejection;
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
