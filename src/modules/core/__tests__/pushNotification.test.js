/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import PushNotification from '../screens/PushNotification';

jest.mock('../../../common/Navigation');

describe('modules/core/screens/PushNotification', () => {
  it('PushNotification should render correctly with dummy data', async () => {
    const action = jest.fn();

    const tree = renderer.create(
      <PushNotification
        action={action}
        message="Hello World!!!!!"
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});