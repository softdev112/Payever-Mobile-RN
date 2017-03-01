import { View } from 'react-native';
import Loader from '../Loader';
import StyleSheet from '../StyleSheet';

export default function WebViewLoader() {
  return (
    <View style={styles.container}>
      <Loader isLoading />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 4,
  },
});