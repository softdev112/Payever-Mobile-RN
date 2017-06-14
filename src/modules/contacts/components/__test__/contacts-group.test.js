import 'react-native';
import renderer from 'react-test-renderer';

import BusinessContacts from '../../screens/BusinessContacts';

describe('Contacts App components renders correctly', () => {
  it('contacts/screens/BusinessContacts.js renders correctly', () => {
    const tree = renderer.create(
      <BusinessContacts />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});