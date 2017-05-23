import { StyleSheet, Text, View } from 'ui';

import Avatar from './Avatar';
import type Contact from '../../../../store/communication/models/Contact';

export default function ({ contact }: { contact: Contact }) {
  return (
    <View style={styles.container}>
      <Avatar avatar={contact.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.text} numberOfLines={1}>{contact.name}</Text>
        {contact.email && (
          <Text style={styles.text} numberOfLines={1}>{contact.email}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 7,
    height: 60,
  },

  textContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 5,
  },

  text: {
    fontSize: 16,
  },
});