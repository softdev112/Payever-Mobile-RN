/* eslint-disable */
import { Component } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'ui';

export default class FloatToolbar extends Component {
  render() {
    const { navigator } = this.props;

    return (
      <View style={styles.container}>
        <Text onPress={() => navigator.dismissLightBox()}>Hello World!!!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: '#FFF',
  },
});