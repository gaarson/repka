import {
  runServerCheck,
  getSpamHash,
  __SET_SPAM_HASH_FOR_TESTS__,
  store,
} from './spamHash';
import { hashUtils } from './stringHash';
import { vi } from 'vitest';

const MOCK_SPAM_MESSAGE = 'Invalid hook call. Hooks can only be called inside...';
const EXPECTED_HASH = hashUtils.simpleHash(MOCK_SPAM_MESSAGE.substring(0, 200));

vi.mock('react-dom/server', () => ({
  renderToString: vi.fn(() => {
    store.err = new Error(MOCK_SPAM_MESSAGE);
    return '';
  }),
}));

describe('runServerCheck (SSR)', () => {
  beforeEach(() => {
    __SET_SPAM_HASH_FOR_TESTS__(null);
    store.err = null;
    vi.clearAllMocks();
  });

  test('should set KNOWN_SPAM_HASH and resolve with hash on target error', async () => {
    const spamHash = await runServerCheck();

    expect(spamHash).toBe(EXPECTED_HASH);
    expect(getSpamHash()).toBe(EXPECTED_HASH);
  });

  test('should resolve false if error is not the target spam', async () => {
    const { renderToString } = await import('react-dom/server');
    vi.mocked(renderToString).mockImplementation(() => {
      store.err = new Error('This is a completely different error');
      return '';
    });

    const spamHash = await runServerCheck();

    expect(spamHash).toBe(false);
    expect(getSpamHash()).toBe(null);
  });
});
