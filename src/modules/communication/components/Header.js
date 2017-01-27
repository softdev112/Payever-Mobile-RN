import { Icon, StyleSheet, Text, View } from 'ui';

const TITLES = {
  direct: 'DIRECT MESSAGES',
  groups: 'GROUPS',
};

export default function Header({ type }: PropTypes) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{TITLES[type]}</Text>
      <Icon
        style={styles.add}
        source="icon-plus-circle-24"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 10,
  },

  title: {
    color: '#959ba3',
    flex: 1,
    fontSize: 10,
  },

  add: {
    color: '$pe_icons_color',
    fontSize: 16,
    width: 16,
    height: 17,
  },
});

type PropTypes = {
  type: string;
};