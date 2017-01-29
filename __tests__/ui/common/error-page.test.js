import 'react-native';
import renderer from 'react-test-renderer';

import ErrorPage from '../../../src/modules/core/screens/ErrorPage';

describe('src/modules/core/screens/ErrorPage.js', () => {
  it('src/modules/core/screens/ErrorPage.js renders correctly', () => {
    const tree = renderer.create(
      <ErrorPage message="Hello World!" />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});