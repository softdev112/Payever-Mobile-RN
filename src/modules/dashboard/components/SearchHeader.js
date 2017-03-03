import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Icon, ImageButton, StyleSheet, View, Text } from 'ui';
import type { Navigator } from 'react-native-navigation';

import type ProfilesStore from '../../../store/profiles';
import { toggleMenu } from '../../../common/Navigation';

@inject('profiles')
@observer
export default class SearchHeader extends Component {
  props: {
    navigator: Navigator;
    title?: string;
    profiles?: ProfilesStore;
  };

  onProfilePress() {
    toggleMenu(this.props.navigator);
  }

  onSearchPress() {
    const { navigator } = this.props;
    navigator.push({
      title: 'Search',
      animated: false,
      screen: 'dashboard.Search',
    });
  }

  render() {
    const { profiles, title } = this.props;

    if (!profiles.privateProfile) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Icon
          style={styles.search}
          source="icon-search-16"
          onPress={::this.onSearchPress}
        />
        <Text style={styles.title} onPress={::this.onSearchPress}>{title}</Text>
        <ImageButton
          hitSlop={{ top: 7, right: 7, bottom: 7, left: 0 }}
          onPress={::this.onProfilePress}
          source={profiles.currentProfile.logoSource}
          style={styles.profile}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 0,
    '@media ios': {
      paddingTop: 30,
    },
  },

  search: {
    color: '#b5b9be',
  },

  title: {
    flex: 1,
    textAlign: 'center',
  },

  profile: {
    alignSelf: 'flex-end',
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});