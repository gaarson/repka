import { SYMBOLS, SPECIAL_KEY } from '../domain';
import { createSource } from '../index';

interface ITest {
  bool: boolean,
  str: string,
  num: number,
  doSome(): void;
}

class Test implements ITest {
  bool = true;
  str = 'string';
  num = 123;
  doSome() { return; }
}

describe('createSource', () => {
  const key = 'default';
  const notifier = jest.fn(() => { return; });

  const provider = jest.fn(function (this: any) {
    this[SYMBOLS.muppet].set(SPECIAL_KEY, key);
    this[SYMBOLS.muppet].set(key, false);

    Object.keys(this[SYMBOLS.data]).forEach(prop => {
      if (
        this[SYMBOLS.listeners][prop] &&
        typeof this[SYMBOLS.listeners][prop] !== 'function'
      ) {
        this[SYMBOLS.listeners][prop].set(key, notifier);
      }
    });
    return this;
  });

  const stateRepo = createSource<ITest, { main: () => ITest }>(new Test(), { main: provider });

  beforeEach(() => {
    notifier.mockClear();
    provider.mockClear();
  });

  test('initial values are the same', () => {
    expect(stateRepo.bool).toBe(true);
    expect(stateRepo.str).toBe('string');
    expect(stateRepo.num).toBe(123);
  });

  test('default provider return correct values', () => {
    const providerResult = stateRepo();
    expect(providerResult).toHaveProperty('doSome');
    expect(providerResult.bool).toBe(true);
    expect(providerResult.str).toBe('string');
  });

  test('call notifier when value change', () => {
    stateRepo();
    expect(notifier).not.toHaveBeenCalled();
    expect((stateRepo as any)[SYMBOLS.muppet].get(key)).toBe(false);

    stateRepo.str = '123';

    expect(notifier).toHaveBeenCalled();
    expect((stateRepo as any)[SYMBOLS.muppet].get(key)).toBe(true);
  });

  test('update properties and trigger onUpdate listeners correctly', () => {
    const onUpdateMock = jest.fn();
    (stateRepo as any)[SYMBOLS.onUpdate].push(onUpdateMock);

    stateRepo.bool = false;

    expect(stateRepo.bool).toBe(false);
    expect((stateRepo as any)[SYMBOLS.data].bool).toBe(false)
    expect(onUpdateMock).toHaveBeenCalledWith("bool", false, stateRepo);
  });
});
