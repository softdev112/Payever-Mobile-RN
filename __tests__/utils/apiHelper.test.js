/**
 * Created by Elf on 25.01.2017.
 */
import {
  isConnected,
  loadFromApi,
} from '../../src/common/utils/apiHelper/network';
import apiHelper from '../../src/common/utils/apiHelper';

jest.mock('../../src/common/utils/apiHelper/network');
jest.mock('../../src/common/utils/apiHelper/cache');

describe('apiHelper Tests', () => {
  beforeAll(() => {
    isConnected.mockImplementation(() => true);
    loadFromApi.mockImplementation(() => {});
  });

  beforeEach(() => {
  });

  afterEach(() => {
  });

  it('apiHelper if promise is null should return null', () => {
    const result = apiHelper(null);

    expect(result.apiPromise).toBeNull();
  });
});