import { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from '../Icon';
import StyleSheet from '../StyleSheet';
import type Avatar from '../../../store/communication/models/Avatar';

export default class AvatarButton extends Component {
  static defaultProps = {
    align: 'right',
  };

  props: {
    avatar: Avatar;
    onPress?: Function;
    style?: Object;
    lettersStyle?: Object;
  };

  onPress() {
    const { onPress } = this.props;

    if (onPress) {
      onPress();
    }
  }

  render() {
    const { avatar, lettersStyle, style } = this.props;

    if (avatar.type === 'url') {
      const avatarUrl = avatar.valueRetina || avatar.value;
      return (
        <Icon
          style={[styles.avatar, style]}
          source={{ uri: avatarUrl }}
          onPress={::this.onPress}
        />
      );
    }

    if (avatar.type === 'letters') {
      return (
        <View style={[styles.avatarLetters, style]}>
          <TouchableOpacity
            style={styles.avatarLetters}
            onPress={::this.onPress}
          >
            <Text style={[styles.avatarText, lettersStyle]}>
              {avatar.value}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },

  avatarLetters: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#666',
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    width: 32,
  },

  avatarText: {
    fontSize: 15,
  },
});