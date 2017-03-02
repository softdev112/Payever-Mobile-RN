import { StyleSheet, Text } from 'ui';

export default function CountBadge({ value }: PropTypes) {
  if (!value) {
    //noinspection JSConstructorReturnsPrimitive
    return null;
  }

  return (
    <Text style={styles.text}>{value}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: '$pe_color_blue',
    borderRadius: 10,
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
    paddingHorizontal: 5,
  },
});

type PropTypes = {
  value: number;
};