/* eslint-disable */
import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Html, NavBar, StyleSheet, Text, View } from 'ui';
import { Navigator, Navigation } from 'react-native-navigation';
import offer from './data';


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
        <TouchableOpacity
          onPress={() => { Navigation.showModal({
            screen: 'communication.OfferPreview',
            title: 'Got an Offer:',
            passProps: {
              offer,
            },
          })}}
        >
          <Text>Show Offer</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});