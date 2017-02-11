import { Icon, StyleSheet, Text, View } from 'ui';

export default function Title({ icon, title }: PropTypes) {
  return (
    <View style={styles.container}>
      <Icon style={styles.icon} source={icon} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },

  icon: {
    width: 25,
  },

  title: {
    fontSize: 14,
  },
});

type PropTypes = {
  icon: string;
  text: string;
};