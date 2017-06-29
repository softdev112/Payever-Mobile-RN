import { Component } from 'react';
import type { Navigator } from 'react-native-navigation';
import { Button, Error, Header, StyleSheet, View } from 'ui';

export default class ErrorPage extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    message: string;
    navigator: Navigator;
  };

  onGoToLogin() {
    this.props.navigator.push({
      screen: 'auth.Login',
      animated: true,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header>Error</Header>
        <View style={styles.errorContainer}>
          <Error
            style={styles.error}
            message={this.props.message}
          />
          <Button
            style={styles.button}
            title={'Go To Login'}
            onPress={::this.onGoToLogin}
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

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  error: {
    width: '80%',
  },

  button: {
    marginTop: 10,
    width: 120,
  },
});