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