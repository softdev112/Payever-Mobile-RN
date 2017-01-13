/**
 * Created by Elf on 12.01.2017.
 */
import { objectToPhpFormData } from '../src/common/api';

describe('Object to FormData converter tests', () => {
  const testObject1 = {
    key: 'key',
    testObj: {
      a: 1,
      b: 2,
      c: true,
      d: 'Hello'
    },

    results: [
      ['key[a]', 1],
      ['key[b]', 2],
      ['key[c]', true],
      ['key[d]', 'Hello']
    ],
  };

  const testObject2 = {
    key: 'key',
    testObj: {
      a: { a: 1, b: 2, c: { f: 1, g: 'Hi'}},
      b: 2,
      c: true,
      d: 'Hello'
    },

    results: [
      ['key[a][a]', 1],
      ['key[a][b]', 2],
      ['key[a][c][f]', 1],
      ['key[a][c][g]', 'Hi'],
      ['key[b]', 2],
      ['key[c]', true],
      ['key[d]', 'Hello']
    ],
  };

  const testObject3 = {
    key: 'key',
    testObj: {
      a: { a: 1, b: 2, c: { f: 1, g: 'Hi'}},
      b: [1,2,3],
      c: true,
      d: 'Hello',
      e: [{s: 1}, {r: 2}]
    },

    results: [
      ['key[a][a]', 1],
      ['key[a][b]', 2],
      ['key[a][c][f]', 1],
      ['key[a][c][g]', 'Hi'],
      ['key[b][]', 1],
      ['key[b][]', 2],
      ['key[b][]', 3],
      ['key[c]', true],
      ['key[d]', 'Hello'],
      ['key[e][][s]', 1],
      ['key[e][][r]', 2],
    ],
  };

  const testObject4 = {
    key: 'key',
    testObj: {
      a: { a: [1,2,3], b: 2, c: { f: 1, g: 'Hi'}},
      b: [1,2,3],
    },

    results: [
      ['key[a][a][]', 1],
      ['key[a][a][]', 2],
      ['key[a][a][]', 3],
      ['key[a][b]', 2],
      ['key[a][c][f]', 1],
      ['key[a][c][g]', 'Hi'],
      ['key[b][]', 1],
      ['key[b][]', 2],
      ['key[b][]', 3],
    ],
  };

  const testObject5 = {
    key: 'key',
    testObj: {
      a: { a: [1,2,3], b: 2, c: { f: 1, g: 'Hi'}},
      b: [[1,2,3],['e','d'],{ a: 3}],
    },

    results: [
      ['key[a][a][]', 1],
      ['key[a][a][]', 2],
      ['key[a][a][]', 3],
      ['key[a][b]', 2],
      ['key[a][c][f]', 1],
      ['key[a][c][g]', 'Hi'],
      ['key[b][][]', 1],
      ['key[b][][]', 2],
      ['key[b][][]', 3],
      ['key[b][][]', 'e'],
      ['key[b][][]', 'd'],
      ['key[b][][a]', 3],
    ],
  };

  it('If it gets null object should return empty FormData', () => {
    const formData = objectToPhpFormData(null);

    expect(formData).toBeTruthy();
    expect(formData._parts.length).toBe(0);
  });

  it('If it gets empty main key should return empty FormData', () => {
    const formData = objectToPhpFormData({ key: '', requestData: {} });

    expect(formData).toBeTruthy();
    expect(formData._parts.length).toBe(0);
  });

  it('If it gets null request data should return empty FormData', () => {
    const formData = objectToPhpFormData({ key: 'key', requestData: null });

    expect(formData).toBeTruthy();
    expect(formData._parts.length).toBe(0);
  });

  it('If it gets corrupt request data should return empty FormData', () => {
    const formData = objectToPhpFormData({ key: 'key', requestData: 2 });

    expect(formData).toBeTruthy();
    expect(formData._parts.length).toBe(0);
  });

  it('Test on test objects', () => {
    let formData = objectToPhpFormData({
      key: testObject1.key,
      requestData: testObject1.testObj
    });
    expect(formData).toBeTruthy();
    expect(formData._parts).toEqual(testObject1.results);

    formData = objectToPhpFormData({
      key: testObject2.key,
      requestData: testObject2.testObj
    });
    expect(formData).toBeTruthy();
    expect(formData._parts).toEqual(testObject2.results);

    formData = objectToPhpFormData({
      key: testObject3.key,
      requestData: testObject3.testObj
    });
    expect(formData).toBeTruthy();
    expect(formData._parts).toEqual(testObject3.results);

    formData = objectToPhpFormData({
      key: testObject4.key,
      requestData: testObject4.testObj
    });
    expect(formData).toBeTruthy();
    expect(formData._parts).toEqual(testObject4.results);

    formData = objectToPhpFormData({
      key: testObject5.key,
      requestData: testObject5.testObj
    });
    expect(formData).toBeTruthy();
    expect(formData._parts).toEqual(testObject5.results);
  });
});