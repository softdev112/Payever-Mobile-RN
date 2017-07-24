/* eslint-disable max-len, global-require */
import RNFetchBlob from 'react-native-fetch-blob';
import { cacheHelper, networkHelper, soundHelper } from 'utils';

import Conversation from '../models/Conversation';
import MessengerInfo from '../models/MessengerInfo';
import Store from '../../../store';
import config from '../../../config';
import WampClient from '../../../common/api/MessengerApi/WampClient';
import SocketApi from '../../../common/api/MessengerApi/SocketApi';
import { conversationData, messengerData } from './data';

const mobx = require('mobx');

const BUSINESS_PROFILE = {
  isBusiness: true,
  business: {
    slug: '11111',
  },
};

const PRIVATE_PROFILE = {
  isBusiness: false,
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
    () => function CommunicationUI() {
      return ({
        setSelectMode: jest.fn(),
        setForwardMode: jest.fn(),
      });
    }
  ).mock('../../../common/utils/networkHelper')
  .mock('../../../common/utils/cacheHelper')
  .mock('../../../common/utils/soundHelper')
  .mock('../../../common/api/MessengerApi/WampClient')
  .mock('../../../store/auth');

describe('Store/Communication', () => {
  let store;
  let communication;
  let api;
  let getSpy;
  let postSpy;
  let wampCall;

  beforeAll(() => {
    SocketApi.prototype.resolveWhenConnected =
      jest.fn().mockReturnThis();
    wampCall = jest.fn(() => {});
    WampClient.prototype.call = wampCall;

    networkHelper.isConnected.mockImplementation(() => true);
    cacheHelper.loadFromCache.mockImplementation(() => ({ data: 'data' }));
    cacheHelper.isCacheUpToDate.mockImplementation(() => false);
  });

  beforeEach(() => {
    store = new Store(config);
    communication = store.communication;
    api = store.api;

    api.fetch = jest.fn(url => url);
    getSpy = jest.spyOn(store.api, 'get');
    postSpy = jest.spyOn(store.api, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = null;
  });

  it('CommunicationStore should be created in the main store', () => {
    expect(store.communication).toBeTruthy();
  });

  describe('Communication/loadMessengerInfo(profile: BusinessProfile)', () => {
    it('loadMessengerInfo should call api with right url and set store properly for the business profile', async () => {
      const apySpy = jest.spyOn(api.messenger, 'getBusiness');
      const socketInitSpy = jest.spyOn(communication, 'initSocket')
        .mockImplementationOnce(() => {});
      const setSelectedConversationSpy = jest.spyOn(
        communication,
        'setSelectedConversationId'
      ).mockImplementationOnce(() => {});

      cacheHelper.loadFromCache.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );

      await communication.loadMessengerInfo(BUSINESS_PROFILE);

      expect(networkHelper.isConnected).toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).toHaveBeenCalled();
      expect(apySpy).toHaveBeenCalled();
      expect(socketInitSpy).toHaveBeenCalled();
      expect(setSelectedConversationSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalledWith(
        `/api/rest/v1/messenger/business/${BUSINESS_PROFILE.business.slug}`,
        { query: { access_token: undefined } }
      );

      expect(soundHelper.setUserSettings).toHaveBeenCalled();
      expect(communication.messengerInfo.conversations).toHaveLength(1);
      expect(communication.messengerInfo.groups).toHaveLength(3);
      expect(communication.messengerInfo.marketingGroups).toHaveLength(1);
    });

    it('loadMessengerInfo should call api with right url and set store properly for the private profile', async () => {
      const apySpy = jest.spyOn(api.messenger, 'getPrivate');
      const socketInitSpy = jest.spyOn(communication, 'initSocket')
        .mockImplementationOnce(() => {});
      const setSelectedConversationSpy = jest.spyOn(
        communication,
        'setSelectedConversationId'
      ).mockImplementationOnce(() => {});

      cacheHelper.loadFromCache.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );

      await communication.loadMessengerInfo(PRIVATE_PROFILE);

      expect(networkHelper.isConnected).toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).toHaveBeenCalled();
      expect(apySpy).toHaveBeenCalled();
      expect(socketInitSpy).toHaveBeenCalled();
      expect(setSelectedConversationSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalledWith(
        '/api/rest/v1/messenger/private',
        { query: { access_token: undefined } }
      );

      expect(soundHelper.setUserSettings).toHaveBeenCalled();
      expect(communication.messengerInfo.conversations).toHaveLength(1);
      expect(communication.messengerInfo.groups).toHaveLength(3);
      expect(communication.messengerInfo.marketingGroups).toHaveLength(1);
    });

    it('loadMessengerInfo should NOT call api if business profile = null', async () => {
      const apySpy = jest.spyOn(api.messenger, 'getBusiness');
      const socketInitSpy = jest.spyOn(communication, 'initSocket')
        .mockImplementationOnce(() => {});
      const setSelectedConversationSpy = jest.spyOn(
        communication,
        'setSelectedConversationId'
      ).mockImplementationOnce(() => {});

      await communication.loadMessengerInfo(null);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(apySpy).not.toHaveBeenCalled();
      expect(socketInitSpy).not.toHaveBeenCalled();
      expect(setSelectedConversationSpy).not.toHaveBeenCalled();
      expect(getSpy).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
    });


    it('loadMessengerInfo should NOT call setSelectedConversationId if it is a phone mode', async () => {
      const apySpy = jest.spyOn(api.messenger, 'getBusiness');
      const socketInitSpy = jest.spyOn(communication, 'initSocket')
        .mockImplementationOnce(() => {});
      const setSelectedConversationSpy = jest.spyOn(
        communication,
        'setSelectedConversationId'
      ).mockImplementationOnce(() => {});

      cacheHelper.loadFromCache.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );

      store.ui.phoneMode = true;
      await communication.loadMessengerInfo(BUSINESS_PROFILE);

      expect(apySpy).toHaveBeenCalled();
      expect(socketInitSpy).toHaveBeenCalled();
      expect(setSelectedConversationSpy).not.toHaveBeenCalled();
    });

    it('loadMessengerInfo should call setSelectedConversationId if selectedConversationId = null and phoneMode = false', async () => {
      const apySpy = jest.spyOn(api.messenger, 'getBusiness');
      const socketInitSpy = jest.spyOn(communication, 'initSocket')
        .mockImplementationOnce(() => {});
      const setSelectedConversationSpy = jest.spyOn(
        communication,
        'setSelectedConversationId'
      ).mockImplementationOnce(() => {});

      cacheHelper.loadFromCache.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );

      store.ui.phoneMode = false;
      await communication.loadMessengerInfo(BUSINESS_PROFILE);

      expect(apySpy).toHaveBeenCalled();
      expect(socketInitSpy).toHaveBeenCalled();
      expect(setSelectedConversationSpy).toHaveBeenCalled();
    });

    it('loadMessengerInfo should NOT call setSelectedConversationId if selectedConversationId != null and phoneMode = false', async () => {
      const apySpy = jest.spyOn(api.messenger, 'getBusiness');
      const socketInitSpy = jest.spyOn(communication, 'initSocket')
        .mockImplementationOnce(() => {});
      const setSelectedConversationSpy = jest.spyOn(
        communication,
        'setSelectedConversationId'
      ).mockImplementationOnce(() => {});

      cacheHelper.loadFromCache.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );

      store.ui.phoneMode = false;
      communication.selectedConversationId = 11111;
      await communication.loadMessengerInfo(BUSINESS_PROFILE);

      expect(apySpy).toHaveBeenCalled();
      expect(socketInitSpy).toHaveBeenCalled();
      expect(setSelectedConversationSpy).not.toHaveBeenCalled();
    });
  });

  describe('Communication/loadConversation(id: number, limit: number = MSGS_REQUEST_LIMIT)', () => {
    it('loadConversation should call api with right url and set store properly', async () => {
      const apiSpy = jest.spyOn(SocketApi.prototype, 'getConversation');
      cacheHelper.loadFromCache.mockImplementationOnce(() => null)
        .mockImplementationOnce(() => null);

      const { conversation } = conversationData;
      networkHelper.loadFromApi.mockImplementationOnce(
          () => Promise.resolve(Object.assign({}, conversation))
      );

      communication.initSocket('communication/socket/url', 11111);
      communication.messengerInfo.getConversationType = jest.fn(
        () => 'conversation'
      );
      communication.messengerInfo.byId = jest.fn(() => conversation.id);

      await communication.loadConversation(conversation.id);

      expect(apiSpy).toHaveBeenCalledTimes(1);
      expect(communication.conversations.size).toBe(1);
      expect(
        communication.conversations.get(conversation.id).allMessagesFetched
      ).toBe(false);

      expect(
        communication.conversations.get(conversation.id).messages
      ).toHaveLength(conversation.messages.length);
    });

    it('loadConversation should NOT update conversation if it gets error while reading data', async () => {
      const apiSpy = jest.spyOn(SocketApi.prototype, 'getConversation');
      cacheHelper.isCacheUpToDate
        .mockImplementationOnce(() => true)
        .mockImplementationOnce(() => false);
      cacheHelper.loadFromCache.mockImplementationOnce(
        () => Promise.resolve(Object.assign({}, messengerData))
      );
      cacheHelper.loadFromCache.mockImplementationOnce(
        () => Promise.resolve(null)
      );
      networkHelper.loadFromApi.mockImplementationOnce(
        () => { throw new Error('Server error'); }
      );

      // Block call to communication.setSelectedConversationId
      communication.selectedConversationId = 111111;

      await communication.loadMessengerInfo(BUSINESS_PROFILE);
      await communication.loadConversation(messengerData.conversations[0].id);

      expect(apiSpy).toHaveBeenCalledTimes(1);
      expect(communication.conversations.size).toBe(0);
    });
  });


  describe('Communication/loadOlderMessages(id: number)', () => {
    it('loadOlderMessages should call communication.loadConversation with new limit if NOT all messages fetched', async () => {
      communication.loadConversation = jest.fn(() => {});
      const { fakeConversation } = conversationData;
      fakeConversation.isAllMessagesFetched = false;
      communication.conversations.set(fakeConversation.id, Object.assign({}, {
        ...fakeConversation,
        allMessagesFetched: false,
      }));

      await communication.loadOlderMessages(11111);

      expect(communication.loadConversation).toHaveBeenCalled();
      expect(communication.loadConversation).toHaveBeenCalledWith(11111, 35);
    });

    it('loadOlderMessages should NOT call communication.loadConversation if all messages fetched', async () => {
      communication.loadConversation = jest.fn(() => {});
      const { fakeConversation } = conversationData;
      communication.conversations.set(fakeConversation.id, fakeConversation);

      await communication.loadOlderMessages(11111);

      expect(communication.loadConversation).not.toHaveBeenCalled();
    });

    it('loadOlderMessages should NOT call communication.loadConversation if communication store in loading state', async () => {
      communication.loadConversation = jest.fn(() => {});
      const { fakeConversation } = conversationData;
      communication.conversations.set(fakeConversation.id, fakeConversation);
      communication.isLoading = true;

      await communication.loadOlderMessages(11111);
      communication.isLoading = false;

      expect(communication.loadConversation).not.toHaveBeenCalled();
    });

    it('loadOlderMessages should NOT call communication.loadConversation if conversation with id not found', async () => {
      communication.loadConversation = jest.fn(() => {});
      const { fakeConversation } = conversationData;
      communication.conversations.set(fakeConversation.id, fakeConversation);
      communication.isLoading = true;

      await communication.loadOlderMessages(22222);
      communication.isLoading = false;

      expect(communication.loadConversation).not.toHaveBeenCalled();
    });
  });

  describe('Communication/setSelectedConversationId(id)', () => {
    it('setSelectedConversationId should set selectedConversationId = id, call markConversation as read', async () => {
      communication.loadConversation = jest.fn(() => {});
      communication.markConversationAsRead = jest.fn(() => {});
      const { fakeConversation } = conversationData;
      communication.conversations.set(fakeConversation.id, fakeConversation);

      await communication.setSelectedConversationId(11111);

      expect(communication.loadConversation).not.toHaveBeenCalled();
      expect(communication.markConversationAsRead).toHaveBeenCalled();
      expect(communication.markConversationAsRead).toHaveBeenCalledWith(11111);
      expect(communication.selectedConversationId).toBe(11111);
    });

    it('setSelectedConversationId should set selectedConversationId = null and NOT to call markConversation and loadConversation if id = null', async () => {
      communication.loadConversation = jest.fn(() => {});
      communication.markConversationAsRead = jest.fn(() => {});
      const { fakeConversation } = conversationData;
      communication.conversations.set(fakeConversation.id, fakeConversation);

      await communication.setSelectedConversationId(null);
      await communication.setSelectedConversationId(undefined);

      expect(communication.loadConversation).not.toHaveBeenCalled();
      expect(communication.markConversationAsRead).not.toHaveBeenCalled();
    });

    it('setSelectedConversationId should set selectedConversationId = id and call loadConversation if there is no conversation with such id', async () => {
      communication.loadConversation = jest.fn(() => Promise.resolve({ data: 'data' }));
      communication.markConversationAsRead = jest.fn(() => {});
      const { fakeConversation } = conversationData;
      communication.conversations.set(fakeConversation.id, fakeConversation);

      const newConvId = 2222;
      await communication.setSelectedConversationId(newConvId);

      expect(communication.loadConversation).toHaveBeenCalled();
      expect(communication.loadConversation).toHaveBeenCalledWith(newConvId);
      expect(communication.markConversationAsRead).toHaveBeenCalled();
      expect(communication.markConversationAsRead).toHaveBeenCalledWith(newConvId);
      expect(communication.selectedConversationId).toBe(newConvId);
    });
  });

  describe('Communication/markConversationAsRead(id)', () => {
    it('markConversationAsRead should call proper api endpoint and set unread flag in conversations messages to false', async () => {
      communication.initSocket('url', messengerData.id);
      const apySpy = jest.spyOn(SocketApi.prototype, 'updateMessagesReadStatus');
      const conversationInfo = messengerData.conversations[0];
      conversationInfo.unreadCount = 10;
      communication.messengerInfo.byId = jest.fn(() => conversationInfo);

      const { conversation } = conversationData;
      conversation.getUnreadIds = jest.fn(
        function getMessages() { return this.messages.filter(m => m.unread); }
      );
      communication.conversations.set(conversation.id, conversation);

      expect(communication.messengerInfo.byId().unreadCount).toBe(10);

      await communication.markConversationAsRead(conversation.id);

      expect(apySpy).toHaveBeenCalled();
      expect(wampCall).toHaveBeenCalled();
      expect(wampCall.mock.calls).toHaveLength(1);
      expect(wampCall.mock.calls[0][0]).toBe(
        'messenger/rpc/updateMessagesReadStatus'
      );
      expect(communication.messengerInfo.byId().unreadCount).toBe(0);
      communication.conversations.get(conversation.id).messages
        .forEach((message) => {
          expect(message.unread).toBe(false);
        });
    });

    it('markConversationAsRead should NOT call api if there is no unread messages in conversation', async () => {
      communication.initSocket('url', messengerData.id);
      const apySpy = jest.spyOn(SocketApi.prototype, 'updateMessagesReadStatus');
      const conversationInfo = messengerData.conversations[0];
      conversationInfo.unreadCount = 10;
      communication.messengerInfo.byId = jest.fn(() => conversationInfo);

      const { conversation } = conversationData;
      conversation.getUnreadIds = jest.fn(() => []);
      communication.conversations.set(conversation.id, conversation);

      expect(communication.messengerInfo.byId().unreadCount).toBe(10);

      await communication.markConversationAsRead(conversation.id);

      expect(apySpy).not.toHaveBeenCalled();
      expect(wampCall).not.toHaveBeenCalled();
      expect(communication.messengerInfo.byId().unreadCount).toBe(0);
      communication.conversations.get(conversation.id).messages
        .forEach((message) => {
          expect(message.unread).toBe(false);
        });
    });
  });

  describe('Communication/search(text)', () => {
    it('search should set communication.contactsFilter = text and call searchMessages with lower case filter', async () => {
      communication.searchMessages = jest.fn(() => {});
      const filter = 'Filter';
      communication.search(filter);

      expect(communication.contactsFilter).toBe(filter);
      expect(communication.searchMessages).toHaveBeenCalled();
      expect(communication.searchMessages)
        .toHaveBeenCalledWith(filter.toLowerCase());
    });

    it('search should set foundMessages = [] if filter = null | undefined | empty string and NOT call searchMessages', async () => {
      communication.searchMessages = jest.fn(() => {});

      communication.foundMessages = ['one', 'two', 'three'];

      communication.search(null);
      communication.search(undefined);
      communication.search('');

      expect(communication.contactsFilter).toBe('');
      expect(communication.foundMessages).toHaveLength(0);
      expect(communication.searchMessages).not.toHaveBeenCalled();
    });
  });

  describe('Communication/searchContactsAutocomplete(query)', () => {
    it('searchContactsAutocomplete should set store and call right api url', async () => {
      const apiSpy = jest.spyOn(api.messenger, 'getAvailableContacts');
      const contacts = ['contact1', 'contact2', 'contact3'];
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(contacts)
      );
      communication.messengerInfo.messengerUser = { id: 11111 };

      await communication.searchContactsAutocomplete('query');

      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalledWith(
        '/api/rest/v1/messenger/contacts/autocomplete',
        {
          query: {
            access_token: undefined,
            id: 11111,
            limit: 50,
            query: 'query',
          },
        }
      );
      expect(mobx.toJS(communication.contactsAutocomplete)).toEqual(contacts);
    });

    it('searchContactsAutocomplete should NOT call api if query = null | undefined | emty string', async () => {
      const apiSpy = jest.spyOn(api.messenger, 'getAvailableContacts');
      communication.messengerInfo.messengerUser = { id: 11111 };

      await communication.searchContactsAutocomplete('');
      await communication.searchContactsAutocomplete(null);
      await communication.searchContactsAutocomplete(undefined);

      expect(apiSpy).not.toHaveBeenCalled();
      expect(getSpy).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
      expect(mobx.toJS(communication.contactsAutocomplete)).toHaveLength(0);
    });

    it('searchContactsAutocomplete should NOT call api if messengerInfo.messengerUser = null | undefined', async () => {
      const apiSpy = jest.spyOn(api.messenger, 'getAvailableContacts');
      communication.messengerInfo.messengerUser = null;

      await communication.searchContactsAutocomplete('query');

      expect(apiSpy).not.toHaveBeenCalled();
      expect(getSpy).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
      expect(mobx.toJS(communication.contactsAutocomplete)).toHaveLength(0);
    });
  });

  describe('Communication/getContactData(contactId: number)', () => {
    it('getContactData should set store and call right api url', async () => {
      const apiSpy = jest.spyOn(api.messenger, 'getContactData');

      const contactId = 1111;
      await communication.getContactData(contactId);

      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalledWith(
        `/api/rest/v1/messenger/contacts/${contactId}`,
        { query: { access_token: undefined } }
      );
    });

    it('getContactData should NOT call api if contactId is not truthy', async () => {
      const apiSpy = jest.spyOn(api.messenger, 'getContactData');
      communication.messengerInfo.messengerUser = null;

      await communication.getContactData(undefined);
      await communication.getContactData(null);

      expect(apiSpy).not.toHaveBeenCalled();
      expect(getSpy).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Communication/sendMessage(conversationId, body, channelSetId)', () => {
    it('sendMessage should call right api url and call soundHelper.playMsgSent', async () => {
      const apiSpy = jest.spyOn(SocketApi.prototype, 'sendMessage');
      communication.addSendingMessage = jest.fn(() => {});

      communication.initSocket('communication/socket/get', messengerData.id);
      communication.conversations.set(1, { settings: { notification: true } });
      communication.selectedConversationId = 1;

      const messageBody = 'Hello World!!!!!';
      await communication.sendMessage(1111, messageBody);

      expect(apiSpy).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith({
        body: 'Hello World!!!!!',
        channelSetId: '',
        conversationId: 1111,
      });
      expect(communication.addSendingMessage).toHaveBeenCalled();
      expect(soundHelper.playMsgSent).toHaveBeenCalled();
      expect(wampCall).toHaveBeenCalled();
      expect(wampCall).toHaveBeenCalledWith(
        'messenger/rpc/sendMessage',
        {
          body: 'Hello World!!!!!',
          channelSetId: '',
          conversationId: 1111,
          forwardFromId: null,
          replyToId: null,
          userId: undefined,
        }
      );
    });

    it('sendMessage should call right api url and NOT call soundHelper.playMsgSent if settings.notification = false', async () => {
      const apiSpy = jest.spyOn(SocketApi.prototype, 'sendMessage');
      communication.addSendingMessage = jest.fn(() => {});

      communication.initSocket('communication/socket/get', messengerData.id);
      communication.conversations.set(1, { settings: { notification: false } });
      communication.selectedConversationId = 1;

      const messageBody = 'Hello World!!!!!';
      await communication.sendMessage(1111, messageBody);

      expect(apiSpy).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith({
        body: 'Hello World!!!!!',
        channelSetId: '',
        conversationId: 1111,
      });
      expect(communication.addSendingMessage).toHaveBeenCalled();
      expect(soundHelper.playMsgSent).not.toHaveBeenCalled();
      expect(wampCall).toHaveBeenCalled();
      expect(wampCall).toHaveBeenCalledWith(
        'messenger/rpc/sendMessage',
        {
          body: 'Hello World!!!!!',
          channelSetId: '',
          conversationId: 1111,
          forwardFromId: null,
          replyToId: null,
          userId: undefined,
        }
      );
    });

    it('sendMessage should NOT call api and should NOT throw Exception if it gets bad socket', async () => {
      const apiSpy = jest.spyOn(SocketApi.prototype, 'sendMessage');
      communication.addSendingMessage = jest.fn(() => {});
      api.messenger.getSocket = jest.fn(() => null);

      const messageBody = 'Hello World!!!!!';
      expect(async () => await communication.sendMessage(1111, messageBody))
        .not.toThrowError();

      expect(api.messenger.getSocket).toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(communication.addSendingMessage).toHaveBeenCalled();
      expect(soundHelper.playMsgSent).not.toHaveBeenCalled();
      expect(wampCall).not.toHaveBeenCalled();
    });

    it('sendMessage should call api and add replyMessageId if reply message was set', async () => {
      const apiSpy = jest.spyOn(SocketApi.prototype, 'sendMessage');
      communication.addSendingMessage = jest.fn(() => {});

      communication.initSocket('communication/socket/get', messengerData.id);
      communication.conversations.set(1, { settings: { notification: true } });
      communication.selectedConversationId = 1;
      communication.messageForReply = { id: 11111 };

      const messageBody = 'Hello World!!!!!';
      await communication.sendMessage(1111, messageBody);

      expect(apiSpy).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith({
        body: 'Hello World!!!!!',
        channelSetId: '',
        conversationId: 1111,
        replyToId: 11111,
      });
      expect(communication.addSendingMessage).toHaveBeenCalled();
      expect(soundHelper.playMsgSent).toHaveBeenCalled();
      expect(wampCall).toHaveBeenCalled();
      expect(wampCall).toHaveBeenCalledWith(
        'messenger/rpc/sendMessage',
        {
          body: 'Hello World!!!!!',
          channelSetId: '',
          conversationId: 1111,
          forwardFromId: null,
          replyToId: 11111,
          userId: undefined,
        }
      );
    });
  });

  describe('Communication/sendMessageWithMedias(body, mediaFileInfo, conversationId)', () => {
    it('sendMessageWithMedias should call right api url and call soundHelper.playMsgSent', async () => {
      const apiSpy = jest.spyOn(api.messenger, 'sendMessageWithMedias');
      RNFetchBlob.fetch = jest.fn(
        () => ({ uploadProgress: jest.fn(() => Promise.resolve(1)) })
      );
      const userId = 22222;
      communication.messengerInfo.messengerUser = { id: userId };

      const { fakeConversation } = conversationData;
      fakeConversation.addMessage = jest.fn(() => {});
      communication.conversations.set(fakeConversation.id, fakeConversation);
      communication.selectedConversationId = fakeConversation.id;

      const messageBody = 'Hello World';
      await communication.sendMessageWithMedias(
        messageBody, fakeConversation.id, conversationData.mediaMessage
      );

      expect(apiSpy).toHaveBeenCalled();
      expect(apiSpy.mock.calls).toHaveLength(1);
      expect(apiSpy.mock.calls[0][0]).toBe(userId);
      expect(apiSpy.mock.calls[0][1].fileName)
        .toBe(conversationData.mediaMessage.fileName);
      expect(soundHelper.playMsgSent).toHaveBeenCalled();
      expect(fakeConversation.addMessage).toHaveBeenCalled();
      expect(RNFetchBlob.fetch).toHaveBeenCalled();
      expect(RNFetchBlob.fetch.mock.calls).toHaveLength(1);
      expect(RNFetchBlob.fetch.mock.calls[0][0]).toBe('POST');
      expect(RNFetchBlob.fetch.mock.calls[0][1]).toBe(
        'https://stage.payever.de/api/rest/v1/messenger/new/message/medias'
      );
    });

    it('sendMessageWithMedias should NOT call api if messengerUser = null', async () => {
      const apiSpy = jest.spyOn(api.messenger, 'sendMessageWithMedias');
      RNFetchBlob.fetch = jest.fn(() => ({ uploadProgress: jest.fn(() => {}) }));

      const { fakeConversation } = conversationData;
      fakeConversation.addMessage = jest.fn(() => {});
      communication.conversations.set(fakeConversation.id, fakeConversation);
      communication.selectedConversationId = fakeConversation.id;
      communication.messengerInfo.messengerUser = null;

      const messageBody = 'Hello World';
      await communication.sendMessageWithMedias(
        messageBody, fakeConversation.id, conversationData.mediaMessage
      );

      expect(apiSpy).not.toHaveBeenCalled();
      expect(RNFetchBlob.fetch).not.toHaveBeenCalled();
      expect(fakeConversation.addMessage).not.toHaveBeenCalled();
    });

    it('sendMessageWithMedias should call right api url and should NOt call soundHelper.playMsgSent if settings.notification = false', async () => {
      const apiSpy = jest.spyOn(api.messenger, 'sendMessageWithMedias');
      RNFetchBlob.fetch = jest.fn(
        () => ({ uploadProgress: jest.fn(() => Promise.resolve(1)) })
      );
      const userId = 22222;
      communication.messengerInfo.messengerUser = { id: userId };

      const { fakeConversation } = conversationData;
      fakeConversation.addMessage = jest.fn(() => {});
      communication.conversations.set(
        fakeConversation.id,
        Object.assign({},
          fakeConversation,
          { settings: { navigation: false } }
        )
      );
      communication.selectedConversationId = fakeConversation.id;

      const messageBody = 'Hello World';
      await communication.sendMessageWithMedias(
        messageBody, fakeConversation.id, conversationData.mediaMessage
      );

      expect(apiSpy).toHaveBeenCalled();
      expect(apiSpy.mock.calls).toHaveLength(1);
      expect(apiSpy.mock.calls[0][0]).toBe(userId);
      expect(apiSpy.mock.calls[0][1].fileName)
        .toBe(conversationData.mediaMessage.fileName);
      expect(soundHelper.playMsgSent).not.toHaveBeenCalled();
      expect(fakeConversation.addMessage).toHaveBeenCalled();
      expect(RNFetchBlob.fetch).toHaveBeenCalled();
      expect(RNFetchBlob.fetch.mock.calls).toHaveLength(1);
      expect(RNFetchBlob.fetch.mock.calls[0][0]).toBe('POST');
      expect(RNFetchBlob.fetch.mock.calls[0][1]).toBe(
        'https://stage.payever.de/api/rest/v1/messenger/new/message/medias'
      );
    });
  });

  describe('Communication/addSendingMessage(body)', () => {
    it('addSendingMessage should add message with body to selected conversations messages', () => {
      const { conversation } = conversationData;
      const conversationObj = new Conversation(Object.assign({}, conversation));
      const addMessageSpy = jest.spyOn(conversationObj, 'addMessage');

      communication.conversations.set(conversation.id, conversationObj);
      communication.selectedConversationId = conversation.id;
      const messageBody = 'Hello World!!!!';

      const messagesCount = conversationObj.messages.length;
      expect(communication.selectedConversation.messages).toHaveLength(messagesCount);
      communication.addSendingMessage(messageBody);

      expect(addMessageSpy).toHaveBeenCalled();
      expect(communication.selectedConversation.messages)
        .toHaveLength(messagesCount + 1);
      expect(communication.selectedConversation.messages[messagesCount].body)
        .toBe(messageBody);
    });

    it('addSendingMessage should NOT throw exception if selectedConversation = null', () => {
      const messageBody = 'Hello World!!!!';

      expect(communication.selectedConversation).toBeFalsy();
      expect(() => communication.addSendingMessage(messageBody))
        .not.toThrow();
    });
  });

  describe('Communication/updateFileUploadProgress(progressId, value)', () => {
    it('updateFileUploadProgress should set value for progressId key in progress ids Map in store if value < 100', () => {
      const progressId = '1';
      communication.filesUploadingProgress.set(progressId, 0);

      expect(communication.filesUploadingProgress.get(progressId)).toBe(0);
      communication.updateFileUploadProgress(progressId, 50);
      expect(communication.filesUploadingProgress.get(progressId)).toBe(50);
    });

    it('updateFileUploadProgress should set 100 for progressId in progress ids Map in store if value >= 100', () => {
      const progressId = '1';
      communication.filesUploadingProgress.set(progressId, 0);

      expect(communication.filesUploadingProgress.get(progressId)).toBe(0);
      communication.updateFileUploadProgress(progressId, 100);
      expect(communication.filesUploadingProgress.get(progressId)).toBe(100);
      communication.updateFileUploadProgress(progressId, 200);
      expect(communication.filesUploadingProgress.get(progressId)).toBe(100);
    });

    it('updateFileUploadProgress should NOT throw exception if no such key (progressId) in progress ids Map in store', () => {
      expect(() => communication.updateFileUploadProgress(100, 100))
        .not.toThrow();
    });
  });

  describe('Communication/removeFileUploadingProgress(progressId: string)', () => {
    it('removeFileUploadingProgress should remove progressId key in progress ids Map in store', () => {
      const progressId = '1';
      communication.filesUploadingProgress.set(progressId, 0);

      expect(communication.filesUploadingProgress.size).toBe(1);
      expect(communication.filesUploadingProgress.get(progressId)).toBe(0);
      communication.removeFileUploadingProgress(progressId);
      expect(communication.filesUploadingProgress.size).toBe(0);
    });

    it('removeFileUploadingProgress should NOT throw exception if no such key (progressId) in progress ids Map in store', () => {
      expect(communication.filesUploadingProgress.size).toBe(0);
      expect(() => communication.removeFileUploadingProgress(111))
        .not.toThrow();
    });
  });

  describe('Communication/searchMessages(query)', () => {
    it('searchMessages should call right api endpoint with right url', async () => {
      const apiSpy = jest.spyOn(SocketApi.prototype, 'searchMessages');
      const userId = 1111;
      communication.initSocket('communication/socket/url', userId);

      const query = 'query';
      await communication.search(query);

      expect(apiSpy).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith(query);
      expect(wampCall).toHaveBeenCalled();
      expect(wampCall).toHaveBeenCalledWith(
        'messenger/rpc/searchMessages',
        { query, userId }
      );
    });

    it('searchMessages should set store to right state then it found messages', async () => {
      const apiSpy = jest.spyOn(SocketApi.prototype, 'searchMessages');
      const { conversation } = conversationData;
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(conversation)
      );
      const userId = 1111;
      communication.initSocket('communication/socket/url', userId);

      const query = 'query';
      await communication.searchMessages(query);

      expect(apiSpy).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith(query);
      expect(communication.foundMessages)
        .toHaveLength(conversation.messages.length);
    });
  });

  describe('Communication/clearFoundMessages()', () => {
    it('clearFoundMessages should clear communication.foundMessages', () => {
      communication.foundMessages = [1, 2, 3];

      expect(communication.foundMessages).toHaveLength(3);
      communication.clearFoundMessages();
      expect(communication.foundMessages).toHaveLength(0);
    });
  });

  describe('Communication/setMessageForReply(message: Message)', () => {
    it('setMessageForReply should set communication.messageForReply = message, and set ui flags', () => {
      const { conversation: { messages } } = conversationData;
      const removeMessageSpy =
        jest.spyOn(communication, 'removeMessageForEdit');
      const clearSelectedMsgsSpy =
        jest.spyOn(communication, 'clearSelectedMessages');

      expect(communication.messageForReply).toBe(null);
      communication.setMessageForReply(messages[0]);

      expect(mobx.toJS(communication.messageForReply)).toEqual(messages[0]);
      expect(removeMessageSpy).toHaveBeenCalled();
      expect(clearSelectedMsgsSpy).toHaveBeenCalled();
      expect(communication.ui.setForwardMode).toHaveBeenCalled();
      expect(communication.ui.setForwardMode).toHaveBeenCalledWith(false);
      expect(communication.ui.setSelectMode).toHaveBeenCalled();
      expect(communication.ui.setSelectMode).toHaveBeenCalledWith(false);
    });

    it('setMessageForReply should NOT set communication.messageForReply = message, and should NOT set ui flags if message = null', () => {
      const removeMessageSpy =
        jest.spyOn(communication, 'removeMessageForEdit');
      const clearSelectedMsgsSpy =
        jest.spyOn(communication, 'clearSelectedMessages');

      expect(communication.messageForReply).toBe(null);
      communication.setMessageForReply(null);
      communication.setMessageForReply(undefined);

      expect(mobx.toJS(communication.messageForReply)).toBe(null);
      expect(removeMessageSpy).not.toHaveBeenCalled();
      expect(clearSelectedMsgsSpy).not.toHaveBeenCalled();
      expect(communication.ui.setForwardMode).not.toHaveBeenCalled();
      expect(communication.ui.setSelectMode).not.toHaveBeenCalled();
    });
  });

  describe('Communication/removeMessageForReply()', () => {
    it('removeMessageForReply should set communication.messageForReply = null', () => {
      const { conversation: { messages } } = conversationData;

      expect(communication.messageForReply).toBe(null);
      communication.setMessageForReply(messages[0]);

      expect(mobx.toJS(communication.messageForReply)).toEqual(messages[0]);
      communication.removeMessageForReply();

      expect(communication.messageForReply).toBe(null);
    });
  });

  describe('Communication/setMessageForEdit(message)', () => {
    it('setMessageForEdit should set communication.messageForEdit = message, and set ui flags', () => {
      const { conversation: { messages } } = conversationData;

      expect(communication.messageForEdit).toBe(null);
      communication.setMessageForEdit(messages[0]);

      expect(mobx.toJS(communication.messageForEdit)).toEqual(messages[0]);
    });

    it('setMessageForEdit should NOT set communication.messageForEdit = message if message = null | undefined', () => {
      expect(communication.messageForEdit).toBe(null);
      communication.setMessageForEdit(null);
      communication.setMessageForEdit(undefined);

      expect(mobx.toJS(communication.messageForEdit)).toBe(null);
    });
  });

  describe('Communication/removeMessageForEdit()', () => {
    it('removeMessageForEdit should set communication.messageForEdit = null', () => {
      const { conversation: { messages } } = conversationData;

      expect(communication.messageForEdit).toBe(null);
      communication.setMessageForEdit(messages[0]);

      expect(mobx.toJS(communication.messageForEdit)).toEqual(messages[0]);
      communication.removeMessageForEdit();

      expect(communication.messageForEdit).toBe(null);
    });
  });

  describe('Communication/saveUserSettings(settings: UserSettings)', () => {
    xit('saveUserSettings should call right api with right url', () => {
      const apiSpy = jest.spyOn(api.messenger, 'saveSettings');
      networkHelper.loadFromApi.mockImplementationOnce(() => ({ data: true }));

      communication.messengerInfo = new MessengerInfo(cloneObject(messengerData));
      communication.saveUserSettings(communication.messengerInfo.userSettings);

      expect(apiSpy).toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalledWith();
      expect(postSpy).toHaveBeenCalled();
    });
  });
});