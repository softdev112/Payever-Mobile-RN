import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import IconButton from './IconButton';
import StyleSheet from '../StyleSheet';
import { toggleMenu } from '../../Navigation';
import type UserProfilesStore from '../../../store/UserProfilesStore';

//noinspection JSUnresolvedVariable
import defaultAvatar
  from '../../../store/UserProfilesStore/images/no-avatar.png';

@inject('userProfiles')
@observer
export default class Menu extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  static defaultProps = {
    align: 'right',
  };

  context: {
    navigator: Navigator;
  };

  props: {
    userProfiles: UserProfilesStore;
  };

  onPress() {
    toggleMenu(this.context.navigator);
  }

  render() {
    const { userProfiles } = this.props;
    let source;
    if (userProfiles.currentProfile) {
      source = userProfiles.currentProfile.logoSource;
    } else {
      source = defaultAvatar;
    }

    return (
      <IconButton
        imageStyle={styles.icon}
        onPress={::this.onPress}
        source={source}
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },
});