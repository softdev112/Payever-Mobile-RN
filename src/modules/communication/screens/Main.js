import { Component } from 'react';
import { images, NavBar, StyleSheet, View } from 'ui';

import Contacts from '../components/contacts';

export default class Main extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  render() {
    return (
      <View style={styles.container}>
        <NavBar.Default title="Communication" source={images.communication} />
        <Contacts />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});