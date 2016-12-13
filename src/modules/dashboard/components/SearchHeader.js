import type UserProfilesStore from '../../../store/UserProfilesStore/index';

import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ImageButton, StyleSheet, Text, View } from 'ui';

import imgArrowDown from '../images/arrow_down.png';

@inject('userProfiles')
@observer
export default class SearchHeader extends Component {
  props: {
    navigator: Navigator,
    userProfiles?: UserProfilesStore
  };

  onProfilePress() {
    const { navigator } = this.props;
    navigator.resetTo({
      screen: 'dashboard.Dashboard',
      title: 'Home',
      animated: true
    });
  }

  onMenuPress() {
    const { navigator } = this.props;
    navigator.toggleDrawer({
      side: 'right',
      animated: true
    });
  }

  render() {
    const { userProfiles } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.rightBox}>
          <ImageButton
            source={userProfiles.currentProfile.logoSource}
            imageStyle={styles.profileImage}
            onPress={::this.onProfilePress}
          />
          <ImageButton
            source={imgArrowDown}
            style={styles.arrowDown}
            imageStyle={styles.arrowDown_image}
            onPress={::this.onMenuPress}
          />
        </View>
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

  rightBox: {
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },

  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15
  },

  arrowDown: {
    marginTop: 13,
    marginLeft: 10
  },

  arrowDown_image: {
    width: 15,
    height: 8
  },
});