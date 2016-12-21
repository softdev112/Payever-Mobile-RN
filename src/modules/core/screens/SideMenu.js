import type UserProfilesStore from '../../../store/UserProfilesStore/index';
import type BusinessProfile from '../../../store/UserProfilesStore/BusinessProfile';

import { Component } from 'react';
import { ScrollView } from 'react-native'
import { inject, observer } from 'mobx-react/native';
import { ImageButton, StyleSheet, Text, View } from 'ui';

import BusinessList from '../components/BusinessList';

import imgClose from '../images/ic_close.png';

@inject('userProfiles')
@observer
export default class SideMenu extends Component {
  props: {
    navigator: Navigator,
    userProfiles?: UserProfilesStore
  };

  onClose() {
    const { navigator } = this.props;
    navigator.toggleDrawer({
      side: 'right',
      animated: true,
      to: 'closed'
    });
  }

  onProfileSelect(profile: BusinessProfile) {
    const { userProfiles, navigator } = this.props;

    this.onClose();
    userProfiles.setCurrentProfile(profile);
    navigator.push({
      screen: 'dashboard.Dashboard',
      title: 'Home',
      animated: true
    });
  }

  onUserPress() {
    const { userProfiles, navigator } = this.props;

    this.onClose();
    userProfiles.setCurrentProfile(userProfiles.privateProfile);
    navigator.push({
      screen: 'dashboard.Private',
      title: 'Home',
      animated: true
    });
  }

  onDebugPagePress() {
    const { navigator } = this.props;
    this.onClose();
    navigator.push({
      screen: 'core.Debug',
      title: 'Debug',
      animated: true
    });
  }

  render() {
    const { userProfiles } = this.props;

    if (!userProfiles.privateProfile) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.shadow} />

        <ImageButton
          source={imgClose}
          style={styles.btnClose}
          onPress={::this.onClose}
        />

        <View style={styles.businesses}>
          <ScrollView style={{ flex: 1}}>

            <View style={styles.userInfo}>
              <ImageButton
                style={styles.userInfo_avatar}
                source={userProfiles.privateProfile.logoSource}
                onPress={::this.onUserPress}
              />
              <Text style={styles.userInfo_name} onPress={::this.onUserPress}>
                {userProfiles.privateProfile.displayName}
              </Text>
              <View style={styles.userInfo_accountLink}>
                <Text onPress={::this.onUserPress}>My account</Text>
              </View>
            </View>

            <BusinessList
              onSelect={::this.onProfileSelect}
              userProfiles={userProfiles}
            />

            <Text style={styles.addBusiness}>Add new business</Text>

          </ScrollView>
        </View>

        <View style={styles.bottomMenu}>
          {__DEV__ && (
            <Text
              style={styles.bottomMenu_item}
              onPress={::this.onDebugPagePress}
            >
              Debug page
            </Text>
          )}
          <Text style={styles.bottomMenu_item}>Chat with us</Text>
          <Text style={styles.bottomMenu_item}>Logout</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: 'white',
    justifyContent: 'center',
    width: 280
  },

  shadow: {
    '@media ios': {
      position: 'absolute',
      width: 1,
      top: 0,
      left: 0,
      bottom: 0,
      backgroundColor: '#eeeeee',
      shadowColor: 'black',
      shadowOffset: { width: 1, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 6,
      zIndex: 3
    }
  },

  btnClose: {
    position: 'absolute',
    top: 25,
    right: 19,
    width: 16,
    height: 16,
    zIndex: 2
  },

  businesses: {
    flex: 1
  },

  userInfo: {
    paddingTop: 25,
    paddingRight: 19,
    paddingBottom: 19,
    paddingLeft: 25
  },

  userInfo_avatar: {
    width: 64,
    height: 64,
    borderRadius: 32
  },

  userInfo_name: {
    fontSize: 15,
    color: '$pe_color_blue'
  },

  userInfo_accountLink: {

  },

  addBusiness: {
    marginLeft: 24,
    paddingTop: 18,
    fontSize: 15,
    color: '$pe_color_blue'
  },

  bottomMenu: {
    flexDirection: 'column'
  },

  bottomMenu_item: {
    paddingTop: 18,
    paddingLeft: 24,
    paddingBottom: 18,
    paddingRight: 24,
    fontSize: 15,
    color: '$pe_color_blue',
    borderTopWidth: 1,
    borderTopColor: '$border_color'
  }
});