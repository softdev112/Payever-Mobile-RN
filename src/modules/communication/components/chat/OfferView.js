import { Component } from 'react';
import { Image } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Html, StyleSheet, Text, View } from 'ui';
import { log } from 'utils';
import type Offer, { OfferItem }
from '../../../../store/CommunicationStore/models/Offer';

@inject('config')
@observer
// eslint-disable-next-line react/prefer-stateless-function
export default class OfferView extends Component {
  props: {
    offer: Offer;
  };

  render() {
    const offer = this.props.offer;
    const description = offer.description;
    const items = offer.marketing_channel_set.store.items;

    log.info('DUMP1', items);

    return (
      <View style={styles.container}>
        <Html source={description} />
        {items.map(item => <OfferItemView key={item.id} item={item} />)}
      </View>
    );
  }
}

function OfferItemView({ item }: { item: OfferItem }) {
  const imageUri = item.thumbnail;
  const names = item.positions.map(p => p.name);
  const prices = item.positions.map(p => p.price);

  let price = prices[0];
  if (prices.length > 1) {
    price = Math.min(...prices) + ' - ' + Math.max(...prices);
  }

  log.info('DUMP', imageUri);

  return (
    <View style={styles.item}>
      <Image style={styles.item_image} source={{ uri: imageUri }} />
      <Text style={styles.item_name}>{names.join(' ')}</Text>
      <Text style={styles.item_price}>{price}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  item_image: {
    height: 150,
    resizeMode: 'contain',
  },

  item_name: {
    textAlign: 'center',
  },

  item_price: {
    textAlign: 'center',
  },
});