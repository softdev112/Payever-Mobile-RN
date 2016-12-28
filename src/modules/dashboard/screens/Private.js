import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { StyleSheet, View } from 'ui';
import type { Navigator } from 'react-native-navigation';

import DashboardTitle from '../components/DashboardTitle';
import Dock from '../components/Dock';
import SearchHeader from '../components/SearchHeader';
import type UserProfilesStore from '../../../store/UserProfilesStore/index';
import AppItem from '../../../store/UserProfilesStore/AppItem';
import type { Config } from '../../../config';


/* eslint-disable global-require */
const PAGES: Array<AppItem> = [
  new AppItem({
    id: 'purchases',
    name: 'Purchases',
    url: '/private/transactions',
    image: require('../images/communication.png'),
  }),
  new AppItem({
    id: 'communication',
    name: 'Communication',
    url: '/private/network/app/communication',
    image: require('../images/purchases.png'),
  }),
  new AppItem({
    id: 'account',
    name: 'Account',
    url: '/private/network/30615/account',
    image: require('../images/settings.png'),
  }),
];
/* eslint-enable global-require */

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

  onAppClick(app: AppItem) {
    const { config, navigator } = this.props;

    if (app.url) {
      navigator.push({
        title: app.name,
        screen: 'core.WebView',
        passProps: { url: config.siteUrl + app.url },
      });
    }
  }

  render() {
    const { userProfiles, navigator } = this.props;
    const userName = userProfiles.currentProfile.displayName;
    return (
      <View style={styles.container}>
        <SearchHeader navigator={navigator} />
        <View style={styles.center}>
          <DashboardTitle
            title1="Welcome"
            title2={userName}
          />
        </View>
        <Dock
          apps={PAGES}
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