import { Icon, StyleSheet, Text, View } from 'ui';
import type Avatar from '../../../../store/communication/models/Avatar';

export default function ({ avatar }: { avatar: Avatar }) {
  if (avatar.type === 'url') {
    const avatarUrl = avatar.valueRetina || avatar.value;
    return (
      <Icon style={styles.avatar} source={{ uri: avatarUrl }} />
    );
  }

  if (avatar.type === 'letters') {
    return (
      <View style={styles.avatarLetters}>
        <Text style={styles.avatarText}>{avatar.value}</Text>
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

  avatarText: {
    fontSize: 16,
  },
});