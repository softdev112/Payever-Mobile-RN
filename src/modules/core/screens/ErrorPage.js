import { Component } from 'react';
import type { Navigator } from 'react-native-navigation';
import { Button, ErrorBox, Header, StyleSheet, View } from 'ui';

export default class ErrorPage extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    message: string;
    navigator: Navigator;
    onBack?: () => {};
  };

  onGoBack() {
    const { navigator, onBack } = this.props;

    if (onBack) {
      onBack();
    } else {
      navigator.pop({ animated: true });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header>Error!</Header>
        <View style={styles.errorContainer}>
          <ErrorBox message={this.props.message} />
          <Button
            style={styles.button}
            title={'Back'}
            onPress={::this.onGoBack}
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
    alignItems: 'center',
    paddingTop: '15%',
    flex: 1,
  },

  error: {
    width: '80%',
  },

  button: {
    marginTop: 30,
    width: 120,
    elevation: 2,
  },
});