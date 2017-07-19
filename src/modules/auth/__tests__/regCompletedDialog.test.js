/* eslint-disable max-len */
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import RegCompletedDialog from '../screens/RegCompletedDialog';
import Store from '../../../store';
import config from '../../../config';
import navigator from '../../../../__mocks__/navigator';
import { showScreen } from '../../../common/Navigation';

jest.mock('../../../common/Navigation');

describe('modules/auth/screens/RegCompletedDialog', () => {
  let store;
  let auth;

  beforeEach(() => {
    store = new Store(config);
    auth = store.auth;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('RegCompletedDialog should render correctly if auth.error does not set', () => {
    const tree = renderer.create(
      <RegCompletedDialog
        auth={auth}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('RegCompletedDialog should render correctly if auth.error is set', () => {
    auth.error = 'Test eror';

    const tree = renderer.create(
      <RegCompletedDialog
        auth={auth}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('RegCompletedDialog/onCLoseDialog() should call navigator.dismissLightBox and showScreen => core.LaunchScreen', () => {
    const wrapper = shallow(
      <RegCompletedDialog
        auth={auth}
      />,
      { context: { navigator } }
    );

    wrapper.dive()
      .find('TextButton')
      .at(0)
      .props()
      .onPress();

    expect(navigator.dismissLightBox).toHaveBeenCalled();
    expect(navigator.dismissLightBox).toHaveBeenCalledWith({ animated: true });
    expect(showScreen).toHaveBeenCalled();
    expect(showScreen).toHaveBeenCalledWith('core.LaunchScreen');
  });
});