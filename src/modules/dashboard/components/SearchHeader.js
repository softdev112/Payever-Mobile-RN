import type UserProfilesStore from '../../../store/UserProfilesStore';

import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ImageButton, StyleSheet, View } from 'ui';

@inject('userProfiles')
@observer
export default class SearchHeader extends Component {
  props: {
    navigator: Navigator,
    userProfiles?: UserProfilesStore
  };

  onProfilePress() {
    const { navigator } = this.props;
    navigator.toggleDrawer({ side: 'right' });
  }

  render() {
    const { userProfiles } = this.props;

    if (!userProfiles.privateProfile) {
      return null;
    }

    return (
      <View style={styles.container}>
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
    margin: 20,
    marginTop: 10,
    marginBottom: 0,
    '@media ios': {
      marginTop: 20
    }
  },

  profile: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    width: 30,
    height: 30,
    borderRadius: 15
  }
});