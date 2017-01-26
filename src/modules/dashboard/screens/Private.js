import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { StyleSheet, View } from 'ui';
import type { Navigator } from 'react-native-navigation';

import DashboardTitle from '../components/DashboardTitle';
import Dock from '../components/Dock';
import SearchHeader from '../components/SearchHeader';
import type UserProfilesStore from '../../../store/UserProfilesStore/index';
import AppItem from '../../../store/UserProfilesStore/models/AppItem';
import type { Config } from '../../../config';

const APPS: Array<Object> = [
  {
    id: 'purchases',
    name: 'Purchases',
    url: '/private/transactions',
    image: '/images/dashboard/purchases.png',
  },
  {
    id: 'communication',
    name: 'Communication',
    url: '/private/network/app/communication',
    image: '/images/dashboard/communication.png',
  },
  {
    id: 'account',
    name: 'Account',
    image: '/images/dashboard/settings.png',
  },
];

@inject('config', 'userProfiles')
@observer
export default class Private extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
    userProfiles: UserProfilesStore;
    config: Config;
  };

  apps: Array<AppItem>;

  constructor(params) {
    super(params);

    const { config, userProfiles } = this.props;

    this.apps = APPS.map((app) => {
      let url = config.siteUrl + app.url;
      if (app.id === 'account') {
        url = userProfiles.privateProfile.settingsUrl;
      }
      return new AppItem({
        url,
        id: app.id,
        name: app.name,
        image: { uri: config.siteUrl + app.image },
      });
    });
  }

  onAppClick(app: AppItem) {
    const { navigator } = this.props;

    if (app.settings.screenId) {
      navigator.push({
        title: app.name,
        screen: app.settings.screenId,
      });
      return;
    }

    navigator.push({
      title: app.name,
      screen: 'core.WebView',
      passProps: {
        ...app.settings.webView,
        url: app.url,
      },
    });
  }

  render() {
    const { userProfiles, navigator } = this.props;
    const userName = userProfiles.privateProfile.displayName;
    return (
      <View style={styles.container}>
        <SearchHeader navigator={navigator} />
        <View style={styles.center}>
          <DashboardTitle
            title1="Welcome"
            title2={userName}
            showOnSmallScreens
          />
        </View>
        <Dock
          apps={this.apps}
          onAppClick={::this.onAppClick}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
  },
});