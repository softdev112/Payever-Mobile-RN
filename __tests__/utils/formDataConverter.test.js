/**
 * Created by Elf on 12.01.2017.
 */
import Store from '../../src/store';
import config from '../../src/config';

/* eslint-disable no-underscore-dangle */
describe('Object to FormData converter tests', () => {
  // Create api object
  const store = new Store(config);
  const api = store.api;
  const mockFetch = jest.fn((url, options) => options.body);
  const URL = 'url';

  const testObject1 = {
    testObj: {
      format: 'formData',
      data: {
        a: 1,
        b: 2,
        c: true,
        d: 'Hello',
      },
    },

    results: [
      ['a', 1],
      ['b', 2],
      ['c', true],
      ['d', 'Hello'],
    ],
  };

  const testObject2 = {
    testObj: {
      format: 'formData',
      data: {
        a: { a: 1, b: 2, c: { f: 1, g: 'Hi' } },
        b: 2,
        c: true,
        d: 'Hello',
      },
    },

    results: [
      ['a[a]', 1],
      ['a[b]', 2],
      ['a[c][f]', 1],
      ['a[c][g]', 'Hi'],
      ['b', 2],
      ['c', true],
      ['d', 'Hello'],
    ],
  };

  const testObject3 = {
    testObj: {
      format: 'formData',
      data: {
        a: { a: 1, b: 2, c: { f: 1, g: 'Hi' } },
        b: [1, 2, 3],
        c: true,
        d: 'Hello',
        e: [{ s: 1 }, { r: 2 }],
      },
    },

    results: [
      ['a[a]', 1],
      ['a[b]', 2],
      ['a[c][f]', 1],
      ['a[c][g]', 'Hi'],
      ['b[]', 1],
      ['b[]', 2],
      ['b[]', 3],
      ['c', true],
      ['d', 'Hello'],
      ['e[][s]', 1],
      ['e[][r]', 2],
    ],
  };

  const testObject4 = {
    testObj: {
      format: 'formData',
      data: {
        a: { a: [1, 2, 3], b: 2, c: { f: 1, g: 'Hi' } },
        b: [1, 2, 3],
      },
    },

    results: [
      ['a[a][]', 1],
      ['a[a][]', 2],
      ['a[a][]', 3],
      ['a[b]', 2],
      ['a[c][f]', 1],
      ['a[c][g]', 'Hi'],
      ['b[]', 1],
      ['b[]', 2],
      ['b[]', 3],
    ],
  };

  const testObject5 = {
    testObj: {
      format: 'formData',
      data: {
        a: { a: [1, 2, 3], b: 2, c: { f: 1, g: 'Hi' } },
        b: [[1, 2, 3], ['e', 'd'], { a: 3 }],
      },
    },

    results: [
      ['a[a][]', 1],
      ['a[a][]', 2],
      ['a[a][]', 3],
      ['a[b]', 2],
      ['a[c][f]', 1],
      ['a[c][g]', 'Hi'],
      ['b[][]', 1],
      ['b[][]', 2],
      ['b[][]', 3],
      ['b[][]', 'e'],
      ['b[][]', 'd'],
      ['b[][a]', 3],
    ],
  };

  beforeAll(() => {
    api.fetch = mockFetch;
  });

  afterEach(() => {
    // Reset mock function
    mockFetch.mockClear();
  });

  it('If it gets null object should return empty FormData', async () => {
    const resp = await api.post(URL, null);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).not.toBeTruthy();
    expect(resp).toBeUndefined();
  });

  it('If it gets corrupt request data should get empty FormData', async () => {
    const resp = await api.post(URL, 2);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).not.toBeTruthy();
    expect(resp).toBeUndefined();
  });

  it('If it gets no format field data should return JSON', async () => {
    const data = { k: 1 };
    const resp = await api.post(URL, { data });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp).toBe('{"k":1}');
    expect(resp._parts_).not.toBeTruthy();
  });

  it('If it gets format and null data should get empty FormData', async () => {
    const resp = await api.post(URL, {
      data: null,
      format: 'formData',
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts.length).toBe(0);
  });

  it('Test on test objects №1', async () => {
    const { testObj, results } = testObject1;
    const resp = await api.post(URL, {
      ...testObj,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual(results);
  });

  it('Test on test objects №2', async () => {
    const { testObj, results } = testObject2;
    const resp = await api.post(URL, {
      ...testObj,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual(results);
  });

  it('Test on test objects №3', async () => {
    const { testObj, results } = testObject3;
    const resp = await api.post(URL, {
      ...testObj,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual(results);
  });

  it('Test on test objects №4', async () => {
    const { testObj, results } = testObject4;
    const resp = await api.post(URL, {
      ...testObj,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual(results);
  });

  it('Test on test objects №5', async () => {
    const { testObj, results } = testObject5;
    const resp = await api.post(URL, {
      ...testObj,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual(results);
  });
});