/**
 * Created by Elf on 25.01.2017.
 */
import Store from '../../src/store';
import config from '../../src/config';

/* eslint-disable global-require */
jest.mock('mobx-react/native', () => require('mobx-react/custom'));

describe('Communication Store Tests', () => {
  let store;

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
    store.userProfiles.currentProfile = {
      id: 'again-9',
      isBusiness: true,
    };
    const bb = await store.communication.getUserInfo();
    console.log(bb);
    expect(store.contacts.length).toBeGreaterThan(0);
  });
});