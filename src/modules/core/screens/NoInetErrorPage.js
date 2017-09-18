import { Component } from 'react';
import type { Navigator } from 'react-native-navigation';
import { StyleSheet, Text, View } from 'ui';

export default class NoInetErrorPage extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textCont}>
          <Text style={styles.bigText}>Payever Services not available</Text>
          <Text style={styles.smallText}>no internet connection</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000EE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textCont: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  bigText: {
    fontSize: 20,
    color: '#FFF',
  },

  smallText: {
    fontSize: 16,
    color: '#FFF',
  },
});