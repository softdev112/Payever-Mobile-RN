/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Login from '../screens/Login';
import Store from '../../../store';
import config from '../../../config';

jest.mock('../../../common/ui/Error', () => 'Error');

const navigator = {
  setOnNavigatorEvent: jest.fn(),
  resetTo: jest.fn(),
  push: jest.fn(),
};

describe('modules/auth/screens/Login', () => {
  let store;
  let auth;

  beforeAll(() => {
    Login.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    Login.childContextTypes = {
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

  it('Login should render correctly', () => {
    const tree = renderer.create(
      <Login
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Login should render correctly with error message', () => {
    auth.error = 'Test error';

    const tree = renderer.create(
      <Login
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Login/onSignIn() test press to signIn button should call auth.setError because user credentials not set', () => {
    auth.signIn = jest.fn();
    auth.setError = jest.fn();

    const wrapper = shallow(
      <Login
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('Button')
      .at(1)
      .props()
      .onPress();

    expect(auth.signIn).not.toHaveBeenCalled();
    expect(auth.setError).toHaveBeenCalled();
    expect(auth.setError).toHaveBeenCalledWith(
      'E-mail and password can\'t be empty!'
    );
  });

  it('Login/onForgotPassword test press to Forgot Password button should call navigator.push', () => {
    const wrapper = shallow(
      <Login
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .find('Button')
      .at(0)
      .props()
      .onPress();

    expect(navigator.push).toHaveBeenCalled();
    expect(navigator.push).toHaveBeenCalledWith(
      { animated: true, screen: 'auth.ResetPassword' }
    );
  });
});