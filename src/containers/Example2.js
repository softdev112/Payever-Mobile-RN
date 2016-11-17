import { Component } from 'react';
import { Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Example2 extends Component {
  onPress() {
    Actions.webview({ uri : 'https://mein.payever.de/login'})
  }

  render() {
    return (
      <View style={{margin: 128}}>
        <Text onPress={::this.onPress}>native sign. Click to return. </Text>
      </View>
    )
  }
}