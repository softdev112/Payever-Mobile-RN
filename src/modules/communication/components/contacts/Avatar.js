import { Icon, StyleSheet, Text, View } from 'ui';
import type Avatar from '../../../../store/communication/models/Avatar';

export default function ({ avatar, style }: AvatarPropTypes) {
  if (avatar.type === 'url') {
    const avatarUrl = avatar.valueRetina || avatar.value;
    return (
      <Icon style={[styles.avatar, style]} source={{ uri: avatarUrl }} />
    );
  }

  let fontSize = 16;
  let propsStyle;
  if (style) {
    propsStyle = StyleSheet.flatten(style);

    if (propsStyle.fontSize) {
      fontSize = propsStyle.fontSize;
      delete propsStyle.fontSize;
    }
  }

  if (avatar.type === 'letters') {
    return (
      <View style={[styles.avatarLetters, propsStyle]}>
        <Text style={{ fontSize }}>{avatar.value}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 16,
    height: 32,
    marginRight: 22,
    width: 32,
  },

  avatarLetters: {
    alignItems: 'center',
    borderColor: '#666',
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    marginRight: 22,
    width: 32,
  },
});

type AvatarPropTypes = {
  avatar: Avatar;
  style: Object;
};