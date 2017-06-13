function testFunction({
  fromHour, fromMinute, toHour, toMinute, testHour, testMinute,
}) {
  if (fromHour < toHour) {
    if (testHour === fromHour) {
      return testMinute >= fromMinute;
    } else if (testHour === toHour) {
      return testMinute <= toMinute;
    }

    return testHour > fromHour && testHour <= toHour;
  } else if (fromHour === toHour) {
    return (fromMinute < toMinute && testMinute >= fromMinute
      && testMinute <= toMinute);
  } else if ((testHour > fromHour && testHour > 0)
    || (testHour === fromHour && testMinute > fromMinute)) {
    return true;
  } else if ((testHour < toHour && testHour >= 0)
    || (testHour === toHour && testHour <= toMinute)) {
    return true;
  }

  return false;
}

describe('utils.soundHelper', () => {
  describe('Set of test times in no disturb period', () => {
    it('Test object №1+ should be in silent period', () => {
      const testObject = {
        fromHour: 10,
        fromMinute: 50,
        toHour: 20,
        toMinute: 40,
        testHour: 11,
        testMinute: 30,
        result: true,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №2+ should be in silent period', () => {
      const testObject = {
        fromHour: 10,
        fromMinute: 50,
        toHour: 20,
        toMinute: 40,
        testHour: 10,
        testMinute: 55,
        result: true,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №3+ should be in silent period', () => {
      const testObject = {
        fromHour: 10,
        fromMinute: 50,
        toHour: 20,
        toMinute: 40,
        testHour: 20,
        testMinute: 30,
        result: true,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №4+ should be in silent period', () => {
      const testObject = {
        fromHour: 22,
        fromMinute: 0,
        toHour: 2,
        toMinute: 40,
        testHour: 23,
        testMinute: 30,
        result: true,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №5+ should be in silent period', () => {
      const testObject = {
        fromHour: 23,
        fromMinute: 0,
        toHour: 0,
        toMinute: 0,
        testHour: 23,
        testMinute: 30,
        result: true,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №6+ should be in silent period', () => {
      const testObject = {
        fromHour: 23,
        fromMinute: 0,
        toHour: 2,
        toMinute: 40,
        testHour: 1,
        testMinute: 50,
        result: true,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №7+ should be in silent period', () => {
      const testObject = {
        fromHour: 23,
        fromMinute: 0,
        toHour: 1,
        toMinute: 40,
        testHour: 1,
        testMinute: 50,
        result: true,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №8+ should be in silent period', () => {
      const testObject = {
        fromHour: 23,
        fromMinute: 0,
        toHour: 0,
        toMinute: 40,
        testHour: 0,
        testMinute: 0,
        result: true,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №9+ should be in silent period', () => {
      const testObject = {
        fromHour: 0,
        fromMinute: 0,
        toHour: 0,
        toMinute: 40,
        testHour: 0,
        testMinute: 2,
        result: true,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });
  });

  describe('Set of test times out of disturb period', () => {
    it('Test object №1- should NOT be in silent period', () => {
      const testObject = {
        fromHour: 11,
        fromMinute: 0,
        toHour: 15,
        toMinute: 40,
        testHour: 10,
        testMinute: 50,
        result: false,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №2- should NOT be in silent period', () => {
      const testObject = {
        fromHour: 11,
        fromMinute: 0,
        toHour: 15,
        toMinute: 40,
        testHour: 16,
        testMinute: 50,
        result: false,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №2- should NOT be in silent period', () => {
      const testObject = {
        fromHour: 11,
        fromMinute: 20,
        toHour: 15,
        toMinute: 10,
        testHour: 11,
        testMinute: 10,
        result: false,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №3- should NOT be in silent period', () => {
      const testObject = {
        fromHour: 11,
        fromMinute: 20,
        toHour: 15,
        toMinute: 10,
        testHour: 15,
        testMinute: 50,
        result: false,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });

    it('Test object №4- should NOT be in silent period', () => {
      const testObject = {
        fromHour: 0,
        fromMinute: 5,
        toHour: 0,
        toMinute: 10,
        testHour: 0,
        testMinute: 50,
        result: false,
      };

      expect(testFunction(testObject)).toBe(testObject.result);
    });
  });
});