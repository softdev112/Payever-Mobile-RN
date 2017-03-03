/* eslint-disable */
import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Html, NavBar, StyleSheet, Text, View, Button } from 'ui';
import { Navigator, Navigation } from 'react-native-navigation';
import { observer, inject } from 'mobx-react/native';
import AuthStore from '../../../store/auth';

@inject('auth')
@observer
export default class Debug extends Component {
  static navigatorStyle = { navBarHidden: true };

  props:{
    auth: AuthStore;
    navigator: Navigator;
    inspectObj?: any;
  };

  renderNode(node, index, list) {
    console.log([node, index, list]);
  }

  nullRefreshToken() {
    const auth = this.props.auth;
    auth.refreshToken = 'invalid';
    auth.expiresIn = new Date(0);
    auth.serialize();
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
    const { inspectObj } = this.props;

    return (
      <View style={styles.container}>
        <NavBar.Default />
        <TouchableOpacity
          onPress={() => { Navigation.showModal({
            screen: 'marketing.ViewOffer',
            title: 'Got an Offer:',
            passProps: {
              offerId: 1511,
            },
          })}}
        >
          <Text>Show Offer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { this.props.navigator.push({
            screen: 'pos.Terminal',
            title: 'Terminal',
            passProps: {
              url: 'https://showroom9.payever.de/selfterminal/new/media-shop-1/pos/xxxlutz',
            },
          })}}
        >
          <Text>Terminal</Text>
        </TouchableOpacity>
        <View style={styles.wrapper}>
          <Html source={html} />
        </View>
        {inspectObj && <Text>{JSON.stringify(inspectObj)}</Text>}

        <Button title="Null refreshToken" onPress={::this.nullRefreshToken}/>
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