import { Component, PropTypes } from 'react';
import { View } from 'react-native';
import type { Navigator } from 'react-native-navigation';

import Button from '../Button';
import NavBar from '../NavBar';
import StyleSheet from '../StyleSheet';
import Text from '../Text';

export default class WebViewError extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    message?: string;
  };

  onBackPress() {
    this.context.navigator.pop();
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
          {message && (
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
  button: {
    marginTop: 20,
    width: 120,
  },

  container: {
    flex: 1,
  },

  error: {
    marginBottom: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
  },

  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});