import { runServerCheck, getSpamHash, __SET_SPAM_HASH_FOR_TESTS__ } from './spamHash';

vi.mock('react-dom/server', () => ({
  renderToString: () => {
    console.error('Invalid hook call. Hooks can only be called inside...');
  },
}));

describe('runServerCheck (SSR)', () => {
  beforeEach(() => {
    __SET_SPAM_HASH_FOR_TESTS__(null);
  });

  test('should set KNOWN_SPAM_HASH when Invalid hook call error occurs', async () => {
    const spamHash = await runServerCheck();

    expect(spamHash).not.toBeNull();
    expect(typeof spamHash).toBe('string');
    expect(spamHash!.length).toBeGreaterThan(0);

    expect(getSpamHash()).toBe(spamHash);
  });
});
