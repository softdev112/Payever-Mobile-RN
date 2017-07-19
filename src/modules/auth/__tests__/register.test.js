/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { google, facebook, linkedIn, twitter } from 'react-native-simple-auth';
import Register from '../screens/Register';
import Store from '../../../store';
import config from '../../../config';

jest.mock('../../../common/Navigation')
  .mock('react-native-simple-auth', () => ({
    twitter: jest.fn(() => Promise.resolve(1)),
    google: jest.fn(() => Promise.resolve(1)),
    facebook: jest.fn(() => Promise.resolve(1)),
    linkedIn: jest.fn(() => Promise.resolve(1)),
  }));

const navigator = {
  setOnNavigatorEvent: jest.fn(),
  resetTo: jest.fn(),
  push: jest.fn(),
};

describe('modules/auth/screens/Register', () => {
  let store;
  let auth;

  beforeAll(() => {
    Register.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    Register.childContextTypes = {
      navigator: React.PropTypes.object,
    };
  });

  beforeEach(() => {
    store = new Store(config);
    auth = store.auth;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Register should render correctly', () => {
    const tree = renderer.create(
      <Register
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Register/onRegisterWithEmail() should call navigator.push to RegisterWithEmail screen', () => {
    const wrapper = shallow(
      <Register
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('TextButton')
      .at(0)
      .props()
      .onPress();

    expect(navigator.push).toHaveBeenCalled();
    expect(navigator.push).toHaveBeenCalledWith(
      { animated: true, screen: 'auth.RegisterWithEmail' }
    );
  });

  it('Register/onRegisterWithLinkedIn() should call register with linkedIn', () => {
    const wrapper = shallow(
      <Register
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('SocialIconButton')
      .at(3)
      .props()
      .onPress();

    expect(linkedIn).toHaveBeenCalled();
  });

  it('Register/onRegisterWithTwitter() should call register with twitter', () => {
    const wrapper = shallow(
      <Register
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('SocialIconButton')
      .at(2)
      .props()
      .onPress();

    expect(twitter).toHaveBeenCalled();
  });

  it('Register/onRegisterWithGoogle() should call register with google', () => {
    const wrapper = shallow(
      <Register
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('SocialIconButton')
      .at(1)
      .props()
      .onPress();

    expect(google).toHaveBeenCalled();
  });

  it('Register/onRegisterWithFacebook() should call register with facebook', () => {
    const wrapper = shallow(
      <Register
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('SocialIconButton')
      .at(0)
      .props()
      .onPress();

    expect(facebook).toHaveBeenCalled();
  });
});