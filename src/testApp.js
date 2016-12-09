import { Component } from 'react';
import { Text } from 'react-native';
import { Navigation } from 'react-native-navigation';


class Test extends Component {
  render() {
    return <Text>123</Text>
  }
}

Navigation.registerComponent('test', Test);

Navigation.startSingleScreenApp({
  screen: { screen: 'test' },
  appStyle: {
    screenBackgroundColor: '#ffffff',
  }
});