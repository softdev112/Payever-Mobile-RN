import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { IconText, StyleSheet, View } from 'ui';
import type { Navigator } from 'react-native-navigation';

import SearchHeader from '../components/SearchHeader';
import type UserProfilesStore from '../../../store/UserProfilesStore/index';
import type { Config } from '../../../config';


/* eslint-disable global-require */
const PAGES: Array<Page> = [
  {
    id: 'purchases',
    title: 'Purchases',
    url: '/private/transactions',
    img: require('../images/communication.png'),
  },
  {
    id: 'communication',
    title: 'Communication',
    url: '/private/network/app/communication',
    img: require('../images/purchases.png'),
  },
  {
    id: 'account',
    title: 'Account',
    url: '/private/network/30615/account',
    img: require('../images/settings.png'),
  },
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

  onIconClick(page: Page) {
    const { config, navigator } = this.props;

    if (page.url) {
      navigator.push({
        title: page.title,
        screen: 'core.WebView',
        passProps: { url: config.siteUrl + page.url },
      });
    }
  }

  render() {
    const title = (
      'Welcome ' + this.props.userProfiles.currentProfile.displayName
    ).toUpperCase();
    return (
      <View style={styles.container}>
        <SearchHeader navigator={this.props.navigator} title={title} />
        <View style={styles.grid}>
          {PAGES.map((page: Page) => (
            <IconText
              key={page.id}
              title={page.title}
              source={page.img}
              onPress={() => this.onIconClick(page)}
              style={styles.item}
              imageStyle={styles.icon}
              textStyle={styles.iconTitle}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 60,
  },

  item: {
    width: 110,
    height: 105,
  },

  icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
    borderRadius: 15,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, .1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },

  iconTitle: {
    paddingTop: 0,
    color: '$pe_color_gray_2',
  },
});

type Page = {
  id: string;
  title: string;
  url: string;
  img: number;
};