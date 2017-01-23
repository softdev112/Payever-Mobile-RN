/* eslint-disable */

import React, { Component } from 'react';
import { Image, Animated } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { showScreen, toggleMenu } from '../../../common/Navigation';
import { Icon, Loader, StyleSheet, Text, View } from 'ui';
import { Navigator } from 'react-native-navigation';

import NavBar from '../components/NavBar';
const EARLY_LOADING = require('../../../store/UserProfilesStore/images/no-business.png');

@inject('userProfiles')
@observer
export default class Debug extends Component {
  static navigatorStyle = { navBarHidden: true };

  props:{
    navigator: Navigator;
    userProfiles?: UserProfilesStore;
  };

  onShowSideMenu() {
    toggleMenu(this.props.navigator);
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar style={styles.navBar}>
          <NavBar.Back title="Back" onPress={() => this.props.navigator.pop()}/>
          <NavBar.Title
            source={{uri: 'https://mein.payever.de/images/dashboard/settings.png?v5.1.1'}}
            title={'SETTINGS'}
          />
          <NavBar.Menu
            source={this.props.userProfiles.privateProfile.logoSource}
            title="Add"
            onPress={() => toggleMenu(this.props.navigator)}
          />
        </NavBar>
        <View style={styles.mainContent}>
          <View style={styles.row}>
            <Icon source="icon-search-16"/>
            <Text>icon-search-16 Icon</Text>
          </View>
          <View style={styles.row}>
            <Image
              style={styles.image}
              source={require('../../../store/UserProfilesStore/images/no-business.png')}
            />
            <Text>no-business1</Text>
          </View>
          <View style={styles.row}>
            <Image style={styles.image} source={EARLY_LOADING}/>
            <Text>no-business early loading</Text>
          </View>
          <View style={styles.row}>
            <Loader isLoading/>
            <Text>Spinner</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    '@media ios and (orientation: portrait)': {
      marginTop: 15,
    },
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