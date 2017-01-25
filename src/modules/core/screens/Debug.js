/* eslint-disable */

import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { toggleMenu } from '../../../common/Navigation';
import { NavBar, StyleSheet, View } from 'ui';
import { Navigator } from 'react-native-navigation';

@inject('userProfiles')
@observer
export default class Debug extends Component {
  static navigatorStyle = { navBarHidden: true };

  props:{
    navigator: Navigator;
  };

  onShowSideMenu() {
    toggleMenu(this.props.navigator);
  }

  showError() {
    this.props.navigator.push({
      screen: 'core.WebView',
      passProps: {
        url: 'http://site-not-exists.ru'
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>

        <NavBar style={styles.navBar}>
          <NavBar.Back />
          <NavBar.Title
            source={{
              uri: 'https://mein.payever.de/images/dashboard/communication.png'
            }}
          />
          <NavBar.Menu />
        </NavBar>

        <NavBar style={styles.navBar}>
          <NavBar.Back />
          <NavBar.Title
            source={{
              uri: 'https://mein.payever.de/images/dashboard/communication.png'
            }}
            title="Communication"
          />
          <NavBar.Menu />
        </NavBar>

        <NavBar style={styles.navBar} popup>
          <NavBar.Back />
          <NavBar.Title title="Create New Offer" />
          <NavBar.Button title="Save Draft" />
          <NavBar.IconButton source="icon-fly-mail-24" title="Send Offer" />
        </NavBar>

        <NavBar style={styles.navBar} popup>
          <NavBar.Back />
          <NavBar.Title title="New Offer" />
          <NavBar.Button title="Save Draft" />
          <NavBar.IconButton source="icon-fly-mail-24" title="Send Offer" />
        </NavBar>

        <View style={styles.mainContent}>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  row: {
    flexDirection: 'row'
  },

  image: {
    width: 16,
    height: 16,
    shadowColor: 'rgba(0,0,0,.15)',
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    borderRadius: 8,
  },

  navBar: {

  },

  mainContent: {
  },
});