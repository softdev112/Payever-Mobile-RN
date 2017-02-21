import format from '../format';

describe('utils/format', () => {
  describe('currency', () => {
    it('should format currency correctly', () => {
      expect(format.currency(1000)).toEqual('1,000.00€');
      expect(format.currency(1000000)).toEqual('1,000,000.00€');
      expect(format.currency(10.2)).toEqual('10.20€');
      expect(format.currency(-10.2)).toEqual('-10.20€');
      expect(format.currency(1399.99, '$')).toEqual('1,399.99$');
    });
  });
});