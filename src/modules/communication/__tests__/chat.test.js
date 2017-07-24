/* eslint-disable max-len */
import React from 'react';
import { Alert } from 'react-native';
import renderer from 'react-test-renderer';
import { Provider } from 'mobx-react/native';
import { shallow } from 'enzyme';
import { cacheHelper, networkHelper } from 'utils';
import config from '../../../config';
import Chat from '../screens/Chat';
import Store from '../../../store';
import navigator from '../../../../__mocks__/navigator';
import {
  messengerData, conversationData,
} from '../../../store/communication/__tests__/data';
import MessengerInfo from '../../../store/communication/models/MessengerInfo';
import Conversation from '../../../store/communication/models/Conversation';

jest.mock('../../../common/utils/cacheHelper')
  .mock('../../../common/utils/networkHelper')
  .mock('../../../common/ui/Icon', () => 'Icon')
  .mock('Alert', () => ({ alert: jest.fn() }));

describe('modules/communication/screens/Chat', () => {
  let store;
  let communication;
  let profiles;
  let ui;

  beforeAll(() => {
    Chat.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    Chat.childContextTypes = { navigator: React.PropTypes.object };

    cacheHelper.loadFromCache.mockImplementation(() => Promise.resolve(
      JSON.parse(JSON.stringify(conversationData.conversation))
    ));
    cacheHelper.isCacheUpToDate.mockImplementation(() => true);
    cacheHelper.saveToCache.mockImplementation(() => Promise.resolve());
    networkHelper.isConnected.mockImplementation(() => false);
  });

  beforeEach(() => {
    store = new Store(config);
    profiles = store.profiles;
    communication = store.communication;
    communication.initSocket = jest.fn();
    ui = store.ui;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Chat should render correctly', () => {
    const { conversation } = conversationData;
    ui.phoneMode = true;
    communication.messengerInfo =
      new MessengerInfo(JSON.parse(JSON.stringify(messengerData)));
    const conversationId = conversation.id;
    const convObj = new Conversation(
      conversation,
      communication.messengerInfo.byId(conversationId)
    );
    communication.conversations.set(conversationId, convObj);
    communication.selectedConversationId = conversationId;

    communication.ui.selectMode = false;
    communication.ui.forwardMode = false;
    communication.ui.searchMessagesMode = false;

    const tree = renderer.create(
      <Provider
        communication={communication}
        profiles={profiles}
        ui={ui}
      >
        <Chat navigator={navigator} />
      </Provider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Chat/componentWillUnmount() should call conversation.saveUndeliveredMsgs', () => {
    const { conversation } = conversationData;
    ui.phoneMode = true;
    communication.messengerInfo =
      new MessengerInfo(JSON.parse(JSON.stringify(messengerData)));
    const conversationId = conversation.id;
    const convObj = new Conversation(
      JSON.parse(JSON.stringify(conversation)),
      communication.messengerInfo.byId(conversationId)
    );
    convObj.saveUndeliveredMsgs = jest.fn();
    communication.conversations.set(conversationId, convObj);
    communication.selectedConversationId = conversationId;

    communication.ui.selectMode = false;
    communication.ui.forwardMode = false;
    communication.ui.searchMessagesMode = false;

    const wrapper = shallow(
      <Chat
        communication={communication}
        profiles={profiles}
        ui={ui}
        navigator={navigator}
      />
    );

    wrapper.dive().unmount();

    expect(convObj.saveUndeliveredMsgs).toHaveBeenCalled();
  });

  it('Chat/onDeleteAllMessages() should call Alert.alert with message about delete all messages warning', () => {
    const { conversation } = conversationData;
    ui.phoneMode = true;
    communication.messengerInfo =
      new MessengerInfo(JSON.parse(JSON.stringify(messengerData)));
    const conversationId = conversation.id;
    const convObj = new Conversation(
      JSON.parse(JSON.stringify(conversation)),
      communication.messengerInfo.byId(conversationId)
    );
    communication.conversations.set(conversationId, convObj);
    communication.selectedConversationId = conversationId;

    communication.ui.selectMode = true;
    communication.ui.forwardMode = false;
    communication.ui.searchMessagesMode = false;

    const wrapper = shallow(
      <Chat
        communication={communication}
        profiles={profiles}
        ui={ui}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('Button')
      .at(0)
      .props()
      .onPress();

    expect(Alert.alert).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith(
      'Attention!',
      'Delete All 33 messages?',
      [
        { style: 'cancel', text: 'Cancel' },
        { onPress: expect.any(Function), text: 'OK' },
      ],
      { cancelable: false }
    );
  });

  it('Chat/onCancelSelectedMode() should switch off selecMode state of communication ui', () => {
    const modeSwitchSpy = jest.spyOn(
      communication.chatMessagesState, 'initState'
    );
    communication.ui.selectMode = true;
    communication.ui.forwardMode = true;

    const wrapper = shallow(
      <Chat
        communication={communication}
        profiles={profiles}
        ui={ui}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('Button')
      .at(0)
      .props()
      .onPress();

    expect(modeSwitchSpy).toHaveBeenCalled();
    expect(communication.ui.selectMode).toBe(false);
    expect(communication.ui.forwardMode).toBe(false);
  });

  it('Chat/onSettingsPress() if conversation is Group should call navigator push => communication.GroupSettings', () => {
    const { conversation } = conversationData;
    ui.phoneMode = true;
    communication.messengerInfo =
      new MessengerInfo(JSON.parse(JSON.stringify(messengerData)));
    const conversationId = conversation.id;
    const convObj = new Conversation(
      JSON.parse(JSON.stringify(conversation)),
      communication.messengerInfo.byId(conversationId)
    );
    convObj.type = 'group';
    communication.conversations.set(conversationId, convObj);
    communication.selectedConversationId = conversationId;

    communication.ui.selectMode = false;
    communication.ui.forwardMode = false;
    communication.ui.searchMessagesMode = false;

    const wrapper = shallow(
      <Chat
        communication={communication}
        profiles={profiles}
        ui={ui}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .dive()
      .childAt(0)
      .childAt(2)
      .props()
      .onPress();

    expect(navigator.push).toHaveBeenCalled();
    expect(navigator.push).toHaveBeenCalledWith(
      { animated: true, screen: 'communication.GroupSettings' }
    );
  });

  it('Chat/onSettingsPress() if conversation NOT Group should call navigator push => communication.ConversationSettings', () => {
    const { conversation } = conversationData;
    ui.phoneMode = true;
    communication.messengerInfo =
      new MessengerInfo(JSON.parse(JSON.stringify(messengerData)));
    const conversationId = conversation.id;
    const convObj = new Conversation(
      JSON.parse(JSON.stringify(conversation)),
      communication.messengerInfo.byId(conversationId)
    );
    convObj.type = 'conversation';
    communication.conversations.set(conversationId, convObj);
    communication.selectedConversationId = conversationId;

    communication.ui.selectMode = false;
    communication.ui.forwardMode = false;
    communication.ui.searchMessagesMode = false;

    const wrapper = shallow(
      <Chat
        communication={communication}
        profiles={profiles}
        ui={ui}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .dive()
      .childAt(0)
      .childAt(2)
      .props()
      .onPress();

    expect(navigator.push).toHaveBeenCalled();
    expect(navigator.push).toHaveBeenCalledWith(
      { animated: true, screen: 'communication.ConversationSettings' }
    );
  });
});