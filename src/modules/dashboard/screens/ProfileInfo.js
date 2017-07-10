import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import moment from 'moment';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Navigator } from 'react-native-navigation';
import {
  ErrorBox, images, Icon, Loader, NavBar, StyleSheet, Text, View,
} from 'ui';
import ProfilesStore from '../../../store/profiles';
import BusinessProfile from '../../../store/profiles/models/BusinessProfile';
import PersonalProfile from '../../../store/profiles/models/PersonalProfile';

@inject('profiles', 'auth')
@observer
export default class ProfileInfo extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    profiles: ProfilesStore;
    profile: BusinessProfile | PersonalProfile;
    navigator: Navigator;
  };

  state: {
    notificationOn: boolean;
  };

  async componentDidMount() {
    const { profile, profiles } = this.props;

    await profiles.getAllOffers(profile.id);
  }

  onClose() {
    const { navigator } = this.props;
    navigator.dismissModal({ animated: true });
  }

  onOfferLinkPress(offerId: number) {
    this.props.navigator.showModal({
      screen: 'marketing.ViewOffer',
      animated: true,
      passProps: {
        offerId,
      },
    });
  }

  renderOffers(offers: OfferRow) {
    return offers.map((offer) => {
      return (
        <TouchableOpacity
          style={styles.offerBtn}
          key={offer.id}
          onPress={() => this.onOfferLinkPress(offer.id)}
        >
          <Text style={styles.offerText}>
            {moment(offer.created_at).format('Y-MM-DD HH:MM:SS')} #{offer.id}
          </Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    const { profile, profiles } = this.props;
    const { isLoading, error, profileOffers } = profiles;

    const logo = profile.business.logo;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back onPress={::this.onClose} />
          <NavBar.Title title="Profile Details" />
        </NavBar>
        <Loader isLoading={isLoading}>
          {error !== '' ? (
            <ErrorBox message={error} />
          ) : (
            <View style={styles.userInfo}>
              <Icon
                style={styles.avatarImage}
                source={logo ? { uri: logo } : images.noAvatar}
              />
              <Text style={styles.name}>{profile.business.name}</Text>
              <View style={styles.offersContainer}>
                <Text style={styles.offersTitle}>
                  Offers: {profileOffers.length}
                </Text>
                <Loader isLoading={isLoading}>
                  {(profileOffers.length > 0) && (
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.offersInsideCont}
                    >
                      {this.renderOffers(profileOffers)}
                    </ScrollView>
                  )}
                </Loader>
              </View>
            </View>
          )}
        </Loader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },

  userInfo: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  name: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 8,
  },

  grayDivider: {
    height: 28,
    width: '100%',
    backgroundColor: '$pe_color_apple_div',
  },

  switchBoxCont: {
    paddingHorizontal: 15,
  },

  offersContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },

  offersInsideCont: {
    paddingTop: 8,
    paddingHorizontal: 15,
  },

  offersTitle: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: '$font_family',
    color: '$pe_color_gray',
    paddingTop: 6,
    paddingBottom: 2,
    paddingHorizontal: 16,
    backgroundColor: '$pe_color_apple_div',
  },

  offerBtn: {
    padding: 3,
  },

  offerText: {
    color: '$pe_color_blue',
  },
});

type OfferRow = {
  id: number;
  created_at: string;
  slug: string;
};