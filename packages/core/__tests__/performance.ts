import { createSource } from '../index';

describe('Core Performance & Memory Benchmarks', () => {
  const ITERATIONS = 1_000_000;
  const STORE_COUNT = 10_000;
  const LISTENER_COUNT = 1_000;

  const rawData = {
    count: 0,
    text: 'initial',
    obj: { a: 1 },
    method() { return this.count; }
  };

  it('should benchmark read speed (Raw vs Proxy)', () => {
    const proxy = createSource({ ...rawData }, {});
    const raw = { ...rawData };

    const startRaw = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      const _ = raw.count;
    }
    const endRaw = performance.now();

    const startProxy = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      const _ = proxy.count;
    }
    const endProxy = performance.now();

    const rawTime = endRaw - startRaw;
    const proxyTime = endProxy - startProxy;

    console.log(`\n[Read Speed]`);
    console.log(`Raw: ${rawTime.toFixed(2)}ms`);
    console.log(`Proxy: ${proxyTime.toFixed(2)}ms`);
    console.log(`Overhead: ${((proxyTime / rawTime) * 100).toFixed(2)}%`);

    expect(proxyTime).toBeGreaterThan(0);
  });

  it('should benchmark write speed (Raw vs Proxy)', () => {
    const proxy = createSource({ ...rawData }, {});
    const raw = { ...rawData };

    const startRaw = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      raw.count = i;
    }
    const endRaw = performance.now();

    const startProxy = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      proxy.count = i;
    }
    const endProxy = performance.now();

    const rawTime = endRaw - startRaw;
    const proxyTime = endProxy - startProxy;

    console.log(`\n[Write Speed]`);
    console.log(`Raw: ${rawTime.toFixed(2)}ms`);
    console.log(`Proxy: ${proxyTime.toFixed(2)}ms`);
    console.log(`Overhead: ${((proxyTime / rawTime) * 100).toFixed(2)}%`);

    expect(proxyTime).toBeGreaterThan(0);
  });

  it('should benchmark notification overhead', () => {
    const proxy = createSource({ count: 0 }, {});

    // Find the internal listeners key by searching for a key that ends with 'listeners'
    const keys = Object.getOwnPropertySymbols(proxy);
    const listenersKey = keys.find(k => k.toString().includes('listeners'));

    if (!listenersKey) {
      throw new Error('Could not find internal listeners key on proxy');
    }

    const prop = 'count';
    const propListeners = (proxy as any)[listenersKey][prop];

    for (let i = 0; i < LISTENER_COUNT; i++) {
      propListeners.set(`listener_${i}`, () => {});
    }

    const start = performance.now();
    proxy.count = 1;
    const end = performance.now();

    console.log(`\n[Notification Overhead]`);
    console.log(`Time to notify ${LISTENER_COUNT} listeners: ${(end - start).toFixed(4)}ms`);

    expect(end - start).toBeGreaterThan(0);
  });

  it('should benchmark store creation speed', () => {
    const start = performance.now();
    for (let i = 0; i < STORE_COUNT; i++) {
      createSource({ count: i }, {});
    }
    const end = performance.now();

    console.log(`\n[Creation Speed]`);
    console.log(`Time to create ${STORE_COUNT} stores: ${(end - start).toFixed(2)}ms`);
    console.log(`Average per store: ${((end - start) / STORE_COUNT).toFixed(4)}ms`);

    expect(end - start).toBeGreaterThan(0);
  });

  it('should benchmark memory overhead', () => {
    // Try to trigger GC if available
    if (typeof global.gc === 'function') {
      global.gc();
    }

    const startMem = process.memoryUsage().heapUsed;
    const stores = [];

    for (let i = 0; i < STORE_COUNT; i++) {
      stores.push(createSource({ count: i, text: 'some text', a: 1, b: 2 }, {}));
    }

    const endMem = process.memoryUsage().heapUsed;
    const diff = endMem - startMem;
    const perStore = diff / STORE_COUNT;

    console.log(`\n[Memory Overhead]`);
    console.log(`Total heap increase for ${STORE_COUNT} stores: ${(diff / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Estimated overhead per store: ${(perStore / 1024).toFixed(2)} KB`);

  });
});
