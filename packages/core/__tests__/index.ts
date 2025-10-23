import { FIELDS_PREFIX, SPECIAL_KEY } from '../domain';
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
  doSome() {
    return;
  }
}

describe('createSource', () => {
  const key = 'default';

  const notifier = jest.fn(() => {
    return;
  });

  const provider = jest.fn(function () {
    this[`${FIELDS_PREFIX}muppet`].set(SPECIAL_KEY, key);
    this[`${FIELDS_PREFIX}muppet`].set(key, false);

    Object.keys(this[`${FIELDS_PREFIX}data`]).forEach(prop => {
      if (
        this[`${FIELDS_PREFIX}listeners`][prop] &&
        typeof this[`${FIELDS_PREFIX}listeners`][prop] !== 'function'
      ) {
        this[`${FIELDS_PREFIX}listeners`][prop].set(key, notifier);
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
    expect(providerResult.num).toBe(123);
  });

  test('call notifier when value change', () => {
    stateRepo();
    
    expect(notifier).not.toHaveBeenCalled();
    expect(stateRepo[`${FIELDS_PREFIX}muppet`].get(key)).toBe(false);

    stateRepo['str'] = '123';

    expect(notifier).toHaveBeenCalled();
    expect(stateRepo[`${FIELDS_PREFIX}muppet`].get(key)).toBe(true);
  });

  test('update properties and trigger onUpdate listeners correctly', () => {
    const onUpdateMock = jest.fn();
    stateRepo[`${FIELDS_PREFIX}onUpdate`].push(onUpdateMock);

    stateRepo.bool = false;

    expect(stateRepo.bool).toBe(false);
    expect(stateRepo[`${FIELDS_PREFIX}data`].bool).toBe(false)
    expect(onUpdateMock).toHaveBeenCalledWith("bool", false);
  });
});
