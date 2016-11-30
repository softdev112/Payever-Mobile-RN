import { Component } from 'react';
import { Text } from 'react-native';

export default class Splash extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  render() {
    return (
      <Text>Loading...</Text>
    );
  }
}