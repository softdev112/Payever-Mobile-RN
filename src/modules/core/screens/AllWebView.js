import { Component } from 'react';
import { StyleSheet, View, WKWebView } from 'ui';

export default class AllWebView extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

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