/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'mobx-react/native';
import { shallow } from 'enzyme';
import config from '../../../config';
import GroupSettings from '../screens/GroupSettings';
import Store from '../../../store';
import MessengerInfo from '../../../store/communication/models/MessengerInfo';
import Conversation from '../../../store/communication/models/Conversation';
import {
  messengerData,
  conversationData,
} from '../../../store/communication/__tests__/data';
import navigator from '../../../../__mocks__/navigator';

describe('modules/communication/screens/GroupSettings', () => {
  let store;
  let communication;
  let ui;

  beforeAll(() => {
    GroupSettings.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    GroupSettings.childContextTypes = { navigator: React.PropTypes.object };
  });

  beforeEach(() => {
    store = new Store(config);
    communication = store.communication;
    ui = store.ui;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GroupSettings should render correctly', async () => {
    const { conversation } = conversationData;
    const conversationId = messengerData.conversations[0].id;
    communication.selectedConversationId = conversationId;
    communication.messengerInfo = new MessengerInfo(
      JSON.parse(JSON.stringify(messengerData))
    );

    const convObj = new Conversation(
      JSON.parse(JSON.stringify(conversation)),
      communication.messengerInfo.byId(conversationId)
    );
    convObj.type = 'conversation';
    communication.conversations.set(conversationId, convObj);
    communication.selectedConversationId = conversationId;

    communication.getGroupSettings = jest.fn();
    Conversation.prototype.setConversationSettings = jest.fn();

    const tree = await renderer.create(
      <Provider
        communication={communication}
        ui={ui}
      >
        <GroupSettings navigator={navigator} />
      </Provider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(communication.getGroupSettings).toHaveBeenCalled();
    expect(Conversation.prototype.setConversationSettings).toHaveBeenCalled();
  });

  it('GroupSettings/onDeleteGroup() should call communication.deleteGroup', async () => {
    const { conversation } = conversationData;
    const conversationId = messengerData.conversations[0].id;
    communication.selectedConversationId = conversationId;
    communication.messengerInfo = new MessengerInfo(
      JSON.parse(JSON.stringify(messengerData))
    );

    const convObj = new Conversation(
      cloneObject(conversation),
      communication.messengerInfo.byId(conversationId)
    );
    convObj.type = 'conversation';
    convObj.settings = {
      navigation: 1,
      members: [
        'member1',
        'member2',
        'member3',
      ],
      isOwner: true,
    };
    communication.conversations.set(conversationId, convObj);
    communication.selectedConversationId = conversationId;

    communication.getGroupSettings = jest.fn();
    communication.deleteGroup = jest.fn();
    Conversation.prototype.setConversationSettings = jest.fn();

    const wrapper = shallow(
      <GroupSettings
        communication={communication}
        ui={ui}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('TextButton')
      .at(0)
      .props()
      .onPress();

    expect(communication.deleteGroup).toHaveBeenCalled();
  });
});