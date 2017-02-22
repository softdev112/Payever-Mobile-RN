import { Component } from 'react';
import { StyleSheet, WebView } from 'ui';

/* eslint-disable react/prefer-stateless-function */
export default class Terminal extends Component {
  props: {
    url: string;
  };

  render() {
    return (
      <WebView
        style={styles.container}
        source={{ uri: this.props.url }}
        showNavBar="always"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    '@media ios': {
      marginTop: 15,
    },
  },
});