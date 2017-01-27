import { Icon, StyleSheet, Text, View } from 'ui';

export default function ChatMessage({ message }: PropTypes) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Icon
          style={styles.avatar}
          source={{ uri: message.avatar }}
        />
      </View>
      <View style={styles.textContent}>
        <View style={styles.titleRow}>
          <Text style={styles.userName}>{`${message.userName} `}</Text>
          <Text style={styles.date}>{message.date}</Text>
        </View>
        <Text style={styles.message}>{message.message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },

  avatar: {
    width: 30,
    height: 30,
  },

  textContent: {
    paddingLeft: 10,
  },

  titleRow: {
    flexDirection: 'row',
  },

  userName: {
    fontSize: 12,
    color: '#000',
  },

  date: {
    fontSize: 12,
    color: '$pe_color_gray',
  },

  message: {
    fontSize: 14,
    color: '$pe_color_gray_2',
  },
});

type PropTypes = {
  message: Object;
};