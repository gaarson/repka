import { createSource, ISource, providerType, watcherObjType } from '../index';

describe('createSource', () => {
  const initObject: watcherObjType<{ [key: string]: unknown }> = {
    prop1: true,
    prop2: false,
  };

  const provider: providerType = jest.fn(() => [undefined, undefined]);
  const methods = {};

  let source: ISource<{ [key: string]: unknown }, typeof methods>;

  beforeEach(() => {
    source = createSource(initObject, provider, methods);
  });

  test('should create a source with correct initial values', () => {
    expect(source.muppet.prop1).toBe(true);
    expect(source.muppet.prop2).toBe(false);
    expect(source.__listeners).toHaveProperty('prop1');
    expect(source.__listeners).toHaveProperty('prop2');
  });

  test('should call the provider when creating a source', () => {
    expect(provider).toHaveBeenCalled();
  });

  test('should update properties and trigger listeners correctly', () => {
    const onUpdateMock = jest.fn();
    source.__onUpdate.push(onUpdateMock);

    source.muppet.prop1 = false;
    expect(source.muppet.prop1).toBe(false);
    expect(source.muppet.__init__?.prop1).toBe(false);
    expect(onUpdateMock).toHaveBeenCalledWith('prop1');

    source.muppet.prop2 = true;
    expect(source.muppet.prop2).toBe(true);
    expect(source.muppet.__init__?.prop2).toBe(true);
    expect(onUpdateMock).toHaveBeenCalledWith('prop2');
  });

  // Add more tests as needed
});
