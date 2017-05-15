import { images, NavBar, StyleSheet, View } from 'ui';
import Contacts from '../components/contacts';
import Dock from '../../../modules/core/components/Dock';

export default function () {
  return (
    <View style={styles.container}>
      <NavBar>
        <NavBar.Title title="Communication" source={images.communication} />
        <NavBar.Menu />
      </NavBar>
      <Contacts style={styles.contacts} phoneView />
      <Dock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },

  contacts: {
    flex: 1,
  },
});