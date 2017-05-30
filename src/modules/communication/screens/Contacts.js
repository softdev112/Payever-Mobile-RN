import { images, NavBar, StyleSheet, View } from 'ui';
import Contacts from '../components/contacts';

export default function ContactsScreen(
  { style, phoneView }: ComponentPropTypes
) {
  return (
    <View style={[styles.container, style]}>
      <NavBar>
        <NavBar.Back />
        <NavBar.Title title="Communication" source={images.communication} />
        <NavBar.Menu />
      </NavBar>
      <Contacts phoneView={phoneView} />
    </View>
  );
}

ContactsScreen.defaultProps = {
  phoneView: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type ComponentPropTypes = {
  style?: Object;
  phoneView: boolean;
};