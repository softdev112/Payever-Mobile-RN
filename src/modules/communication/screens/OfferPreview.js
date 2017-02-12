import { Component } from 'react';
import { Image, ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Html, NavBar, StyleSheet, Text, View } from 'ui';

import defaultAvatar
  from '../../../store/UserProfilesStore/images/no-avatar.png';

export default class OfferPreview extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    offer: Object;
  };

  onClosePreview() {
    Navigation.dismissModal({
      animationType: 'slide-down',
    });
  }

  renderContacts(contacts) {
    return (
      <View style={styles.contacts}>
        {contacts.map(contact => <Text key={contact}>{contact}</Text>)}
      </View>
    );
  }

  renderItems(items) {
    return (
      <View style={styles.contacts}>
        {items.map((item) => (
          <View key={item.name}>
            <Text style={styles.textHeader}>Name: {item.name}</Text>
            <Text style={styles.textHeader}>{'Description: '}
              <Text style={styles.textData}>{item.description}</Text>
            </Text>
            <Text style={styles.textHeader}>
              Price: {item.price} {item.currency}
            </Text>
            <Image
              style={styles.itemImage}
              source={{ uri: item.thumbnail }}
            />
          </View>
        ))}
      </View>
    );
  }

  renderPos(pos) {
    return pos.map(posId => <Text key={posId}>{posId}</Text>);
  }

  renderRecipients(recipients) {
    return (
      <View>
        {recipients.map(recipient => <Text key={recipient}>{recipient}</Text>)}
      </View>
    );
  }

  render() {
    const { offer } = this.props;

    let source;
    if (offer.business_logo_url) {
      source = { usi: offer.business_logo_url };
    } else {
      source = defaultAvatar;
    }

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back onPress={::this.onClosePreview} />
          <NavBar.Title title="Got Offer" />
          <NavBar.Button title="Buy" />
        </NavBar>
        <ScrollView
          contentContainerStyle={styles.mainContent}
        >
          <View>
            <Image
              style={styles.avatar}
              source={source}
            />
          </View>

          <Text style={styles.textHeader}>Receivers: </Text>
          {this.renderContacts(offer.contacts)}

          <Text style={styles.textHeader}>
            Ready To Send:
            <Text style={styles.textData}>
              {offer.is_redy_to_send ? ' YES' : ' NO' }
            </Text>
          </Text>

          <Text style={styles.textHeader}>
            Type: <Text style={styles.textData}>{offer.type}</Text>
          </Text>

          <Text style={styles.offerTitle}>
            {offer.title}
          </Text>
          <Html source={offer.description} />

          <Text style={styles.textHeader}>
            {'Shipping Price: '}
            <Text style={styles.textData}>
              {offer.price || '0'} {offer.currency}
            </Text>
          </Text>

          <Text style={styles.textHeader}>
            {'Delivery Time: '}
            <Text style={styles.textData}>
              {offer.delivery_time_label || 'unknown'}
            </Text>
          </Text>

          <Text style={styles.textHeader}>Payment Systems:</Text>

          <View style={styles.pos}>
            {this.renderPos(offer.payment_option_ids)}
          </View>

          <View>{this.renderRecipients(offer.recipients)}</View>

          <View>{this.renderItems(offer.items)}</View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mainContent: {
    justifyContent: 'flex-start',
    padding: 8,
  },

  avatar: {
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  itemImage: {
    marginTop: 10,
    width: 300,
    height: 200,
    alignSelf: 'center',
  },

  textHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },

  textData: {
    fontSize: 14,
  },

  offerTitle: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '500',
    marginVertical: 10,
  },

  pos: {
    flexDirection: 'row',
  },
});