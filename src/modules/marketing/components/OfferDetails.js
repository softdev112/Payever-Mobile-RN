import { Component } from 'react';
import { Dimensions, Image } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Html, Link, StyleSheet, Text, View } from 'ui';
import { format } from 'utils';
import type Offer, { OfferItem }
  from '../../../store/offers/models/Offer';

@inject('config')
@observer
export default class OfferDetails extends Component {
  static defaultProps = {
    mode: 'chat',
  };

  props: {
    mode?: 'full' | 'chat';
    offer: Offer;
  };

  render() {
    const { mode, offer } = this.props;
    const description = offer.description;
    const items = offer.marketing_channel_set.store.items;
    const slug = offer.marketing_channel_set.slug;

    return (
      <View style={styles.container}>
        <Html source={description} />
        {items.map(item => (
          <OfferItemView key={item.id} item={item} mode={mode} slug={slug} />
        ))}
      </View>
    );
  }
}

function OfferItemView({ item, mode, slug }: OfferItemProps) {
  const imageUri = item.thumbnail;

  const price = calcItemsPrice(item.positions);

  const linkProps = { marketingSlug: slug, itemId: item.id };

  const maxWidth = mode === 'full' ? 540 : 320;
  const imageHeight = calcImageHeight(mode, maxWidth);

  return (
    <View style={[styles.item, { maxWidth }]}>
      <Image
        style={[styles.item_image, { height: imageHeight }]}
        source={{ uri: imageUri }}
      />
      <Text style={styles.item_name}>{item.name}</Text>
      <Text style={styles.item_price}>{price}</Text>
      <Link
        style={styles.item_link}
        screen="marketing.BuyOffer"
        props={linkProps}
      >
        Buy Offer
      </Link>
    </View>
  );
}

function calcItemsPrice(positions) {
  const prices = positions.map(p => p.price);
  const min = format.currency(Math.min(...prices));
  const max = format.currency(Math.max(...prices));
  return min === max ? min : `${min} - ${max}`;
}


function calcImageHeight(mode, maxWidth) {
  const margins = mode === 'full' ? 20 : 130;
  const winWidth = Dimensions.get('window').width;
  const maxImgWidth = Math.min(winWidth - margins, maxWidth);
  return Math.round(maxImgWidth * 0.7);
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  item: {
    marginTop: 20,
    maxWidth: 320,
  },

  item_image: {
    width: null,
    flex: 1,
    resizeMode: 'contain',
  },

  item_link: {
    fontSize: 15,
    paddingVertical: 6,
    textAlign: 'center',
  },

  item_name: {
    fontSize: 15,
    paddingTop: 10,
    textAlign: 'center',
  },

  item_price: {
    color: '$pe_color_gray_2',
    fontSize: 14,
    paddingTop: 2,
    textAlign: 'center',
  },
});

type OfferItemProps = {
  item: OfferItem;
  mode: 'full' | 'chat';
  slug: string;
};