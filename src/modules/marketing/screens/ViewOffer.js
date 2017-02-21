import { Component } from 'react';
import { Image, ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { observer, inject } from 'mobx-react/native';
import {
  images, Loader, NavBar, StyleSheet, Text, View,
} from 'ui';
import { format } from 'utils';

import OfferView from '../components/OfferView';
import OffersStore from '../../../store/OffersStore/index';
import Offer from '../../../store/OffersStore/models/Offer';

@inject('offers')
@observer
export default class OfferPreview extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    offerId: string;
    offers?: OffersStore;
  };

  constructor(props) {
    super(props);
    this.state = {
      offer: null,
    };
  }

  async componentWillMount() {
    const { offers, offerId } = this.props;
    this.setState({
      offer: await offers.getOfferById(offerId),
    });
  }

  onClosePreview() {
    Navigation.dismissModal({
      animationType: 'slide-down',
    });
  }

  renderOffer(offer: Offer) {
    const { marketing_channel_set: offerDetails } = offer;

    let source;
    if (offerDetails.store.business.logo) {
      source = { uri: offerDetails.store.business.logo };
    } else {
      source = images.noBusiness;
    }

    return (
      <ScrollView contentContainerStyle={styles.mainContent}>
        <Image style={styles.avatar} source={source} />
        <Text style={styles.storeTitle}>
          {offerDetails.store.business.name}
        </Text>

        <View style={styles.offerInfoBlock}>
          <Text style={styles.offerTitle}>{offer.title}</Text>
          <Text style={styles.createdTime}>
            created {format.timeFromNow(offer.created_at)}
          </Text>
        </View>

        <View style={styles.offerDetails}>
          <OfferView mode="full" offer={offer} />
        </View>
      </ScrollView>
    );
  }

  render() {
    const { offers } = this.props;
    const { offer } = this.state;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back onPress={::this.onClosePreview} />
          <NavBar.Title title="Best Offers" />
        </NavBar>
        <Loader isLoading={offers.isLoading}>
          {offer && this.renderOffer(offer)}
        </Loader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mainContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
  },

  avatar: {
    borderRadius: 50,
    height: 100,
    width: 100,
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

  offerDetails: {
    minWidth: '70%',
    maxWidth: 540,
  },
});