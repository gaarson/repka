import { repka } from '../../repka';
import { watch } from '../index';
import { FIELDS_PREFIX } from '../../core/domain'

import { act } from '@testing-library/react';

describe('watch function', () => {
  test('should resolve with the new value when property changes', async () => {
    const state = repka({ foo: 0 });
    const watcherSpy = jest.fn();

    const watchPromise = watch(state, 'foo').then(watcherSpy);

    expect(watcherSpy).not.toHaveBeenCalled();

    act(() => {
      state.foo = 1;
    });

    await watchPromise;

    expect(watcherSpy).toHaveBeenCalledWith(1);
  });

  test('should only resolve once and clean up its listener', async () => {
    const state = repka({ foo: 0 });
    const watcherSpy = jest.fn();

    const watchPromise = watch(state, 'foo').then(watcherSpy);

    expect(state[`${FIELDS_PREFIX}onUpdate`].length).toBe(1);

    act(() => {
      state.foo = 1;
    });
    await watchPromise;
    expect(watcherSpy).toHaveBeenCalledTimes(1);

    expect(state[`${FIELDS_PREFIX}onUpdate`].length).toBe(0);

    act(() => {
      state.foo = 2;
    });
    
    await act(async () => {}); 
    
    expect(watcherSpy).toHaveBeenCalledTimes(1);
  });
});
