import React from 'react';
import { simpleHash } from './stringHash'; 

export let KNOWN_SPAM_HASH: string | null = null;

const BrokenComponent = () => {
  React.useEffect(() => {
    React.useState()
  }, [])
  return null; 
};

const cleanErrorMessage = (message: string | Event): string => {
  let str = message.toString();
  str = str.replace(/^(Uncaught )?Error: /, '');
  return str;
}

(async () => {
  const isServer = typeof window === 'undefined';

  try {
    if (isServer) {
      const { renderToString } = await import('react-dom/server');
      
      const originalConsoleError = console.error;
      console.error = () => {};

      try {
        renderToString(React.createElement(BrokenComponent));
      } catch (error: any) {
        const cleanMessage = cleanErrorMessage(error.message);
        KNOWN_SPAM_HASH = simpleHash(cleanMessage.substring(0, 200));
      } finally {
        console.error = originalConsoleError;
      }
    } else {
      const runClientCheck = async () => {
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

          const cleanup = () => {
            setTimeout(() => {
              window.removeEventListener('error', errorListener, { capture: true });
              window.removeEventListener('unhandledrejection', rejectionListener, { capture: true });
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
            const cleanMessage = cleanErrorMessage(event.message);

            if (cleanMessage.includes('Invalid hook call')) {
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
            const reason = event.reason?.message || event.reason?.toString() || '';
            const cleanMessage = cleanErrorMessage(reason);

            if (cleanMessage.includes('Invalid hook call')) {
              const hash = simpleHash(cleanMessage.substring(0, 200));
              KNOWN_SPAM_HASH = hash;

              event.preventDefault();
              event.stopImmediatePropagation();
              event.stopPropagation();
              
              cleanup();
            }
          };

          window.addEventListener('error', errorListener, { capture: true });
          window.addEventListener('unhandledrejection', rejectionListener, { capture: true });

          console.error = () => {};
          window.onerror = function (message){
            if (message.toString().includes('Invalid hook call')) {
              cleanup();
              return true;
            }
            return originalOnError ? originalOnError.apply(window, arguments as any) : false;
          };
          window.onunhandledrejection = (event) => {
              rejectionListener(event);
              return true;
          };


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
          console.error(`[SPAM HASH SCRIPT] Критическая ошибка (внутри runClientCheck):`, e);
        }
      };     
      setTimeout(runClientCheck, 0);
    }
  } catch (e: any) {
    console.error(`[SPAM HASH SCRIPT] Критическая ошибка (внешний IIFE):`, e);
  }
})();
