/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import RegisterWithEmail from '../screens/RegisterWithEmail';
import Store from '../../../store';
import config from '../../../config';
import navigator from '../../../../__mocks__/navigator';

jest.mock('../../../common/ui/FlatTextInput', () => 'FlatTextInput');

describe('modules/auth/screens/RegCompletedDialog', () => {
  let store;
  let auth;

  beforeAll(() => {
    RegisterWithEmail.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    RegisterWithEmail.childContextTypes = {
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

  it('RegCompletedDialog should render correctly if auth.error does not set', () => {
    const tree = renderer.create(
      <RegisterWithEmail
        auth={auth}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});