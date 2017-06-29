/**
 * Created by Elf on 25.01.2017.
 */
import MessengerInfo from './test-data/MessengerInfoData';
import Store from '../../../src/store';
import config from '../../../src/config';
import {
  isConnected,
  loadFromApi,
} from '../../../src/common/utils/networkHelper';

jest.mock('../../../src/common/utils/apiHelper/network');
jest.mock('../../../src/common/utils/apiHelper/cache');

describe('Communication Store Tests', () => {
  let store;

  beforeAll(() => {
    isConnected.mockImplementation(() => true);
    loadFromApi.mockImplementation(() => MessengerInfo);
  });

  beforeEach(() => {
    store = new Store(config);
  });

  afterEach(() => {
    store = null;
  });

  it('CommunicationStore is created in the main store', () => {
    expect(store.communication).toBeTruthy();
  });

  it('Call action getUserInfo should set store state to truthy', async () => {
    const profile = {
      id: 'again-9',
      business: {
        slug: 'again-9',
      },
      isBusiness: true,
    };

    await store.communication.loadMessengerInfo(profile);

    const { profiles } = store.communication;

    expect(Object.keys(profiles[profile.id]).length).toBeGreaterThan(0);
    expect(profiles[profile.id].messengerUser.id).toBe(16227);
  });
});