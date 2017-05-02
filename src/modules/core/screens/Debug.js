/* eslint-disable */
import { Component } from 'react';
import { TouchableOpacity, WebView } from 'react-native';
import { RoundSwitch, Html, NavBar, StyleSheet, Text, View, Button } from 'ui';
import { Navigator, Navigation } from 'react-native-navigation';
import { soundHelper } from 'utils';
import { observer, inject } from 'mobx-react/native';
import AuthStore from '../../../store/auth';

const testSound = require('../../../store/communication/resources/sounds/receive_msg.mp3');

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
    const { inspectObj, navigator } = this.props;

    return (
      <View style={styles.container}>
        <NavBar.Default />
        <TouchableOpacity
          onPress={() => {
            navigator.push({
              screen: 'communication.SelectContact'
            })
          }}
        >
          <Text>OOOOO</Text>
        </TouchableOpacity>
        <WebView
          contentInset={{ top: 20, left: 0, bottom: 0, right: 0 }}
          source={{ uri: 'https://stage.payever.de'}}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          bounces={false}
        />
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