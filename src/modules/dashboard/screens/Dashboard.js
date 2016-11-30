import { Component } from 'react';
import { Text } from 'react-native';

export default class Dashboard extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  render() {
    return (
      <Text>Dashboard</Text>
    );
  }
}