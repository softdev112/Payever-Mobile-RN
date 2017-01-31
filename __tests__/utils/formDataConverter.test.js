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
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual([]);
  });

  it('If it gets corrupt request data should get empty FormData', async () => {
    const resp = await api.post(URL, 2);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual([]);
  });

  it('If it gets no format field data should return formData', async () => {
    const resp = await api.post(URL, { k: 1 });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual([['k', 1]]);
  });

  it('If it gets format = json should return json for same data', async () => {
    const resp = await api.post(URL, { k: 1 }, { format: 'json' });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp).toBe('{"k":1}');
    expect(resp._parts).not.toBeTruthy();
  });

  it('If it gets format and null data should get empty FormData', async () => {
    const resp = await api.post(URL, null, { format: 'formData' });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts.length).toBe(0);
  });

  it('Test on test objects №1', async () => {
    const { testObj, results } = testObject1;
    const resp = await api.post(URL, testObj.data);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual(results);
  });

  it('Test on test objects №2', async () => {
    const { testObj, results } = testObject2;
    const resp = await api.post(URL, testObj.data);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual(results);
  });

  it('Test on test objects №3', async () => {
    const { testObj, results } = testObject3;
    const resp = await api.post(URL, testObj.data);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual(results);
  });

  it('Test on test objects №4', async () => {
    const { testObj, results } = testObject4;
    const resp = await api.post(URL, testObj.data);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual(results);
  });

  it('Test on test objects №5', async () => {
    const { testObj, results } = testObject5;
    const resp = await api.post(URL, testObj.data);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resp).toBeTruthy();
    expect(resp._parts).toBeTruthy();
    expect(resp._parts).toEqual(results);
  });
});