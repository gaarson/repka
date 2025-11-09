import { act } from '@testing-library/react';

jest.mock('../stringHash');

let mockedSimpleHash: jest.Mock;

describe('spamHash Integration Test', () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    jest.useFakeTimers();
    mockedSimpleHash = require('../stringHash').simpleHash;
    mockedSimpleHash.mockClear();

    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    jest.useRealTimers();
    jest.resetModules(); 
  });

  it('должен молча вызвать simpleHash с сообщением "Invalid hook call"', async () => {
    let spamHashModule: any;
    const MOCK_HASH_VALUE = '---i-am-a-mocked-hash---';

    mockedSimpleHash.mockReturnValue(MOCK_HASH_VALUE);

    act(() => {
      jest.isolateModules(() => {
        spamHashModule = require('../spamHash');
      });
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });
    
    const { __SET_SPAM_HASH_FOR_TESTS__ } = spamHashModule;

    expect(console.error).not.toHaveBeenCalled();
    expect(spamHashModule.KNOWN_SPAM_HASH).toBe(MOCK_HASH_VALUE);
    expect(mockedSimpleHash).toHaveBeenCalledTimes(1);
    expect(mockedSimpleHash.mock.calls[0][0]).toContain('Invalid hook call');

    __SET_SPAM_HASH_FOR_TESTS__(null);
  });
});
