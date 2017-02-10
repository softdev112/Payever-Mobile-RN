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
    const html = '<p>Text <b>bold</b> +79617742000 other 343-32-12 <s>http://ya.ru</s></p>';
    return (
      <View style={styles.container}>
        <NavBar.Default />
        <Html source={html} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});