/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import EditMessage from '../screens/EditMessage';
import navigator from '../../../../__mocks__/navigator';

describe('modules/communication/screens/EditMessage', () => {
  beforeAll(() => {
    EditMessage.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    EditMessage.childContextTypes = { navigator: React.PropTypes.object };
  });

  it('EditMessage should render correctly', () => {
    const tree = renderer.create(
      <EditMessage
        message="Hello World!!!!"
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('EditMessage/onSaveMessage() should call onSave callback and navigator pop', () => {
    const onSaveCb = jest.fn(() => {});

    const wrapper = shallow(
      <EditMessage
        message="Hello World!!!!"
        navigator={navigator}
        onSave={onSaveCb}
      />
    );

    wrapper.dive()
      .find('NavBar')
      .find('Button')
      .props()
      .onPress('Hello World!!!!!');

    expect(onSaveCb).toHaveBeenCalled();
    expect(onSaveCb).toHaveBeenCalledWith('Hello World!!!!');
    expect(navigator.pop).toHaveBeenCalled();
    expect(navigator.pop).toHaveBeenCalledWith({ animated: true });
  });

  it('EditMessage/onChangeText(message) should call onChangeText callback', () => {
    const onChangeTextCb = jest.fn(() => {});

    const wrapper = shallow(
      <EditMessage
        message="Hello World!!!!"
        navigator={navigator}
        onChangeText={onChangeTextCb}
      />
    );

    wrapper.dive()
      .find('TextInput')
      .props()
      .onChangeText('Hello World!!!!');

    expect(onChangeTextCb).toHaveBeenCalled();
    expect(onChangeTextCb).toHaveBeenCalledWith('Hello World!!!!');
  });
});