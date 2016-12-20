import type UserProfilesStore from '../../../../store/UserProfilesStore';

import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Icon, ImageButton, Loader, StyleSheet, Text, View } from 'ui';

@inject('userProfiles')
@observer
export default class WebViewLoader extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    userProfiles: PropTypes.object
  };

  props: {
    navigator: Navigator;
    userProfiles?: UserProfilesStore;
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
          <Loader style={styles.loader} isLoading />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 4,
    backgroundColor: '#fff'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    paddingTop: 13,
    paddingRight: 24,
    paddingBottom: 11,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderBottomColor: '$pe_color_light_gray_1'
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