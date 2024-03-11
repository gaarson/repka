import { createSource, FIELDS_PREFIX } from '../index';

describe('createSource', () => {
  type iniObjectType = { bool: boolean, str: string, num: number }
  const initObject = { bool: true, str: 'string', num: 123 };
  const key = 'default';

  const notifier = jest.fn(() => {
    return;
  });

  const provider = jest.fn(function () {
    this[`${FIELDS_PREFIX}muppet`]['__PROVIDER_ID__'] = key;
    Object.keys(this[`${FIELDS_PREFIX}data`]).forEach(prop => {
      if (
        this[`${FIELDS_PREFIX}listeners`][prop] &&
        typeof this[`${FIELDS_PREFIX}listeners`][prop] !== 'function'
      ) this[`${FIELDS_PREFIX}listeners`][prop].set(key, notifier);
    });
    return this;
  });

  let stateRepo;
  let repoWithCustomProvider;
  let customProviderRepo;

  beforeEach(() => {
    stateRepo = createSource<iniObjectType, { doSome: (() => void) }>(initObject, { doSome: () => { return; }});
    repoWithCustomProvider = createSource<iniObjectType>(initObject, undefined, provider);
    customProviderRepo = repoWithCustomProvider();
  });

  test('initial values are the same', () => {
    expect(stateRepo.bool).toBe(true);
    expect(stateRepo.str).toBe('string');
    expect(stateRepo.num).toBe(123);
  });

  test('default provider return correct values', () => {
    const [obj, methods] = stateRepo();

    expect(methods).toHaveProperty('doSome');
    expect(obj.bool).toBe(true);
    expect(obj.str).toBe('string');
    expect(obj.num).toBe(123);
  }) 

  test('should call the provider when creating a source', () => {
    repoWithCustomProvider();
    expect(provider).toHaveBeenCalled();
  });
  
  test('should call notifier when value change', () => {
    customProviderRepo['str'];
    customProviderRepo['str'] = '123';

    customProviderRepo[`${FIELDS_PREFIX}criticalFields`][key]
    expect(customProviderRepo[`${FIELDS_PREFIX}criticalFields`][key]).toContain('str')
    expect(customProviderRepo[`${FIELDS_PREFIX}muppet`][key]).toBe(true)
    expect(notifier).toHaveBeenCalled();
  });

  test('should update properties and trigger onUpdate listeners correctly', () => {
    const onUpdateMock = jest.fn();
    stateRepo[`${FIELDS_PREFIX}onUpdate`].push(onUpdateMock);

    stateRepo.bool = false;
    expect(stateRepo.bool).toBe(false);
    expect(stateRepo[`${FIELDS_PREFIX}data`].bool).toBe(false)

    expect(onUpdateMock).toHaveBeenCalledWith("bool");
  });
});
