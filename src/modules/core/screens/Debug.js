/* eslint-disable */
import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { RoundSwitch, Html, NavBar, StyleSheet, Text, View, Button, WebView } from 'ui';
import { Navigator, Navigation } from 'react-native-navigation';
import { google, facebook, twitter, tumblr } from 'react-native-simple-auth';
import { soundHelper } from 'utils';
import { observer, inject } from 'mobx-react/native';

import AuthStore from '../../../store/auth';
import SegmentedControl from '../../../common/ui/SegmentedControl/index.android';
const testSound = require('../../../store/communication/resources/sounds/receive_msg.mp3');

@inject('auth')
@observer
export default class Debug extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true,
    drawUnderTabBar: true,
  };

  props:{
    auth: AuthStore;
    navigator: Navigator;
    inspectObj?: any;
  };

  state: {
    isHidden: boolean,
  };

  constructor(props) {
    super(props);

    this.state = {
      isHidden: true,
    }
  }

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
        <NavBar>
          <NavBar.Search />
        </NavBar>  
        <TouchableOpacity
          onPress={() => {
            navigator.push({
              screen: 'contacts.BusinessContacts',
              animated: true,
            });
          }}
        >
          <Text>Contacts</Text>
        </TouchableOpacity>
        <SegmentedControl
          style={{ width: 300 }}
          values={['one', 'two', 'three', 'four']}
          selectedIndex={0}
        />
        <View style={{ flex: 1, borderColor: 'red', borderWidth: 1 }}>
          <WebView
            showLoader={false}
            showNavBar="never"
            source={{ uri: 'https://gmail.com' }}
          />
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