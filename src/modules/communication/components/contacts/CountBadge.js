import { StyleSheet, Text, View } from 'ui';

export default function CountBadge({ value }: PropTypes) {
  if (!value) {
    //noinspection JSConstructorReturnsPrimitive
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '$pe_color_blue',
    borderRadius: 10,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  text: {
    color: '#fff',
    fontSize: 13,
  },
});

type PropTypes = {
  value: number;
};