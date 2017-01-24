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