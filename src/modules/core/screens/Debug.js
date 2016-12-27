/* eslint-disable */

import type UserProfilesStore from '../../../store/UserProfilesStore';

import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Icon, ImageButton, Loader as UiLoader, StyleSheet, Text, View } from 'ui';

@inject('userProfiles')
@observer
export default class Debug extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    userProfiles: PropTypes.object.isRequired
  };

  props: {
    navigator: Navigator;
    userProfiles: UserProfilesStore;
  };

  onBackPress() {
    this.props.navigator.pop();
  }

  onProfilePress() {
    const { navigator } = this.props;
    navigator.toggleDrawer({ side: 'right' });
  }

  render() {
    const { userProfiles } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            style={styles.back}
            name="icon-arrow-left-ios-24"
            onPress={::this.onBackPress}
          />
          <Text style={styles.title}>Loading...</Text>
          <ImageButton
            source={userProfiles.currentProfile.logoSource}
            style={styles.profile}
            onPress={::this.onProfilePress}
          />
        </View>
        <View style={styles.main}>
          <UiLoader style={styles.loader} isLoading />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 11,
    paddingRight: 24,
    paddingBottom: 11,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: '$border_color'
  },

  back: {
    color: '$pe_color_blue'
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '$pe_color_gray'
  },

  profile: {
    width: 30,
    height: 30,
    borderRadius: 15
  },

  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loader: {
    marginTop: 0
  }
});