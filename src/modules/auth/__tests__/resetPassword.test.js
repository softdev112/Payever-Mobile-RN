/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import ResetPassword from '../screens/ResetPassword';
import Store from '../../../store';
import config from '../../../config';
import navigator from '../../../../__mocks__/navigator';

jest.mock('../../../common/ui/FlatTextInput', () => 'FlatTextInput');

describe('modules/auth/screens/ResetPassword', () => {
  let store;
  let auth;

  beforeAll(() => {
    ResetPassword.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    ResetPassword.childContextTypes = {
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

  it('ResetPassword should render correctly if', () => {
    const tree = renderer.create(
      <ResetPassword
        auth={auth}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});