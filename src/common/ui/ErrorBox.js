import { View } from 'react-native';
import Icon from './Icon';
import StyleSheet from './StyleSheet';
import Text from './Text';

export default function ErrorBox({ message }: PropTypes) {
  return (
    <View style={styles.container}>
      <Icon style={styles.icon} source="icon-alert-32" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  icon: {
    color: '$pe_color_red',
    marginBottom: 10,
  },

  message: {
    textAlign: 'center',
    fontSize: 15,
  },
});

type PropTypes = {
  message: string;
};