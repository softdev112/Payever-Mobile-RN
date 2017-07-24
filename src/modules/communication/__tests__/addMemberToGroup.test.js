/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'mobx-react/native';
import { shallow } from 'enzyme';
import config from '../../../config';
import AddMemberToGroup from '../screens/AddMemberToGroup';
import Store from '../../../store';
import navigator from '../../../../__mocks__/navigator';

jest.mock('../components/contacts/AddContactBlock', () => 'AddContactBlock');

describe('modules/communication/screens/AddGroup', () => {
  let store;
  let communication;
  let profiles;

  beforeAll(() => {
    AddMemberToGroup.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    AddMemberToGroup.childContextTypes = { navigator: React.PropTypes.object };
  });

  beforeEach(() => {
    store = new Store(config);
    communication = store.communication;
    profiles = store.profiles;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('AddGroup should render correctly', () => {
    const tree = renderer.create(
      <Provider
        communication={communication}
        profiles={profiles}
        contacts={store.contacts}
      >
        <AddMemberToGroup navigator={navigator} />
      </Provider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('AddGroup/onAddMembersToGroup() should call Navigation.showInAppNotification if there is no selected contacts', () => {
    Navigation.showInAppNotification = jest.fn();

    const wrapper = shallow(
      <AddMemberToGroup
        communication={communication}
        profiles={profiles}
        contacts={store.contacts}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('NavBar')
      .childAt(2)
      .props()
      .onPress();

    expect(Navigation.showInAppNotification).toHaveBeenCalled();
    expect(Navigation.showInAppNotification).toHaveBeenCalledWith({
      passProps: {
        message: 'No contacts were selected',
        style: expect.any(Object),
        textStyle: expect.any(Object),
      },
      screen: 'core.PushNotification',
      title: 'Error!',
    });
  });

  it('AddGroup/onAddMembersToGroup() should call communication.addAllMembersToGroup and navigator.pop if there is selected contacts', () => {
    communication.contactsForAction = ['contact1', 'contact2', 'contact3'];
    communication.selectedContcats = ['contact1', 'contact2', 'contact3'];
    communication.selectedConversationId = 1111;
    communication.conversations.set(1111, { id: 1111 });
    communication.addAllMembersToGroup = jest.fn();

    const wrapper = shallow(
      <AddMemberToGroup
        communication={communication}
        profiles={profiles}
        contacts={store.contacts}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('NavBar')
      .childAt(2)
      .props()
      .onPress();

    expect(communication.addAllMembersToGroup).toHaveBeenCalled();
    expect(communication.addAllMembersToGroup).toHaveBeenCalledWith(1111);
    expect(navigator.pop).toHaveBeenCalled();
    expect(navigator.pop).toHaveBeenCalledWith({ animated: true });
  });
});