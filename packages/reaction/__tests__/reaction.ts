import { Reaction } from '../reaction';
import { FIELDS_PREFIX, SYMBOLS } from 'core/domain';

const createMockStore = () => ({
  [SYMBOLS.onUpdate]: [],
  simulateUpdate(prop: string) {
    this[SYMBOLS.onUpdate].forEach(fn => fn(prop, 'mock_value', this));
  }
});

describe('Reaction class', () => {
  let mockStore;
  let scheduler;
  let reaction;

  beforeEach(() => {
    mockStore = createMockStore();
    scheduler = jest.fn();
    reaction = new Reaction('test-reaction', scheduler);
  });

  test('should run scheduler when a dependency is updated', () => {
    reaction.reportDependency(mockStore, 'foo');
    mockStore.simulateUpdate('foo');
    expect(scheduler).toHaveBeenCalledTimes(1);
  });

  test('should NOT run scheduler when an unrelated prop is updated', () => {
    reaction.reportDependency(mockStore, 'foo');
    mockStore.simulateUpdate('bar'); 
    expect(scheduler).not.toHaveBeenCalled();
  });

  test('should run scheduler once if multiple dependencies are updated', () => {
    reaction.reportDependency(mockStore, 'foo');
    reaction.reportDependency(mockStore, 'bar');
    
    mockStore.simulateUpdate('foo');
    mockStore.simulateUpdate('bar');
    
    expect(scheduler).toHaveBeenCalledTimes(2);
  });

  test('should stop running scheduler after dispose()', () => {
    reaction.reportDependency(mockStore, 'foo');
    expect(mockStore[SYMBOLS.onUpdate].length).toBe(1);

    reaction.dispose();
    
    expect(mockStore[SYMBOLS.onUpdate].length).toBe(0);

    mockStore.simulateUpdate('foo');
    expect(scheduler).not.toHaveBeenCalled();
  });

  test('should not report dependency if already disposed', () => {
    reaction.dispose();
    reaction.reportDependency(mockStore, 'foo');
    expect(mockStore[SYMBOLS.onUpdate].length).toBe(0);
  });
});

