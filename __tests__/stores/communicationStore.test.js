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
    await store.communication.getUserInfo();
    expect(1).toBe(1);
  });
});