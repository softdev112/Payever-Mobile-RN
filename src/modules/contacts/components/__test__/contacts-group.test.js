import 'react-native';
import renderer from 'react-test-renderer';
import { Provider } from 'mobx-react/native';
import Store from '../../../../store';
import config from '../../../../config';
import BusinessContacts from '../../screens/BusinessContacts';
import navigator from '../../../../../__mocks__/navigator';

describe('Contacts App components renders correctly', () => {
  let store;
  let contacts;

  beforeAll(() => {
    BusinessContacts.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    BusinessContacts.childContextTypes = { navigator: React.PropTypes.object };
  });

  beforeEach(() => {
    store = new Store(config);
    contacts = store.contacts;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('contacts/screens/BusinessContacts.js renders correctly', () => {
    const tree = renderer.create(
      <Provider contacts={contacts}>
        <BusinessContacts />
      </Provider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});