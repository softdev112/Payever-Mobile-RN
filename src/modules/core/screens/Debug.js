/* eslint-disable */
import { Component } from 'react';
import { Html, NavBar, StyleSheet, View } from 'ui';
import { Navigator } from 'react-native-navigation';



export default class Debug extends Component {
  static navigatorStyle = { navBarHidden: true };

  props:{
    navigator: Navigator;
  };

  renderNode(node, index, list) {
    console.log([node, index, list]);
  }

  render() {
    const html = `
      <h1>A special offer. Just for you.</h1>
      
      <p>
        As you previously bought from us we wanted to thank you by
        showing you this offer below before everyone else sees it.
      </p>
      
      <p>
        Best,<br />
        MyOnlineShop
      </p>
    `;

    return (
      <View style={styles.container}>
        <NavBar.Default />
        <View style={styles.wrapper}>
          <Html source={html} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  wrapper: {
    borderColor: '#ddd',
    borderWidth: 1,
  }
});