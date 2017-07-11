/* eslint-disable max-len, global-require */
import { networkHelper } from 'utils';

global.fetch = jest.fn();

const OK_RESP = {
  ok: true,
  error: '',
  status: 200,
  data: {
    a: 'data',
    b: 1,
  },
};

const NOT_OK_RESP = {
  ok: false,
  error: 'Server error!',
  errorDescription: 'Server error!',
  status: 500,
};

const OUT_OF_TIMEOUT = 1000;

describe('Utils/networkHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('networkHelper/isConnected', () => {
    it('networkHelper isConnected should return true if HEAD request return response with status 200', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(OK_RESP));
      const result = await networkHelper.isConnected();

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('networkHelper isConnected should return false if HEAD request return response with status NOT 200', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(NOT_OK_RESP));
      const result = await networkHelper.isConnected();

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('networkHelper isConnected should return false if HEAD request fails and get rejected', async () => {
      global.fetch.mockImplementation(() => Promise.reject(NOT_OK_RESP));
      const result = await networkHelper.isConnected();

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('networkHelper isConnected should return false if HEAD request fails due to timeout = 10sec', async () => {
      global.fetch.mockImplementation(() => {
        return new Promise((res) => {
          setTimeout(() => {
            res(OK_RESP);
          }, OUT_OF_TIMEOUT);
        });
      });

      const result = await networkHelper.isConnected(OUT_OF_TIMEOUT - 200);

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('networkHelper isConnected should return false by TIMEOUT for first request and true for second normal request', async () => {
      global.fetch.mockImplementationOnce(() => {
        return new Promise((res) => {
          setTimeout(() => {
            res(OK_RESP);
          }, OUT_OF_TIMEOUT);
        });
      }).mockImplementationOnce(() => Promise.resolve(OK_RESP));

      const results = await Promise.all([
        networkHelper.isConnected(OUT_OF_TIMEOUT - 200),
        networkHelper.isConnected(),
      ]);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(results).toHaveLength(2);
      expect(results[0]).toBe(false);
      expect(results[1]).toBe(true);
    });
  });

  describe('networkHelper/LoadFromApi', () => {
    it('networkHelper LoadFromApi should return right data with which apiPromise was resolved', async () => {
      const result = await networkHelper.loadFromApi(Promise.resolve(OK_RESP));
      expect(result).toEqual(OK_RESP.data);
    });

    it('networkHelper LoadFromApi should return error if apiPromise gets rejected', async () => {
      const result = await networkHelper.loadFromApi(Promise.reject(NOT_OK_RESP));
      expect(result).toEqual({ error: networkHelper.errorConnection });
    });

    it('networkHelper LoadFromApi should return error by timeout', async () => {
      const result = await networkHelper.loadFromApi(
        new Promise((res) => {
          setTimeout(() => res(OK_RESP), OUT_OF_TIMEOUT);
        }),
        OUT_OF_TIMEOUT - 200
      );

      expect(result).toEqual({ error: networkHelper.errorTimeout });
    });

    it('networkHelper loadFromApi should return error by TIMEOUT for first request and data for second parallel request', async () => {
      const outTimeoutPromise = new Promise((res) => {
        setTimeout(() => res(OK_RESP), OUT_OF_TIMEOUT);
      });

      const results = await Promise.all([
        networkHelper.loadFromApi(outTimeoutPromise, OUT_OF_TIMEOUT - 200),
        networkHelper.loadFromApi(Promise.resolve(OK_RESP)),
      ]);

      expect(results).toHaveLength(2);

      expect(results[0]).toEqual({ error: networkHelper.errorTimeout });
      expect(results[1]).toEqual(OK_RESP.data);
    });
  });
});