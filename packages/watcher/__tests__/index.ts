import { repka } from '../../repka';
import { watch } from '../index';

describe('create watcher', () => {
  const watcherSpy = jest.fn();
  const state = repka<{foo: number}>({ foo: 1 });

  const watchForFoo = async () => {
    await watch(state, 'foo');
    watcherSpy()
  }

  beforeEach(() => {
    watcherSpy.mockClear();
  });

  test('spy called after foo updates', () => { 
    watchForFoo();

    state.foo = 2

    setTimeout(() => {
      expect(watcherSpy).toHaveBeenCalledTimes(1);
    }, 0)
  });
});
