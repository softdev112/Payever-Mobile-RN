import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Navigator } from 'react-native-navigation';
import { ErrorBox, Loader, NavBar, StyleSheet, Text, View } from 'ui';

import type CommunicationStore from '../../../store/communication';
import Avatar from '../components/contacts/Avatar';
import CheckBoxPref from '../components/settings/CheckBoxPref';

@inject('communication')
@observer
export default class ConversationSettings extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    navigator: Navigator;
  };

  state: {
    notificationOn: boolean;
  };

  constructor(props) {
    super(props);

    const { messengerInfo, selectedConversationId } = this.props.communication;
    this.state = {
      notificationOn: messengerInfo.byId(selectedConversationId).notification,
    };
  }

  async componentWillMount() {
    const { communication } = this.props;
    const { selectedConversation } = communication;

    // Reload settings
    const conversationSettings =
      await communication.getConversationSettings(selectedConversation.id);
    selectedConversation.setConversationSettings(conversationSettings);

    this.setState({ notificationOn: conversationSettings.notification });
  }

  onConvNotificationPropChange(value) {
    const { communication } = this.props;
    communication.changeConvNotificationProp(value);
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
          <Text style={styles.offerText}>{offer.created_at} #{offer.id}</Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    const {
      settingsLoading, selectedConversation: { settings },
    } = this.props.communication;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Conversation Settings" />
        </NavBar>
        <Loader isLoading={settingsLoading.isLoading}>
          {settingsLoading.error || !settings ? (
            <ErrorBox
              message={settingsLoading.error
                || 'Error while loading settings. Try again later please'}
            />
          ) : (
            <View style={styles.userInfo}>
              <Avatar
                style={styles.avatar}
                lettersStyle={styles.avatarLetters}
                avatar={settings.avatar}
              />
              <Text style={styles.name}>
                {settings.name}
              </Text>
              <View style={styles.grayDivider} />
              <CheckBoxPref
                style={styles.switchBoxCont}
                value={settings.notification}
                title="Notifications"
                icon="fa-bell-o"
                onValueChange={::this.onConvNotificationPropChange}
              />
              {(settings.offers && settings.offers.length > 0) && (
                <View style={styles.offersContainer}>
                  <Text style={styles.offersTitle}>Sent Offers:</Text>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.offersInsideCont}
                  >
                    {this.renderOffers(settings.offers)}
                  </ScrollView>
                </View>
              )}
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

  userInfo: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    marginRight: 0,
  },

  avatarLetters: {
    fontSize: 34,
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