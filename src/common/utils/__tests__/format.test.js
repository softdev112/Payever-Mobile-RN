import format from '../format';

describe('utils.format', () => {
  describe('currency', () => {
    it('should format currency correctly', () => {
      expect(format.currency(1000)).toEqual('1,000.00€');
      expect(format.currency(1000000)).toEqual('1,000,000.00€');
      expect(format.currency(10.2)).toEqual('10.20€');
      expect(format.currency(-10.2)).toEqual('-10.20€');
      expect(format.currency(1399.99, '$')).toEqual('1,399.99$');
    });
  });

  describe('size', () => {
    expect(format.size(0)).toEqual('0 B');
    expect(format.size(500)).toEqual('500 B');
    expect(format.size(1000)).toEqual('1 KB');
    expect(format.size(1100)).toEqual('1.1 KB');
    expect(format.size(1000 * 1000 * 3)).toEqual('3 MB');
    expect(format.size(1000 * 1000 * 3.5)).toEqual('3.5 MB');
  });

  describe('stripHtml', () => {
    it('Should be pure string without any html tags', () => {
      expect(format.stripHtml('<p>Hello World!!!<p/>')).toBe('Hello World!!!');
      expect(format.stripHtml('<p>Hello<div> World!!!</div></p>'))
        .toBe('Hello World!!!');
      expect(format.stripHtml('<div><p>Hello<p></p> World!!!</p></div>'))
        .toBe('Hello World!!!');
      expect(format.stripHtml('<p><div>Hello</div></p> <div>World!!!</div>'))
        .toBe('Hello World!!!');
      expect(format.stripHtml('<p></p>Hello <div>Wor<p>ld!!!</p></div>'))
        .toBe('Hello World!!!');
    });
  });
});