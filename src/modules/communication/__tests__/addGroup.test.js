/* eslint-disable max-len */
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import { Provider } from 'mobx-react/native';
import config from '../../../config';
import AddGroup from '../screens/AddGroup';
import Store from '../../../store';
import navigator from '../../../../__mocks__/navigator';

jest.mock('../components/contacts/AddContactBlock', () => 'AddContactBlock');

describe('modules/communication/screens/AddGroup', () => {
  let store;
  let communication;
  let profiles;

  beforeAll(() => {
    AddGroup.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    AddGroup.childContextTypes = { navigator: PropTypes.object };
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
        <AddGroup navigator={navigator} />
      </Provider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});