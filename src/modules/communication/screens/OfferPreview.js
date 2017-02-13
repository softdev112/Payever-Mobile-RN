import { Component } from 'react';
import { Image, ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Icon, Html, NavBar, StyleSheet, Text, View } from 'ui';

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

  renderItems(items) {
    return (
      items.map((item) => (
        <View key={item.name}>
          <Image
            style={styles.itemImage}
            source={{ uri: item.origin_image }}
            resizeMode="contain"
          />
          <Text style={styles.itemTitle}>{item.name}</Text>
          <View style={styles.priceBlock}>
            <Text style={styles.price}>
              {formatCurrency(item.positions[0].price)}
            </Text>
            <Icon
              style={styles.currencyIcon}
              source="fa-euro"
            />
          </View>
        </View>
      ))
    );
  }

  render() {
    const { offer } = this.props;
    const { marketing_channel_set: offerDetails } = offer;

    let source;
    if (offer.business_logo_url) {
      source = { usi: offer.business_logo_url };
    } else {
      source = defaultAvatar;
    }

    const createDate = new Date(offer.created_at);
    const diffTime = Math.floor((Date.now() - createDate) / 60000);

    let diffTimeStr;
    if (diffTime > 60) {
      diffTimeStr = `created: ${Math.floor(diffTime / 60)} hours ago`;
    } else {
      diffTimeStr = `created: ${diffTime} minutes ago`;
    }

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back onPress={::this.onClosePreview} />
          <NavBar.Title title="Best Offers" />
        </NavBar>
        <ScrollView
          contentContainerStyle={styles.mainContent}
        >
          <Image
            style={styles.avatar}
            source={source}
          />
          <Text style={styles.storeTitle}>
            {offerDetails.store.business.name}
          </Text>

          <View style={styles.offerInfoBlock}>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <View>
              <Text style={styles.createdTime}>
                {diffTimeStr}
              </Text>
            </View>
            <Html source={offer.description} />
          </View>

          <View>
            {this.renderItems(offerDetails.store.items)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

function formatCurrency(value) {
  if (value === ''
    || (typeof value !== 'string' && typeof value !== 'number')) {
    return value;
  }

  const separator = ',';
  const dot = '.';

  const inputStr = typeof value === 'number' ? value.toFixed(2) : value;
  const strValParts = inputStr.split(dot);
  const valueLength = strValParts[0].length;
  const mainPartStr = strValParts[0];

  if (valueLength <= 3) {
    return (
      mainPartStr + dot + (strValParts.length > 1 ? strValParts[1] : '00')
    );
  }

  let outStr = '';
  let count = 0;
  for (let i = valueLength - 1; i >= 0; i -= 1) {
    const current = mainPartStr.charAt(i);
    outStr = current + outStr;
    count += 1;

    if (count % 3 === 0 && i !== 0) {
      outStr = separator + outStr;
    }
  }

  return outStr + dot + (strValParts.length > 1 ? strValParts[1] : '00');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mainContent: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  storeTitle: {
    fontSize: 26,
    fontWeight: '500',
    marginBottom: 20,
  },

  offerInfoBlock: {
    alignItems: 'flex-start',
  },

  offerTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 2,
  },

  createdTime: {
    color: '$pe_color_gray',
    fontSize: 16,
    marginBottom: 15,
  },

  $imgWidth: '85%',
  $maxImgDim: 600,
  itemImage: {
    marginTop: 8,
    width: '$imgWidth',
    height: '$imgWidth',
    maxWidth: '$maxImgDim',
    maxHeight: '$maxImgDim',
  },

  timePass: {
    fontSize: 14,
    color: '$pe_color_gray',
  },

  itemTitle: {
    fontSize: 24,
    alignSelf: 'center',
    marginBottom: 8,
  },

  priceBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },

  price: {
    fontSize: 24,
    color: '$pe_color_gray',
  },

  currencyIcon: {
    fontSize: 22,
    color: '$pe_color_gray',
    marginLeft: 10,
  },
});