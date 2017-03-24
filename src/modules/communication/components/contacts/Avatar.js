import { Icon, StyleSheet, Text, View } from 'ui';
import type Avatar from '../../../../store/communication/models/Avatar';

export default function ({ avatar, style, lettersStyle }: AvatarPropTypes) {
  if (avatar.type === 'url') {
    const avatarUrl = avatar.valueRetina || avatar.value;
    return (
      <Icon style={[styles.avatar, style]} source={{ uri: avatarUrl }} />
    );
  }

  if (avatar.type === 'letters') {
    return (
      <View style={[styles.avatarLetters, style]}>
        <Text style={[styles.avatarText, lettersStyle]}>{avatar.value}</Text>
      </View>
    );
  }

  return null;
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
    fontSize: 16,
  },
});

type AvatarPropTypes = {
  avatar: Avatar;
  style?: Object;
  lettersStyle?: Object;
};