import { Component } from 'react';
import { Navigator } from 'react-native-navigation';
import { StyleSheet, View, WKWebView } from 'ui';
import { networkHelper } from 'utils';

const PING_TIMEOUT = 3000;

export default class AllWebView extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
  };

  state: {
    showError: boolean;
  };

  detectConnectionTimer: number;

  constructor(props) {
    super(props);

    this.state = {
      showError: false,
    };
  }

  componentWillMount() {
    if (!this.detectConnectionTimer) {
      this.detectConnectionTimer = setInterval(
        () => this.onDetectConnection(), PING_TIMEOUT
      );
    }
  }

  componentWillUnmount() {
    if (this.detectConnectionTimer) {
      clearInterval(this.detectConnectionTimer);
    }
  }

  async onDetectConnection() {
    const { navigator } = this.props;
    const { showError } = this.state;

    if (await networkHelper.isConnected(PING_TIMEOUT - 200)) {
      if (showError) {
        navigator.dismissModal();
        this.setState({ showError: false });
      }
    } else if (!showError) {
      this.setState({ showError: true });
      navigator.showModal({ screen: 'core.NoInetErrorPage' });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <WKWebView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});