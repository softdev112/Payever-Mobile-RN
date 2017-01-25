import { Component } from 'react';
import { Button, NavBar, StyleSheet, Text, View } from 'ui';
import type { Navigator } from 'react-native-navigation';

export default class WebViewError extends Component {
  props: {
    message?: string;
    navigator: Navigator;
  };

  onBackPress() {
    this.props.navigator.pop();
  }

  render() {
    const { message } = this.props;

    return (
      <View style={styles.container}>
        <NavBar.Default title="Error" />
        <View style={styles.main}>
          <Text style={styles.error}>
            Sorry, this service is temporary unavailable.
            Please try again later.
          </Text>
          { message && (
            <Text style={styles.error}>
              Technical information: {message}
            </Text>
          )}
          <Button
            style={styles.button}
            title={'Go Back'}
            onPress={::this.onBackPress}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  error: {
    marginBottom: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
  },

  button: {
    marginTop: 20,
    width: 120,
  },
});