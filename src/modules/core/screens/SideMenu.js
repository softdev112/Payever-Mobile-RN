import { Component } from 'react';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Icon, ImageButton, StyleSheet, Text, View } from 'ui';
import { Navigator } from 'react-native-navigation';
import { log } from 'utils';

import type ProfilesStore from '../../../store/profiles';
import type BusinessProfile
  from '../../../store/profiles/models/BusinessProfile';
import { hideMenu, showScreen } from '../../../common/Navigation';
import BusinessList from '../components/BusinessList';
import type AuthStore from '../../../store/auth';

@inject('profiles', 'auth')
@observer
export default class SideMenu extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    auth: AuthStore;
    navigator: Navigator;
    profiles?: ProfilesStore;
  };

  onAddNewBusiness() {
    const { navigator } = this.props;

    navigator.push({
      screen: 'dashboard.AddNewBusiness',
      animated: true,
    });
  }

  onClose() {
    hideMenu(this.props.navigator);
  }

  onProfileSelect(profile: BusinessProfile) {
    const { navigator, profiles } = this.props;

    this.onClose();
    profiles.setCurrentProfile(profile);
    navigator.resetTo({
      screen: 'communication.Main',
      animated: false,
    });
  }

  onUserPress() {
    const { navigator, profiles } = this.props;
    profiles.setCurrentProfile(profiles.privateProfile);
    navigator.resetTo({
      screen: 'communication.Main',
      animated: false,
    });
  }

  onProfileSettingsPress() {
    const { navigator, profiles } = this.props;
    this.onClose();
    navigator.push({
      screen: 'core.WebView',
      passProps: { url: profiles.privateProfile.settingsUrl },
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
      .catch(log.error);
    showScreen('core.LaunchScreen');
  }

  render() {
    const { profiles } = this.props;

    if (!profiles.privateProfile) {
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
                source={profiles.privateProfile.logoSource}
                onPress={::this.onUserPress}
              />
              <Text style={styles.userInfo_name} onPress={::this.onUserPress}>
                {profiles.privateProfile.displayName}
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
              profiles={profiles}
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    position: 'absolute',
    right: 5,
    top: 11,
    width: 44,
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
    color: '$pe_color_blue',
    fontSize: 15,
    fontWeight: '400',
    paddingTop: 20,
  },

  userInfo_accountLink: {
    color: '$pe_color_gray_2',
    fontWeight: '400',
    fontSize: 13,
    paddingTop: 8,
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
    fontWeight: '400',
    marginLeft: 24,
    paddingVertical: 16,
  },

  bottomMenu: {
    flexDirection: 'column',
  },

  bottomMenu_item: {
    color: '$pe_color_blue',
    borderTopWidth: 1,
    borderTopColor: '$border_color',
    fontSize: 15,
    fontWeight: '400',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
});