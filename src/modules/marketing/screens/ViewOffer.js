import { Component, PropTypes } from 'react';
import { Image, ScrollView } from 'react-native';
import { Navigation, Navigator } from 'react-native-navigation';
import { observer, inject } from 'mobx-react/native';
import {
  images, Loader, NavBar, StyleSheet, Text, View,
} from 'ui';
import { format } from 'utils';


import type UserProfilesStore from '../../../store/UserProfilesStore';
import OfferView from '../components/OfferView';

@inject('userProfiles')
@observer
export default class OfferPreview extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  props: {
    offerId: string;
    userProfiles: UserProfilesStore;
  };

  context: {
    navigator: Navigator;
  };

  async componentWillMount() {
    const { userProfiles, offerId } = this.props;
    await userProfiles.getOfferById(offerId);
  }

  onClosePreview() {
    Navigation.dismissModal({
      animationType: 'slide-down',
    });
  }

  renderOffer(offer) {
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
    const { offerId, userProfiles } = this.props;
    const offer = userProfiles.offers[offerId];

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back onPress={::this.onClosePreview} />
          <NavBar.Title title="Best Offers" />
        </NavBar>
        <Loader isLoading={userProfiles.isLoading}>
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