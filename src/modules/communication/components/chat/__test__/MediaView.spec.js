import { calcImageDimensions } from '../MediaView';

describe('communication/MediaView', () => {
  describe('calcImageDimensions', () => {
    it('should return valid dimensions for a small picture', () => {
      const src = { width: 50, height: 50 };
      expect(calcImageDimensions(src)).toEqual(src);
    });

    it('should return valid dimensions for a portrait picture', () => {
      const src = { width: 200, height: 600 };
      expect(calcImageDimensions(src)).toEqual({
        width: 100,
        height: 300,
      });
    });

    it('should return valid dimensions for a landscape picture', () => {
      const src = { width: 600, height: 200 };
      expect(calcImageDimensions(src)).toEqual({
        width: 300,
        height: 100,
      });
    });

    it('should return valid dimensions for wrong properties', () => {
      expect(calcImageDimensions(null)).toEqual({
        width: 300,
        height: 300,
      });
    });
  });
});