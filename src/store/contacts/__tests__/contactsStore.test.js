/* eslint-disable max-len, global-require */
import RNFetchBlob from 'react-native-fetch-blob';
import { cacheHelper, networkHelper } from 'utils';

import Store from '../../../store';
import config from '../../../config';
import { contactsData, groupsData } from './data';

const mobx = require('mobx');

const PROFILE = {
  business: {
    slug: '11111',
  },
};

jest.mock('react-native-navigation', () => ({
  Navigation: {
    showModal: jest.fn(() => {}),
    dismissModal: jest.fn(() => {}),
  },
})).mock('react-native-logging')
  .mock(
    '../../../store/communication/ui',
    () => function CommunicationUI() { return {}; }
  ).mock('../../../common/utils/networkHelper')
  .mock('../../../common/utils/cacheHelper')
  .mock('../../../store/auth');

describe('Store/Contcats', () => {
  let store;
  let getSpy;
  let postSpy;

  beforeAll(() => {
    networkHelper.isConnected.mockImplementation(() => true);
    cacheHelper.loadFromCache.mockImplementation(() => ({ data: 'data' }));
    cacheHelper.isCacheUpToDate.mockImplementation(() => false);
    RNFetchBlob.fetch = jest.fn(() => ({ uploadProgress: () => {} }));
  });

  beforeEach(() => {
    store = new Store(config);
    store.profiles.currentProfile = PROFILE;

    store.api.fetch = jest.fn(url => url);
    getSpy = jest.spyOn(store.api, 'get');
    postSpy = jest.spyOn(store.api, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = null;
  });

  it('ContactsStore should be created in the main store', () => {
    expect(store.contacts).toBeTruthy();
  });

  describe('Contacts/loadAllContacts', () => {
    it('loadAllContacts should call api with right url', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getAllContacts');
      await store.contacts.loadAllContacts();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch.mock.calls).toHaveLength(1);
      expect(store.api.fetch.mock.calls[0][0]).toBe(
        '/api/rest/v1/contact/business/11111'
      );
    });

    it('loadAllContacts should create right store structure if it receive data', async () => {
      networkHelper.loadFromApi.mockImplementationOnce(() => contactsData);
      await store.contacts.loadAllContacts();

      expect(store.contacts.contacts).toBeTruthy();
      expect(store.contacts.contactsPaginationData).toBeTruthy();
      expect(mobx.toJS(store.contacts.contactsPaginationData))
        .toEqual(contactsData.pagination_data);
      expect(mobx.toJS(store.contacts.contacts))
        .toEqual(contactsData.contact_models);
    });

    it('loadAllContacts should call api with next page if it calls again and option fromFirstPage = false', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getAllContacts');
      networkHelper.loadFromApi
        .mockImplementationOnce(() => contactsData)
        .mockImplementationOnce(() => {
          contactsData.pagination_data.current = '2';
          return contactsData;
        });

      await store.contacts.loadAllContacts();

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch.mock.calls).toHaveLength(1);
      expect(store.api.fetch).toHaveBeenLastCalledWith(
        '/api/rest/v1/contact/business/11111',
        { query: { access_token: undefined, page: 1 } }
      );
      expect(store.contacts.contactsPaginationData.current).toBe('1');
      expect(store.contacts.contacts)
        .toHaveLength(contactsData.contact_models.length);

      await store.contacts.loadAllContacts();

      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(2);
      expect(apiSpy).toHaveBeenCalledTimes(2);
      expect(getSpy).toHaveBeenCalledTimes(2);
      expect(store.api.fetch).toHaveBeenCalledTimes(2);
      expect(store.api.fetch.mock.calls).toHaveLength(2);
      expect(store.api.fetch).toHaveBeenLastCalledWith(
        '/api/rest/v1/contact/business/11111',
        { query: { access_token: undefined, page: 2 } }
      );
      expect(store.contacts.contactsPaginationData.current).toBe('2');
      expect(store.contacts.contacts)
        .toHaveLength(2 * contactsData.contact_models.length);

      contactsData.pagination_data.current = '1';
    });

    it('loadAllContacts should call api with 1 page if it calls again and option fromFirstPage = true', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getAllContacts');
      networkHelper.loadFromApi
        .mockImplementationOnce(() => contactsData)
        .mockImplementationOnce(() => contactsData);

      await store.contacts.loadAllContacts();

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch.mock.calls).toHaveLength(1);
      expect(store.api.fetch).toHaveBeenLastCalledWith(
        '/api/rest/v1/contact/business/11111',
        { query: { access_token: undefined, page: 1 } }
      );
      expect(store.contacts.contactsPaginationData.current).toBe('1');
      expect(store.contacts.contacts)
        .toHaveLength(contactsData.contact_models.length);

      await store.contacts.loadAllContacts({ fromFirstPage: true });

      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(2);
      expect(apiSpy).toHaveBeenCalledTimes(2);
      expect(getSpy).toHaveBeenCalledTimes(2);
      expect(store.api.fetch).toHaveBeenCalledTimes(2);
      expect(store.api.fetch.mock.calls).toHaveLength(2);
      expect(store.api.fetch).toHaveBeenLastCalledWith(
        '/api/rest/v1/contact/business/11111',
        { query: { access_token: undefined, page: 1 } }
      );
      expect(store.contacts.contactsPaginationData.current).toBe('1');
      expect(store.contacts.contacts)
        .toHaveLength(contactsData.contact_models.length);
    });

    it('loadAllContacts should NOT set store data if it gets error and should set error', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getAllContacts');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => { throw new Error('Server Error'); }
      );

      await store.contacts.loadAllContacts();

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.contacts.contactsPaginationData).toBeNull();
      expect(store.contacts.contacts).toHaveLength(0);
      expect(store.contacts.error).toBe('Server Error');
    });

    it('loadAllContacts isLoading should set to true while it is loading and to false then it ended it up', async (done) => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getAllContacts');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => {
          return new Promise((res) => {
            try {
              expect(store.contacts.isLoading).toBe(true);
              setTimeout(() => res(contactsData), 500);
              done();
            } catch (err) {
              done.fail(err);
            }
          });
        }
      );

      expect(store.contacts.isLoading).toBe(false);

      await store.contacts.loadAllContacts();

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.contacts.error).toBeFalsy();
      expect(store.contacts.isLoading).toBe(false);
    });
  });

  describe('Contacts/loadAllContactGroups', () => {
    it('loadAllContactGroups should call api with right url', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getAllContactGroups');
      await store.contacts.loadAllContactGroups();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch.mock.calls).toHaveLength(1);
      expect(store.api.fetch.mock.calls[0][0]).toBe(
        '/api/rest/v1/contact-group/business/11111'
      );
    });

    it('loadAllContactGroups should create right store structure if it receive data', async () => {
      networkHelper.loadFromApi.mockImplementationOnce(() => groupsData);
      await store.contacts.loadAllContactGroups();

      expect(store.contacts.contactGroups).toBeTruthy();
      expect(store.contacts.contactGroupsPaginationData).toBeTruthy();
      expect(mobx.toJS(store.contacts.contactGroupsPaginationData))
        .toEqual(groupsData.pagination_data);
      expect(mobx.toJS(store.contacts.contactGroups))
        .toEqual(groupsData.group_list);
    });

    it('loadAllContactGroups should call api with next page if it calls again and option fromFirstPage = false', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getAllContactGroups');
      networkHelper.loadFromApi
        .mockImplementationOnce(() => groupsData)
        .mockImplementationOnce(() => {
          groupsData.pagination_data.current = '2';
          return groupsData;
        });

      await store.contacts.loadAllContactGroups();

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch.mock.calls).toHaveLength(1);
      expect(store.api.fetch).toHaveBeenLastCalledWith(
        '/api/rest/v1/contact-group/business/11111',
        { query: { access_token: undefined, page: 1 } }
      );
      expect(store.contacts.contactGroupsPaginationData.current).toBe('1');
      expect(store.contacts.contactGroups)
        .toHaveLength(groupsData.group_list.length);

      groupsData.pagination_data.pageCount = 2;

      await store.contacts.loadAllContactGroups();

      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(2);
      expect(apiSpy).toHaveBeenCalledTimes(2);
      expect(getSpy).toHaveBeenCalledTimes(2);
      expect(store.api.fetch).toHaveBeenCalledTimes(2);
      expect(store.api.fetch.mock.calls).toHaveLength(2);
      expect(store.api.fetch).toHaveBeenLastCalledWith(
        '/api/rest/v1/contact-group/business/11111',
        { query: { access_token: undefined, page: 2 } }
      );
      expect(store.contacts.contactGroupsPaginationData.current).toBe('2');
      expect(store.contacts.contactGroups)
        .toHaveLength(2 * groupsData.group_list.length);

      groupsData.pagination_data.current = '1';
    });

    it('loadAllContactGroups should call api with 1 page if it calls again and option fromFirstPage = true', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getAllContactGroups');
      networkHelper.loadFromApi
        .mockImplementationOnce(() => groupsData)
        .mockImplementationOnce(() => groupsData);

      await store.contacts.loadAllContactGroups();

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch.mock.calls).toHaveLength(1);
      expect(store.api.fetch).toHaveBeenLastCalledWith(
        '/api/rest/v1/contact-group/business/11111',
        { query: { access_token: undefined, page: 1 } }
      );
      expect(store.contacts.contactGroupsPaginationData.current).toBe('1');
      expect(store.contacts.contactGroups)
        .toHaveLength(groupsData.group_list.length);

      await store.contacts.loadAllContactGroups({ fromFirstPage: true });

      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(2);
      expect(apiSpy).toHaveBeenCalledTimes(2);
      expect(getSpy).toHaveBeenCalledTimes(2);
      expect(store.api.fetch).toHaveBeenCalledTimes(2);
      expect(store.api.fetch.mock.calls).toHaveLength(2);
      expect(store.api.fetch).toHaveBeenLastCalledWith(
        '/api/rest/v1/contact-group/business/11111',
        { query: { access_token: undefined, page: 1 } }
      );
      expect(store.contacts.contactGroupsPaginationData.current).toBe('1');
      expect(store.contacts.contactGroups)
        .toHaveLength(groupsData.group_list.length);
    });

    it('loadAllContactGroups should NOT set store data if it gets error and should set error', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getAllContactGroups');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => { throw new Error('Server Error'); }
      );

      await store.contacts.loadAllContactGroups();

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.contacts.contactGroupsPaginationData).toBeNull();
      expect(store.contacts.contactGroups).toHaveLength(0);
      expect(store.contacts.error).toBe('Server Error');
    });

    it('loadAllContactGroups isLoading should set to true while it is loading and to false then it ended it up', async (done) => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getAllContactGroups');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => {
          return new Promise((res) => {
            try {
              expect(store.contacts.isLoading).toBe(true);
              setTimeout(() => res(groupsData), 500);
              done();
            } catch (err) {
              done.fail(err);
            }
          });
        }
      );

      expect(store.contacts.isLoading).toBe(false);

      await store.contacts.loadAllContactGroups();

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.contacts.error).toBeFalsy();
      expect(store.contacts.isLoading).toBe(false);
    });
  });

  describe('Contacts/getGroupDetails', () => {
    it('getGroupDetails should call api with right url', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getGroupDetails');
      const result = await store.contacts.getGroupDetails(11111);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(result).toBe(false);
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch.mock.calls).toHaveLength(1);
      expect(store.api.fetch.mock.calls[0][0]).toBe(
        '/api/rest/v1/contact-group/11111'
      );
    });

    it('getGroupDetails should not call api if businessId = null | undefined | empty string', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getGroupDetails');
      const result1 = await store.contacts.getGroupDetails(null);
      const result2 = await store.contacts.getGroupDetails(undefined);
      const result3 = await store.contacts.getGroupDetails('');

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(getSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();
      expect(result1).toBe(null);
      expect(result2).toBe(null);
      expect(result3).toBe(null);
    });

    it('getGroupDetails should NOT set isLoading true while it is loading', async (done) => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getGroupDetails');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => {
          return new Promise((res) => {
            try {
              expect(store.contacts.isLoading).toBe(false);
              setTimeout(() => res(1), 500);
              done();
            } catch (err) {
              done.fail(err);
            }
          });
        }
      );

      expect(store.contacts.isLoading).toBe(false);

      await store.contacts.getGroupDetails(11111);

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(store.contacts.error).toBeFalsy();
      expect(store.contacts.isLoading).toBe(false);
    });

    it('getGroupDetails should NOT set store error if it gets error while getting data', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'getGroupDetails');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => { throw new Error('Server Error'); }
      );

      const result = await store.contacts.getGroupDetails(11111);

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(result).toBe(false);
      expect(store.contacts.error).toBe('');
    });
  });

  describe('Contacts Store/createNewContact(contact)', () => {
    it('crateNewContact should call api with right url', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'createNewContact');

      await store.contacts.createNewContact(contactsData.fakeContact);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch.mock.calls).toHaveLength(1);
      expect(store.api.fetch.mock.calls[0][0]).toBe(
        '/api/rest/v1/contact/business/11111'
      );
    });

    it('crateNewContact should NOT call api if newContact = null | undefined', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'createNewContact');

      await store.contacts.createNewContact(null);
      await store.contacts.createNewContact(undefined);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Contacts Store/uploadContactLogo', () => {
    it('uploadContactLogo should call api with right url', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'uploadContactLogo');
      const uploadFile = {
        url: 'file/url',
        name: 'filename.png',
      };

      await store.contacts.uploadContactLogo(uploadFile);

      // It works not through apiHelper and do not use common api
      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();

      expect(RNFetchBlob.fetch).toHaveBeenCalledTimes(1);
      expect(store.contacts.logoUploadingProgress).toBe(0);
      expect(apiSpy).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith(uploadFile);
    });

    it('uploadContactLogo should NOT call api if logoFile = null | undefined', async () => {
      const apiSpy = jest.spyOn(store.api.contacts, 'uploadContactLogo');

      await store.contacts.uploadContactLogo(null);
      await store.contacts.uploadContactLogo(undefined);

      expect(RNFetchBlob.fetch).not.toHaveBeenCalled();
      expect(store.contacts.logoUploadingProgress).toBe(0);
      expect(apiSpy).not.toHaveBeenCalled();
    });
  });

  describe('Contacts Store/addContactToSelected', () => {
    it('addContactToSelected should add contact to store', async () => {
      expect(store.contacts.selectedContacts).toHaveLength(0);

      store.contacts.addContactToSelected(contactsData.fakeContact);

      expect(store.contacts.selectedContacts).toHaveLength(1);
      expect(mobx.toJS(store.contacts.selectedContacts[0])).toEqual(contactsData.fakeContact);
    });

    it('addContactToSelected should NOT add contact to store if contact = null | undefined', async () => {
      expect(store.contacts.selectedContacts).toHaveLength(0);

      store.contacts.addContactToSelected(null);
      store.contacts.addContactToSelected(undefined);

      expect(store.contacts.selectedContacts).toHaveLength(0);
    });
  });

  describe('Contacts Store/removeContactFromSelected', () => {
    it('removeContactFromSelected should remove contact from store', async () => {
      const { fakeContact } = contactsData;
      expect(store.contacts.selectedContacts).toHaveLength(0);

      store.contacts.addContactToSelected(fakeContact);

      expect(store.contacts.selectedContacts).toHaveLength(1);
      expect(mobx.toJS(store.contacts.selectedContacts[0])).toEqual(fakeContact);

      store.contacts.removeContactFromSelected(fakeContact.id);

      expect(store.contacts.selectedContacts).toHaveLength(0);
    });

    it('removeContactFromSelected should NOT remove contact from store if its not there', async () => {
      const { fakeContact } = contactsData;
      expect(store.contacts.selectedContacts).toHaveLength(0);

      store.contacts.addContactToSelected(fakeContact);

      expect(store.contacts.selectedContacts).toHaveLength(1);
      expect(mobx.toJS(store.contacts.selectedContacts[0])).toEqual(fakeContact);

      store.contacts.removeContactFromSelected(2);

      expect(store.contacts.selectedContacts).toHaveLength(1);
    });

    it('removeContactFromSelected should NOT remove contact from store if id = null | undefined', async () => {
      const { fakeContact } = contactsData;
      expect(store.contacts.selectedContacts).toHaveLength(0);

      store.contacts.addContactToSelected(fakeContact);

      expect(store.contacts.selectedContacts).toHaveLength(1);
      expect(mobx.toJS(store.contacts.selectedContacts[0])).toEqual(fakeContact);

      store.contacts.removeContactFromSelected(null);
      store.contacts.removeContactFromSelected(undefined);

      expect(store.contacts.selectedContacts).toHaveLength(1);
    });
  });

  describe('Contacts Store/checkContactSelected', () => {
    it('checkContactSelected should return true if contact selected', async () => {
      const { fakeContact } = contactsData;
      expect(store.contacts.selectedContacts).toHaveLength(0);

      store.contacts.addContactToSelected(fakeContact);

      expect(store.contacts.selectedContacts).toHaveLength(1);
      expect(mobx.toJS(store.contacts.selectedContacts[0])).toEqual(fakeContact);

      expect(store.contacts.checkContactSelected(fakeContact.id)).toBe(true);
    });

    it('checkContactSelected should return false if contact is NOT selected', async () => {
      const { fakeContact } = contactsData;
      expect(store.contacts.selectedContacts).toHaveLength(0);

      store.contacts.addContactToSelected(fakeContact);

      expect(store.contacts.selectedContacts).toHaveLength(1);
      expect(mobx.toJS(store.contacts.selectedContacts[0])).toEqual(fakeContact);

      expect(store.contacts.checkContactSelected(2)).toBe(false);
    });

    it('checkContactSelected should return false if contact id = null | undefined', async () => {
      const { fakeContact } = contactsData;
      expect(store.contacts.selectedContacts).toHaveLength(0);

      store.contacts.addContactToSelected(fakeContact);

      expect(store.contacts.selectedContacts).toHaveLength(1);
      expect(mobx.toJS(store.contacts.selectedContacts[0])).toEqual(fakeContact);

      expect(store.contacts.checkContactSelected(null)).toBe(false);
      expect(store.contacts.checkContactSelected(undefined)).toBe(false);
    });
  });

  describe('Contacts Store/addContactsFromGroupToSelected(groupId: number) ', () => {
    it('addContactsFromGroupToSelected should add all group contacts to selected contacts', async () => {
      const { fakeGroup } = groupsData;
      const { contacts } = store;
      contacts.getGroupDetails = jest.fn(() => Promise.resolve(fakeGroup));

      expect(contacts.selectedContacts).toHaveLength(0);

      contacts.contactGroupsCache.set(fakeGroup.id, fakeGroup);
      contacts.addContactsFromGroupToSelected(fakeGroup.id);

      expect(contacts.getGroupDetails).not.toHaveBeenCalled();
      expect(contacts.selectedContacts)
        .toHaveLength(fakeGroup.contact_models.length);
    });

    it('addContactsFromGroupToSelected should NOT add any contacts if there is no such group', async () => {
      const { contacts } = store;
      contacts.getGroupDetails = jest.fn(() => Promise.resolve(1));

      expect(contacts.selectedContacts).toHaveLength(0);

      contacts.addContactsFromGroupToSelected(10);

      expect(contacts.getGroupDetails).toHaveBeenCalled();
      expect(contacts.selectedContacts).toHaveLength(0);
    });
  });

  describe('Contacts Store/removeContactsGroupFromSelected(groupId: number) ', () => {
    it('removeContactsGroupFromSelected should remove all group contacts from selected contacts', async () => {
      const { fakeGroup } = groupsData;
      const { contacts } = store;
      contacts.getGroupDetails = jest.fn(() => Promise.resolve(fakeGroup));

      contacts.contactGroupsCache.set(fakeGroup.id, fakeGroup);
      contacts.addContactsFromGroupToSelected(fakeGroup.id);

      expect(contacts.selectedContacts)
        .toHaveLength(fakeGroup.contact_models.length);

      contacts.removeContactsGroupFromSelected(fakeGroup.id);
      expect(contacts.getGroupDetails).not.toHaveBeenCalled();
      expect(contacts.selectedContacts).toHaveLength(0);
    });

    it('removeContactsGroupFromSelected should NOT remove any contacts if there is no such group', async () => {
      const { fakeGroup } = groupsData;
      const { contacts } = store;
      contacts.getGroupDetails = jest.fn(() => Promise.resolve(fakeGroup));

      contacts.contactGroupsCache.set(fakeGroup.id, fakeGroup);
      contacts.addContactsFromGroupToSelected(fakeGroup.id);

      expect(contacts.selectedContacts)
        .toHaveLength(fakeGroup.contact_models.length);

      contacts.removeContactsGroupFromSelected(10);
      expect(contacts.getGroupDetails).toHaveBeenCalled();
      expect(contacts.selectedContacts)
        .toHaveLength(fakeGroup.contact_models.length);
    });
  });

  describe('Contacts Store/sendInviteMessage(contactId: number)', () => {
    it('sendInviteMessage should call api with right url', async () => {
      const { api, contacts } = store;
      const apiSpy = jest.spyOn(api.contacts, 'sendInviteMessage');

      await contacts.sendInviteMessage(contactsData.fakeContact.id);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch.mock.calls).toHaveLength(1);
      expect(store.api.fetch.mock.calls[0][0]).toBe(
        '/api/rest/v1/contact/invite'
      );
    });

    it('sendInviteMessage should NOT call api if id = undefined', async () => {
      const { api, contacts } = store;
      const apiSpy = jest.spyOn(api.contacts, 'sendInviteMessage');

      await contacts.sendInviteMessage();

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();
    });
  });
});