import type UserProfilesStore from '../../../store/UserProfilesStore/index';
import type Config from '../../../config';

import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { IconText, StyleSheet, View } from 'ui';
import SearchHeader from '../components/SearchHeader';

const PAGES: Array<Page> = [
  {
    id: 'purchases',
    title: 'Purchases',
    url: '/private/transactions',
    img: require('../images/communication.png')
  },
  {
    id: 'communication',
    title: 'Communication',
    url: '/private/network/app/communication',
    img: require('../images/purchases.png')
  },
  {
    id: 'account',
    title: 'Account',
    url: '/private/network/30615/account',
    img: require('../images/settings.png')
  }
];

@inject('config')
@observer
export default class Private extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  props: {
    navigator: Navigator;
    userProfiles: UserProfilesStore;
    config: Config;
  };

  constructor(props) {
    super(props);
  }

  onIconClick(page: Page) {
    const { config, navigator } = this.props;

    if (page.url) {
      navigator.push({
        title: page.title,
        screen: 'core.WebView',
        passProps: { url: config.siteUrl + page.url }
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchHeader navigator={this.props.navigator} />
        <View style={styles.grid}>
          {PAGES.map((page: Page) => (
            <IconText
              key={page.id}
              title={page.title}
              source={page.img}
              onPress={() => this.onIconClick(page)}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

type Page = {
  id: string;
  title: string;
  url: string;
  img: number;
};