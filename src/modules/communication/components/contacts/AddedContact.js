import { observer } from 'mobx-react/native';
import { Icon, View, StyleSheet } from 'ui';

import ContactPreview from './ContactPreview';
import type Contact from '../../../../store/communication/models/Contact';
import type CommunicationStore from '../../../../store/communication';

export default observer(['communication'], (
  { communication, contact }: { communication: CommStore; contact: Contact }
) => {
  return (
    <View style={styles.container}>
      <ContactPreview
        contact={contact}
      />
      <Icon
        onPress={() => communication.removeContactForGroup(contact.id)}
        source="icon-trashcan-24"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 300,
    marginLeft: 10,
    height: 60,
    backgroundColor: '#FFF',
    borderColor: '$pe_color_twitter',
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
});

type CommStore = CommunicationStore;