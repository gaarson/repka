import { test, expect, vi } from 'vitest';
import { simpleHash } from './stringHash';
import { 
  __SET_SPAM_HASH_FOR_TESTS__,
  runServerCheck
} from './spamHash';

const originalNodeEnv = process.env.NODE_ENV;
const originalReact = globalThis.React;
const originalReactDOMServer = globalThis.ReactDOMServer;

afterEach(() => {
  __SET_SPAM_HASH_FOR_TESTS__(null);
  process.env.NODE_ENV = originalNodeEnv;
  globalThis.React = originalReact;
  globalThis.ReactDOMServer = originalReactDOMServer;
  vi.restoreAllMocks();
});

const cleanErrorMessage = (message: string | Event): string => {
  let str = message.toString();
  str = str.replace(/^(Uncaught )?Error: /, '');
  return str;
};

test('spamHash.ts должен корректно рассчитать и сравнить хеш на сервере', async () => {
  process.env.NODE_ENV = 'development';
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  
  globalThis.React = React;
  globalThis.ReactDOMServer = ReactDOMServer;
  
  __SET_SPAM_HASH_FOR_TESTS__(null);
  
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
  await runServerCheck();
  
  const actualHash = KNOWN_SPAM_HASH;
  expect(actualHash).toBeTruthy('KNOWN_SPAM_HASH должен быть установлен после runServerCheck()');
  expect(typeof actualHash).toBe('string');

  const SsrBrokenComponent = () => {
    if (true) {
      React.useState(0);
    }
    return null;
  };
  
  const originalConsoleError = console.error;
  let errorMessage: string | null = null;
  
  console.error = (...args: any[]) => {
    if (!errorMessage) {
      errorMessage = args[0] as string;
    }
  };

  try {
    ReactDOMServer.renderToString(React.createElement(SsrBrokenComponent));
  } catch (e: any) {
    if (!errorMessage) {
      errorMessage = e.message;
    }
  } finally {
    console.error = originalConsoleError;
  }

  expect(errorMessage).toBeTruthy('Ошибка должна быть поймана через console.error или исключение');
  
  if (!errorMessage) {
    throw new Error('Не удалось захватить сообщение об ошибке');
  }

  const cleanMessage = cleanErrorMessage(errorMessage);
  const expectedHash = simpleHash(cleanMessage.substring(0, 200));

  expect(actualHash).toBe(expectedHash, 'Хеш из KNOWN_SPAM_HASH должен совпадать с ожидаемым хешем ошибки');
}, 10000);
