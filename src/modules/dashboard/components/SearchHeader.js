import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Icon, ImageButton, StyleSheet, View, Text } from 'ui';
import type { Navigator } from 'react-native-navigation';

import type UserProfilesStore from '../../../store/UserProfilesStore';
import { toggleMenu } from '../../../common/Navigation';

@inject('userProfiles')
@observer
export default class SearchHeader extends Component {
  props: {
    navigator: Navigator,
    title?: string,
    userProfiles?: UserProfilesStore
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
    const { userProfiles, title } = this.props;

    if (!userProfiles.privateProfile) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Icon
          style={styles.search}
          name="icon-search-16"
          onPress={::this.onSearchPress}
        />
        <Text style={styles.title} onPress={::this.onSearchPress}>{title}</Text>
        <ImageButton
          source={userProfiles.currentProfile.logoSource}
          style={styles.profile}
          onPress={::this.onProfilePress}
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
    '@media ios and (orientation: portrait)': {
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