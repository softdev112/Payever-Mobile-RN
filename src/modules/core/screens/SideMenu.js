import { Component } from 'react';
import { ScrollView, Platform } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Icon, ImageButton, StyleSheet, Text, View } from 'ui';
import { Navigator } from 'react-native-navigation';

import type UserProfilesStore from '../../../store/UserProfilesStore/index';
import type BusinessProfile
  from '../../../store/UserProfilesStore/BusinessProfile';
import { hideMenu, showScreen } from '../../../common/Navigation';
import BusinessList from '../components/BusinessList';
import type AuthStore from '../../../store/AuthStore';
import type { Config } from '../../../config';

@inject('userProfiles', 'auth', 'config')
@observer
export default class SideMenu extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    auth: AuthStore;
    config: Config;
    navigator: Navigator;
    userProfiles?: UserProfilesStore;
  };

  onAddNewBusiness() {
    const { navigator, config } = this.props;

    navigator.push({
      screen: 'core.WebView',
      passProps: {
        url: config.siteUrl + '/private/create-business',
        injectOptions: {
          isAddBusiness: true,
          title: 'Add New Business',
          platform: Platform.OS,
        },
      },
    });
  }

  onClose() {
    hideMenu(this.props.navigator);
  }

  onProfileSelect(profile: BusinessProfile) {
    const { userProfiles } = this.props;

    this.onClose();
    userProfiles.setCurrentProfile(profile);
    showScreen('dashboard.Dashboard');
  }

  onUserPress() {
    const { userProfiles } = this.props;
    userProfiles.setCurrentProfile(userProfiles.privateProfile);
    // todo: replace to navigator.push
    showScreen('dashboard.Private');
  }

  onProfileSettingsPress() {
    const { navigator, userProfiles } = this.props;
    this.onClose();
    navigator.push({
      screen: 'core.WebView',
      passProps: { url: userProfiles.privateProfile.settingsUrl },
    });
  }

  onDebugPagePress() {
    const { navigator } = this.props;
    this.onClose();
    navigator.push({
      screen: 'core.Debug',
      title: 'Debug',
      animated: true,
    });
  }

  onLogoutPress() {
    const { auth } = this.props;
    auth.logout()
      .catch(e => console.warn(e));
    showScreen('auth.Login');
  }

  render() {
    const { userProfiles } = this.props;

    if (!userProfiles.privateProfile) {
      return null;
    }

    return (
      <View style={styles.container}>

        <View style={styles.btnClose}>
          <Icon source="icon-x-16" onPress={::this.onClose} />
        </View>

        <View style={styles.businesses}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.userInfo}>
              <ImageButton
                style={styles.userInfo_avatar}
                source={userProfiles.privateProfile.logoSource}
                onPress={::this.onUserPress}
              />
              <Text style={styles.userInfo_name} onPress={::this.onUserPress}>
                {userProfiles.privateProfile.displayName}
              </Text>
              <View>
                <Text
                  style={styles.userInfo_accountLink}
                  onPress={::this.onUserPress}
                >
                  My Account
                </Text>
                <View style={styles.userInfo_profile}>
                  <Icon
                    style={styles.userInfo_profileIcon}
                    source="icon-settings-24"
                    onPress={::this.onProfileSettingsPress}
                  />
                </View>
              </View>
            </View>
            <BusinessList
              onSelect={::this.onProfileSelect}
              userProfiles={userProfiles}
            />
            <Text
              style={styles.addBusiness}
              onPress={::this.onAddNewBusiness}
            >
              Add New Business
            </Text>
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
          <Text
            style={styles.bottomMenu_item}
            onPress={::this.onLogoutPress}
          >
            Logout
          </Text>
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
  },

  btnClose: {
    position: 'absolute',
    top: 25,
    right: 19,
    width: 16,
    height: 16,
    zIndex: 2,
  },

  businesses: {
    flex: 1,
  },

  userInfo: {
    paddingTop: 25,
    paddingRight: 19,
    paddingBottom: 19,
    paddingLeft: 25,
    borderBottomWidth: 1,
    borderBottomColor: '$border_color',
  },

  userInfo_avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  userInfo_name: {
    paddingTop: 20,
    fontSize: 15,
    color: '$pe_color_blue',
  },

  userInfo_accountLink: {
    paddingTop: 8,
    color: '$pe_color_gray_2',
    fontSize: 13,
  },

  userInfo_profile: {
    position: 'absolute',
    top: -22,
    right: 0,
  },

  userInfo_profileIcon: {
    color: '$pe_color_gray_2',
  },

  addBusiness: {
    color: '$pe_color_blue',
    fontSize: 15,
    marginLeft: 24,
    paddingVertical: 12,
  },

  bottomMenu: {
    flexDirection: 'column',
  },

  bottomMenu_item: {
    paddingTop: 18,
    paddingLeft: 24,
    paddingBottom: 18,
    paddingRight: 24,
    fontSize: 15,
    color: '$pe_color_blue',
    borderTopWidth: 1,
    borderTopColor: '$border_color',
  },
});