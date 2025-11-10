import { test, expect } from 'vitest';
import React from 'react';
import { simpleHash } from './stringHash';

import { KNOWN_SPAM_HASH, __SET_SPAM_HASH_FOR_TESTS__ } from './spamHash';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
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

async function getExpectedClientHash(): Promise<string> {
  const { createRoot } = await import('react-dom/client');
  return new Promise((resolve) => {
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    const root = createRoot(tempDiv);

    // Глушим ТОЛЬКО console.error, чтобы React не писал в stderr
    const originalConsoleError = console.error;
    console.error = () => {};

    // 2. Создаем Error Boundary, который поймает ошибку и вернет хеш
    class TestBoundary extends React.Component {
      state: any
      constructor(props: any) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError(error: Error) {
        return { hasError: true };
      }

      componentDidCatch(error: Error) {
        const cleanMessage = cleanErrorMessage(error.message);
        const hash = simpleHash(cleanMessage.substring(0, 200));

        console.error = originalConsoleError; // Восстанавливаем
        setTimeout(() => {
          root.unmount();
          tempDiv.remove();
        }, 0);
        
        resolve(hash);
      }

      render() {
        // @ts-ignore
        if (this.state.hasError) {
          return null;
        }
        // @ts-ignore
        return this.props.children;
      }
    }

    const TestApp = React.createElement(
      TestBoundary,
      null,
      React.createElement(BrokenComponent)
    );
    
    root.render(TestApp);
  });
}

test('spamHash.ts должен корректно рассчитать и сравнить хеш в браузере', async () => {
  __SET_SPAM_HASH_FOR_TESTS__(null);
  
  await wait(100); 

  const actualHash = KNOWN_SPAM_HASH;

  expect(actualHash).toBeTruthy();
  expect(typeof actualHash).toBe('string');

  const expectedHash = await getExpectedClientHash();

  expect(actualHash).toBe(expectedHash);
}, 10000);
