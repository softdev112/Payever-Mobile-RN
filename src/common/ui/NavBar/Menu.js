import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import IconButton from './IconButton';
import images from '../images';
import StyleSheet from '../StyleSheet';
import { toggleMenu } from '../../Navigation';
import type ProfilesStore from '../../../store/profiles';

//noinspection JSUnresolvedVariable

@inject('profiles')
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
    profiles: ProfilesStore;
    onPress?: Function;
  };

  onPress() {
    const { onPress } = this.props;

    if (onPress) {
      onPress();
    } else {
      toggleMenu(this.context.navigator);
    }
  }

  render() {
    const { profiles } = this.props;
    let source;
    if (profiles.currentProfile) {
      source = profiles.currentProfile.logoSource;
    } else {
      source = images.noAvatar;
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